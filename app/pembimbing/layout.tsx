import type { ReactNode } from "react";
import { PembimbingShell } from "@/components/layout/PembimbingShell";
import { requireRole } from "@/lib/auth/guard";

export default async function PembimbingLayout({ children }: { children: ReactNode }) {
  const user = await requireRole(["parents", "teacher"]);

  return (
    <PembimbingShell user={{ fullName: user.fullName, avatarUrl: user.avatarUrl }}>
      {children}
    </PembimbingShell>
  );
}
