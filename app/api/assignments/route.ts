import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const assignments = await prisma.assignment.findMany({
      where: {
        assigneeId: user.id,
        status: 'PENDING'
      },
      include: { assigner: { select: { fullName: true } } },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { assignmentId, status } = await req.json();

    const updated = await prisma.assignment.update({
      where: { id: assignmentId, assigneeId: user.id },
      data: { status }
    });

    return NextResponse.json({ assignment: updated });
  } catch (error) {
    console.error('Error updating assignment:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}
