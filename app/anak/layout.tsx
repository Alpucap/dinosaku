import type { ReactNode } from "react";
import { AnakShell } from "@/components/layout/AnakShell";

export default function AnakLayout({ children }: { children: ReactNode }) {
  return <AnakShell>{children}</AnakShell>;
}
