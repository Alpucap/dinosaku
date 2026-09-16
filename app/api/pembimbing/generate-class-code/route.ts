import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/session";
import { generateUniqueClassCode } from "@/lib/data/class";

export async function POST() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Kamu harus masuk dulu." },
        { status: 401 },
      );
    }

    if (user.role !== "teacher") {
      return NextResponse.json(
        { error: "Hanya akun guru yang bisa membuat kode kelas." },
        { status: 403 },
      );
    }

    const oldCode = user.classCode ?? null;

    // Transaksi supaya pengecekan keunikan, penulisan kode baru, dan
    // pemindahan murid lama terjadi sebagai satu langkah — tidak ada celah
    // dua guru bisa kebagian kode yang sama.
    const result = await prisma.$transaction(async (tx) => {
      const newCode = await generateUniqueClassCode(tx);

      await tx.user.update({
        where: { id: user.id },
        data: { classCode: newCode },
      });

      // Regenerate tidak boleh melepas murid yang sudah tergabung ke kode
      // lama — mereka ikut dipindah ke kode baru dalam transaksi yang sama.
      let migratedStudents = 0;
      if (oldCode) {
        const migrated = await tx.user.updateMany({
          where: { role: "CHILDREN", classCode: oldCode },
          data: { classCode: newCode },
        });
        migratedStudents = migrated.count;
      }

      return { newCode, migratedStudents };
    });

    return NextResponse.json({
      success: true,
      classCode: result.newCode,
      migratedStudents: result.migratedStudents,
    });
  } catch (error) {
    console.error("Error generating class code:", error);
    return NextResponse.json(
      { error: "Gagal membuat kode kelas. Coba lagi." },
      { status: 500 },
    );
  }
}
