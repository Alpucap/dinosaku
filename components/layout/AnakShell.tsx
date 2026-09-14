"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { ProfileUser } from "@/components/layout/ProfileAvatar";
import { anakMenuSections, anakRootHrefs } from "@/lib/menu/anak";

export function AnakShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: ProfileUser | null;
}) {
  return (
    <DashboardShell
      menuSections={anakMenuSections}
      rootHrefs={anakRootHrefs}
      user={user}
      title="Petualanganmu"
    >
      {children}
    </DashboardShell>
  );
}
