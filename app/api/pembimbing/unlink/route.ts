import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || !['parents', 'teacher'].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { childId, classId } = await req.json();

    if (user.role === 'teacher') {
      let classroomsToDisconnect: { id: string }[] = [];
      if (classId) {
        // Hanya hapus dari 1 kelas spesifik (harus milik guru ini)
        const cls = await prisma.classroom.findUnique({ where: { id: classId } });
        if (cls && cls.teacherId === user.id) {
          classroomsToDisconnect = [{ id: classId }];
        }
      } else {
        // Hapus dari semua kelas milik guru ini
        classroomsToDisconnect = await prisma.classroom.findMany({
          where: { teacherId: user.id, students: { some: { id: childId } } },
          select: { id: true }
        });
      }
      
      if (classroomsToDisconnect.length > 0) {
        await prisma.user.update({
          where: { id: childId },
          data: { joinedClasses: { disconnect: classroomsToDisconnect.map(c => ({ id: c.id })) } }
        });
      }
    } else if (user.role === 'parents') {
      await prisma.user.update({
        where: { id: childId },
        data: { parentId: null }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memutus tautan" }, { status: 500 });
  }
}
