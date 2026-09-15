import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || (user.role !== 'parents' && user.role !== 'teacher')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await req.json();

    if (user.role === 'teacher') {
      // Guru menghapus dari kelas
      await prisma.user.update({
        where: { id: childId },
        data: { classCode: null }
      });
    } else if (user.role === 'parents') {
      // Orang tua memutuskan akun anak
      await prisma.user.update({
        where: { id: childId },
        data: { parentId: null }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error unlinking child:', error);
    return NextResponse.json({ error: 'Failed to unlink child' }, { status: 500 });
  }
}
