import type { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { requireRole } from "@/lib/auth/guard";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["admin"]);

  return (
    <AdminShell user={{ fullName: user.fullName, avatarUrl: user.avatarUrl }}>
      {children}
    </AdminShell>
  );
}
