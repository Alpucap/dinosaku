"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { ProfileUser } from "@/components/layout/ProfileAvatar";
import {
  pembimbingMenuSections,
  pembimbingRootHrefs,
} from "@/lib/menu/pembimbing";

export function PembimbingShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: ProfileUser | null;
}) {
  return (
    <DashboardShell
      menuSections={pembimbingMenuSections}
      rootHrefs={pembimbingRootHrefs}
      user={user}
      title="Dasbor Pembimbing"
    >
      {children}
    </DashboardShell>
  );
}
