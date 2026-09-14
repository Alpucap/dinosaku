"use client";

import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { learnMenuSections, learnRootHrefs } from "@/lib/menu/learn";
import { LearnSidebarFooter } from "@/components/dino/Sidebar";

export function LearnShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <div className="flex h-dvh w-full overflow-hidden bg-background font-sans">
          <a href="#learning-content" className="skip-link">
            Lewati ke isi
          </a>

          <AppSidebar
            menuSections={learnMenuSections}
            rootHrefs={learnRootHrefs}
            footer={<LearnSidebarFooter />}
          />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <DashboardHeader title="Petualangan Belajar" />
            <main
              id="learning-content"
              tabIndex={-1}
              className="relative min-w-0 flex-1 overflow-y-auto"
            >
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
