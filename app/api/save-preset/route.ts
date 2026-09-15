import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadBase64ToFirebase } from '@/lib/firebase/admin';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { story, images, assignmentId } = await req.json();

    if (!story || !images) {
      return NextResponse.json({ error: 'Missing story or images' }, { status: 400 });
    }

    // Generate unique ID for this story
    const storyId = crypto.randomUUID();
    const savedStory = { ...story, id: storyId };
    
    // Process and save images to Firebase Storage
    for (let i = 0; i < savedStory.panels.length; i++) {
      const base64Str = images[i];
      if (base64Str && base64Str.startsWith('data:image')) {
        const filename = `${storyId}-panel${i + 1}.png`;
        const publicUrl = await uploadBase64ToFirebase(base64Str, filename, 'petualangan');
        savedStory.panels[i].imageUrl = publicUrl;
      } else if (base64Str) { 
        savedStory.panels[i].imageUrl = base64Str;
      }
    }

    // Save to Prisma
    const dbRecord = await prisma.story.create({
      data: {
        id: storyId,
        title: savedStory.title,
        theme: savedStory.theme,
        topic: savedStory.topic,
        pagesData: {
          panels: savedStory.panels,
          quiz: savedStory.quiz,
        },
        isPreset: true, // Masukkan ke peta petualangan
      }
    });

    if (assignmentId) {
      await prisma.assignment.update({
        where: { id: assignmentId },
        data: { status: 'COMPLETED' }
      });
    }

    return NextResponse.json({ success: true, storyId: dbRecord.id });
  } catch (error) {
    console.error('Error saving preset to DB/Firebase:', error);
    return NextResponse.json({ error: 'Failed to save preset' }, { status: 500 });
  }
}
