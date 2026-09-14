import type { ReactNode } from "react";
import { AnakShell } from "@/components/layout/AnakShell";
import { requireRole } from "@/lib/auth/guard";

export default async function AnakLayout({ children }: { children: ReactNode }) {
  await requireRole(["children"]);

  return <AnakShell>{children}</AnakShell>;
}
