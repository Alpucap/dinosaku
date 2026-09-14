import type { ReactNode } from "react";
import { PembimbingShell } from "@/components/layout/PembimbingShell";
import { requireRole } from "@/lib/auth/guard";

export default async function PembimbingLayout({ children }: { children: ReactNode }) {
  await requireRole(["parents", "teacher"]);

  return <PembimbingShell>{children}</PembimbingShell>;
}
