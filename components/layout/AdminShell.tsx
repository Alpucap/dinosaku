"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import type { ProfileUser } from "@/components/layout/ProfileAvatar";
import { adminMenuSections, adminRootHrefs } from "@/lib/menu/admin";

/**
 * Pembungkus tipis di sisi client. Menu di-import di sini, bukan dioper dari
 * layout server — komponen ikon adalah fungsi dan tidak bisa melintasi batas
 * server/client.
 */
export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: ProfileUser | null;
}) {
  return (
    <DashboardShell
      menuSections={adminMenuSections}
      rootHrefs={adminRootHrefs}
      user={user}
      title="Dasbor Admin"
    >
      {children}
    </DashboardShell>
  );
}
