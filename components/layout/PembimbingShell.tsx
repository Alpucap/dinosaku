"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import {
  pembimbingMenuSections,
  pembimbingRootHrefs,
} from "@/lib/menu/pembimbing";

export function PembimbingShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      menuSections={pembimbingMenuSections}
      rootHrefs={pembimbingRootHrefs}
      title="Dasbor Pembimbing"
    >
      {children}
    </DashboardShell>
  );
}
