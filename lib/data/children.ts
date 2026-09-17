import { prisma } from "@/lib/prisma";

export interface GuardianLike {
  id: string;
  role: string;
}

export interface GuardianChild {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
}

const CHILD_SELECT = {
  id: true,
  fullName: true,
  username: true,
  avatarUrl: true,
} as const;

export async function getChildrenForGuardian(
  guardian: GuardianLike,
): Promise<GuardianChild[]> {
  if (guardian.role === "teacher" || guardian.role === "TEACHER") {
    // Cari murid yang ada di kelas mana pun milik guru ini
    return prisma.user.findMany({
      where: { 
        role: "CHILDREN", 
        joinedClasses: { some: { teacherId: guardian.id } } 
      },
      select: CHILD_SELECT,
    });
  }

  if (guardian.role === "parents" || guardian.role === "PARENTS") {
    return prisma.user.findMany({
      where: { 
        role: "CHILDREN", 
        parentId: guardian.id 
      },
      select: CHILD_SELECT,
    });
  }

  return [];
}

export function getGuardianScopeLabel(guardian: GuardianLike): string {
  if (guardian.role === "teacher" || guardian.role === "TEACHER") {
    return "Murid di kelas-kelasmu";
  }
  return "Anak yang terhubung dengan akunmu";
}
