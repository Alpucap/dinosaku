import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { storyId, title, studentIds } = await req.json();

    if (!storyId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ error: 'Data tugas tidak lengkap' }, { status: 400 });
    }

    const story = await prisma.story.findUnique({
      where: { id: storyId },
      select: { id: true, title: true, theme: true },
    });

    const assignments = studentIds.map((id: string) => ({
      assigneeId: id,
      assignerId: user.id,
      topic: title || story?.title || 'Tugas Cerita',
      theme: story?.theme || '',
      storyId,
      status: 'PENDING' as const,
    }));

    if (assignments.length > 0) {
      await prisma.assignment.createMany({
        data: assignments,
      });
    }

    revalidatePath('/pembimbing/koleksi');
    revalidatePath('/pembimbing/aksi');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error assigning stories:', error);
    return NextResponse.json({ error: 'Failed to assign stories' }, { status: 500 });
  }
}
