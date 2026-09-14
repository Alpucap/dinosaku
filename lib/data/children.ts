import { DUMMY_USERS, type User } from "@/lib/data/dummy-users";

/**
 * Orang tua dan guru terhubung ke anak lewat jalur yang berbeda:
 * orang tua lewat childrenIds/parentId, guru lewat classCode.
 */
export function getChildrenForGuardian(guardian: User): User[] {
  const children = DUMMY_USERS.filter((u) => u.role === "children");

  if (guardian.role === "teacher") {
    if (!guardian.classCode) return [];
    return children.filter((c) => c.classCode === guardian.classCode);
  }

  if (guardian.role === "parents") {
    return children.filter(
      (c) => c.parentId === guardian.id || guardian.childrenIds?.includes(c.id),
    );
  }

  return [];
}

export function getGuardianScopeLabel(guardian: User): string {
  if (guardian.role === "teacher") {
    return guardian.classCode
      ? `Murid di kelas ${guardian.classCode}`
      : "Kamu belum terhubung ke kelas mana pun";
  }
  return "Anak yang terhubung dengan akunmu";
}
