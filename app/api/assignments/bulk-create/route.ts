import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { assignExistingStory } from '@/app/pembimbing/cerita/actions';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { storyId, title, studentIds } = await req.json();
    
    await assignExistingStory(storyId, title, studentIds);
    revalidatePath('/pembimbing/koleksi');
    revalidatePath('/pembimbing/aksi');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning stories:', error);
    return NextResponse.json({ error: 'Failed to assign stories' }, { status: 500 });
  }
}
