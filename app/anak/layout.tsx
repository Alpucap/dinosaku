import type { ReactNode } from "react";
import { AnakShell } from "@/components/layout/AnakShell";
import { requireRole } from "@/lib/auth/guard";

export default async function AnakLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["children"]);

  return (
    <AnakShell user={{ fullName: user.fullName, avatarUrl: user.avatarUrl }}>
      {children}
    </AnakShell>
  );
}
