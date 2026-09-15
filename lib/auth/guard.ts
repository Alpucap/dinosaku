import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getDashboardPath, type Role } from "@/lib/constants/roles";

/**
 * Pagar untuk layout dasbor. Belum login dilempar ke /login; sudah login tapi
 * salah peran dilempar ke dasbornya sendiri, bukan ke halaman error.
 */
export async function requireRole(allowed: Role[]) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (!allowed.includes(user.role)) redirect(getDashboardPath(user.role));
  return user;
}
