import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { generateUniqueClassCode } from "@/lib/data/class";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== "teacher") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    if (!body.name || body.name.trim() === "") {
      return NextResponse.json({ error: "Nama kelas wajib diisi" }, { status: 400 });
    }

    const code = await generateUniqueClassCode();

    const newClass = await prisma.classroom.create({
      data: {
        name: body.name.trim(),
        code,
        teacherId: user.id
      },
      include: {
        _count: { select: { students: true } }
      }
    });

    return NextResponse.json({ success: true, classroom: newClass });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: "Gagal membuat kelas" }, { status: 500 });
  }
}
