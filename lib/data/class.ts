import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** Kode kelas disamakan huruf besar & tanpa spasi supaya "dino-4a" tetap cocok. */
export function normalizeClassCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

export async function findClassroomByCode(classCode: string) {
  const code = normalizeClassCode(classCode);
  if (!code) return null;

  return prisma.classroom.findUnique({
    where: { code },
    include: {
      teacher: {
        select: { id: true, fullName: true, avatarUrl: true },
      },
    },
  });
}

/**
 * Tanpa I, O, L, 0, 1 — huruf/angka itu gampang tertukar saat kode dibaca
 * dari kertas atau papan tulis lalu diketik ulang oleh anak.
 */
const CLASS_CODE_CHARSET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CLASS_CODE_LENGTH = 6;

function randomClassCode(): string {
  let code = "";
  for (let i = 0; i < CLASS_CODE_LENGTH; i++) {
    code += CLASS_CODE_CHARSET[Math.floor(Math.random() * CLASS_CODE_CHARSET.length)];
  }
  return code;
}

type Db = typeof prisma | Prisma.TransactionClient;

/** Diulang sampai dapat kode yang belum dipakai siapa pun. */
export async function generateUniqueClassCode(db: Db = prisma): Promise<string> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = randomClassCode();
    const taken = await db.classroom.findUnique({
      where: { code },
      select: { id: true },
    });
    if (!taken) return code;
  }
  throw new Error("Gagal membuat kode kelas yang unik, coba lagi.");
}
