'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { generateStoryAndQuiz, generateComicImage } from '@/lib/gemini';
import { uploadBase64ToFirebase } from '@/lib/firebase/admin';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';

export async function getTeacherStudentsForAssign() {
  const user = await getSessionUser();
  if (!user || user.role !== 'teacher') throw new Error('Unauthorized');

  const guardian = await prisma.user.findUnique({ where: { id: user.id }});
  if (!guardian?.classCode) return [];

  const students = await prisma.user.findMany({
    where: { role: 'CHILDREN', classCode: guardian.classCode },
    select: { id: true, fullName: true, username: true }
  });
  return students;
}

export async function getTeacherEnergy() {
  const user = await getSessionUser();
  if (!user || user.role !== 'teacher') throw new Error('Unauthorized');

  const gamification = await prisma.gamification.findUnique({ where: { userId: user.id }});
  return gamification?.energy || 0;
}

export async function createAndAssignStory(topic: string, theme: string, studentIds: string[]) {
  const user = await getSessionUser();
  if (!user || user.role !== 'teacher') throw new Error('Unauthorized');

  // Deduct energy
  const gamification = await prisma.gamification.findUnique({ where: { userId: user.id }});
  if (!gamification || gamification.energy < 1) {
    throw new Error('Energi tidak cukup! Upgrade lisensi premium untuk energi lebih banyak.');
  }

  await prisma.gamification.update({
    where: { userId: user.id },
    data: { energy: { decrement: 1 } }
  });

  // Generate Story
  const storyData = await generateStoryAndQuiz(topic, theme);
  
  // Generate UUID for the story early so we can name files
  const storyId = crypto.randomUUID();

  // Format pagesData and generate images
  const pagesData = [];
  for (let i = 0; i < storyData.panels.length; i++) {
    const p = storyData.panels[i];
    let finalImageUrl = p.imageUrl || '';
    if (!finalImageUrl && p.imagePrompt) {
      try {
        const base64 = await generateComicImage(p.imagePrompt);
        const filename = `${storyId}-panel${i + 1}.webp`;
        finalImageUrl = await uploadBase64ToFirebase(base64, filename, 'petualangan');
      } catch (err) {
        console.error('Failed to generate/upload image for panel', i, err);
      }
    }
    pagesData.push({
      text: p.text,
      imagePrompt: p.imagePrompt,
      imageUrl: finalImageUrl
    });
  }

  // Save to DB
  const story = await prisma.story.create({
    data: {
      id: storyId,
      title: storyData.title,
      topic,
      theme,
      pagesData: { panels: pagesData, quiz: storyData.quiz },
      isPreset: false,
      userId: user.id // Created by teacher
    }
  });

  // We NO LONGER assign immediately here if we want to preview first.
  // Actually, wait, CeritaClient will now just pass studentIds to the redirect URL.
  // So we don't create assignments here at all!
  // Let's comment this out for now, or just leave it. If studentIds is empty, it doesn't assign.
  
  revalidatePath('/pembimbing/koleksi');
  return story.id;
}

export async function assignExistingStory(storyId: string, title: string, studentIds: string[]) {
  const user = await getSessionUser();
  if (!user || user.role !== 'teacher') throw new Error("Unauthorized");

  // Verify story belongs to teacher
  const story = await prisma.story.findUnique({ where: { id: storyId, userId: user.id } });
  if (!story) throw new Error("Story not found");

  const assignments = studentIds.map(id => ({
    assigneeId: id,
    assignerId: user.id,
    topic: title,
    theme: story.theme || '',
    storyId: story.id,
    status: 'PENDING' as const
  }));

  if (assignments.length > 0) {
    await prisma.assignment.createMany({
      data: assignments
    });
  }
}
