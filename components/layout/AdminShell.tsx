"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { adminMenuSections, adminRootHrefs } from "@/lib/menu/admin";

/**
 * Pembungkus tipis di sisi client. Menu di-import di sini, bukan dioper dari
 * layout server — komponen ikon adalah fungsi dan tidak bisa melintasi batas
 * server/client.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      menuSections={adminMenuSections}
      rootHrefs={adminRootHrefs}
      title="Dasbor Admin"
    >
      {children}
    </DashboardShell>
  );
}
