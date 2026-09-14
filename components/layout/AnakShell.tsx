"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { anakMenuSections, anakRootHrefs } from "@/lib/menu/anak";

export function AnakShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      menuSections={anakMenuSections}
      rootHrefs={anakRootHrefs}
      title="Petualanganmu"
    >
      {children}
    </DashboardShell>
  );
}
