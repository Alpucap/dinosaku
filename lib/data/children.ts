import { prisma } from "@/lib/prisma";

export interface GuardianLike {
  id: string;
  role: string;
  classCode?: string | null;
}

export interface GuardianChild {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  classCode: string | null;
}

const CHILD_SELECT = {
  id: true,
  fullName: true,
  username: true,
  avatarUrl: true,
  classCode: true,
} as const;

/**
 * Orang tua dan guru terhubung ke anak lewat jalur berbeda: orang tua lewat
 * parentId, guru lewat classCode. Query langsung ke database — bukan array
 * dummy statis — karena classCode/parentId anak berubah lewat aksi nyata
 * (join kelas, generate ulang kode kelas, dsb), jadi datanya harus hidup.
 */
export async function getChildrenForGuardian(
  guardian: GuardianLike,
): Promise<GuardianChild[]> {
  if (guardian.role === "teacher") {
    if (!guardian.classCode) return [];
    return prisma.user.findMany({
      where: { role: "CHILDREN", classCode: guardian.classCode },
      select: CHILD_SELECT,
    });
  }

  if (guardian.role === "parents") {
    return prisma.user.findMany({
      where: { role: "CHILDREN", parentId: guardian.id },
      select: CHILD_SELECT,
    });
  }

  return [];
}

export function getGuardianScopeLabel(guardian: GuardianLike): string {
  if (guardian.role === "teacher") {
    return guardian.classCode
      ? `Murid di kelas ${guardian.classCode}`
      : "Kamu belum terhubung ke kelas mana pun";
  }
  return "Anak yang terhubung dengan akunmu";
}
