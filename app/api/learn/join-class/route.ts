import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { findClassroomByCode, normalizeClassCode } from "@/lib/data/class";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus masuk dulu untuk bergabung ke kelas." },
        { status: 401 },
      );
    }

    if (user.role !== "children") {
      return NextResponse.json(
        { error: "Hanya akun anak yang bisa bergabung ke kelas." },
        { status: 403 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const code = normalizeClassCode(String(body?.code ?? ""));

    if (!code) {
      return NextResponse.json(
        { error: "Kode kelasnya belum diisi." },
        { status: 400 },
      );
    }

    const classroom = await findClassroomByCode(code);

    if (!classroom) {
      return NextResponse.json(
        { error: "Kode kelas tidak ditemukan. Coba periksa lagi ejaannya." },
        { status: 404 },
      );
    }
    
    const isAlreadyJoined = user.joinedClasses.some((c: any) => c.id === classroom.id);
    if (isAlreadyJoined) {
      return NextResponse.json(
        { error: `Kamu sudah tergabung di kelas ${classroom.name}.` },
        { status: 409 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        joinedClasses: {
          connect: { id: classroom.id }
        }
      },
    });

    return NextResponse.json({
      success: true,
      classCode: code,
      teacherName: classroom.teacher.fullName,
    });
  } catch (error) {
    console.error("Error joining class:", error);
    return NextResponse.json(
      { error: "Gagal bergabung ke kelas. Coba lagi sebentar lagi." },
      { status: 500 },
    );
  }
}
