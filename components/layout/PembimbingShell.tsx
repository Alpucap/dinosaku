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
  // Filter out teacher-only menus if user is parent
  const filteredMenuSections = React.useMemo(() => {
    return pembimbingMenuSections.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (item.name === "Koleksi Cerita" && user?.role !== 'teacher') return false;
        return true;
      })
    })).filter(section => section.items.length > 0);
  }, [user?.role]);

  return (
    <DashboardShell
      menuSections={filteredMenuSections}
      rootHrefs={pembimbingRootHrefs}
      user={user}
      title="Dasbor Pembimbing"
    >
      {children}
    </DashboardShell>
  );
}
