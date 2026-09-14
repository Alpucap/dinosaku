import type { ReactNode } from "react";
import { PembimbingShell } from "@/components/layout/PembimbingShell";

export default function PembimbingLayout({ children }: { children: ReactNode }) {
  return <PembimbingShell>{children}</PembimbingShell>;
}
