import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user || user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 });
    }

    const existing = await prisma.classroom.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const updated = await prisma.classroom.update({
      where: { id },
      data: { name: body.name.trim() },
      include: { _count: { select: { students: true } } }
    });

    return NextResponse.json({ success: true, classroom: updated });
  } catch (error) {
    return NextResponse.json({ error: "Gagal update kelas" }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: any) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    if (!user || user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const existing = await prisma.classroom.findUnique({ where: { id } });
    if (!existing || existing.teacherId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.classroom.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus kelas" }, { status: 500 });
  }
}
