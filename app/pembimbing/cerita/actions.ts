'use server';

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { generateStoryAndQuiz } from '@/lib/gemini';
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
  
  // Format pagesData
  const pagesData = storyData.panels.map((p: any) => ({
    text: p.text,
    imagePrompt: p.imagePrompt,
    imageUrl: p.imageUrl || '' // Can generate image asynchronously later if needed
  }));

  // Save to DB
  const story = await prisma.story.create({
    data: {
      title: storyData.title,
      topic,
      theme,
      pagesData: JSON.stringify({ panels: pagesData, quiz: storyData.quiz }),
      isPreset: false,
      userId: user.id // Created by teacher
    }
  });

  // Create assignments
  if (studentIds.length > 0) {
    const assignments = studentIds.map(studentId => ({
      assignerId: user.id,
      assigneeId: studentId,
      topic,
      theme,
      storyId: story.id,
      status: 'PENDING' as const
    }));
    await prisma.assignment.createMany({ data: assignments });
  }

  revalidatePath('/pembimbing/cerita');
  revalidatePath('/pembimbing/aksi');
  return story.id;
}
