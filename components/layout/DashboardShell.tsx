"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import {
  AppSidebar,
  SidebarMenuSection,
} from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import type { ProfileUser } from "@/components/layout/ProfileAvatar";

interface DashboardShellProps {
  children: React.ReactNode;
  menuSections: SidebarMenuSection[];
  rootHrefs?: string[];
  title?: string;
  user?: ProfileUser | null;
}

export function DashboardShell({
  children,
  menuSections,
  rootHrefs,
  title,
  user,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background">
          <AppSidebar menuSections={menuSections} rootHrefs={rootHrefs} />

          <div className="flex flex-1 flex-col overflow-hidden">
            <DashboardHeader title={title} user={user} />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
