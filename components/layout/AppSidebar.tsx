"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useSidebar } from "@/components/layout/SidebarProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { motion } from "framer-motion";

export interface SidebarMenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface SidebarMenuSection {
  title?: string;
  items: SidebarMenuItem[];
}

interface AppSidebarProps {
  menuSections: SidebarMenuSection[];
  rootHrefs?: string[];
}

export function AppSidebar({ menuSections, rootHrefs = [] }: AppSidebarProps) {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isDesktopExpanded, toggleDesktop, isMounted } = useSidebar();

  const RenderSidebarContent = (isExpanded: boolean) => (
    <>
      {/* Header / Logo */}
      <div className={cn(
        "flex h-16 items-center justify-center border-b border-default shrink-0 overflow-hidden",
        isMounted && "transition-all",
        isExpanded ? "px-4" : "px-0"
      )}>
        <Link href="/" className="flex items-center justify-center" onClick={() => setIsOpen(false)}>
          {isExpanded ? (
            <Image
              src="/logo/dinosaku.svg"
              alt="Dinosaku"
              width={180}
              height={54}
              className="h-12 sm:h-14 w-auto object-contain"
              priority
            />
          ) : (
            <Image
              src="/mascot/dino.png"
              alt="Maskot Dinosaku"
              width={36}
              height={36}
              className="h-8 w-8 object-contain"
              priority
            />
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-6 px-3">
          {menuSections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-1">
              {/* Section Header */}
              {section.title && isExpanded && (
                <h3 className="px-4 text-[10px] font-bold uppercase text-text-muted tracking-wider mb-2 mt-2">
                  {section.title}
                </h3>
              )}

              {/* Divider for collapsed state instead of text */}
              {section.title && !isExpanded && sectionIdx > 0 && (
                <div className="w-6 mx-auto border-t border-border my-3"></div>
              )}

              {/* Menu Items */}
              {section.items.map((item) => {
                const isRoot = rootHrefs.includes(item.href);
                const isActive = isRoot
                  ? pathname === item.href || pathname === `${item.href}/dashboard`
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);

                const LinkItem = (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "group flex items-center rounded-lg py-2.5 text-sm font-medium duration-200 relative",
                      isMounted && "transition-all",
                      isExpanded ? "px-4 gap-3 mx-2" : "justify-center px-0 mx-2",
                      isActive
                        ? "text-white font-bold"
                        : "text-text-secondary hover:bg-brand-primary/10 hover:text-brand-primary"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="absolute inset-0 bg-brand-primary rounded-lg shadow-sm"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className={cn(
                      "shrink-0 transition-colors h-5 w-5 relative z-10",
                      isActive ? "text-white" : "text-text-muted group-hover:text-brand-primary"
                    )} />
                    {isExpanded && <span className="whitespace-normal leading-tight text-left relative z-10">{item.name}</span>}
                  </Link>
                );

                if (!isExpanded) {
                  return (
                    <Tooltip key={item.name} delayDuration={0}>
                      <TooltipTrigger asChild>
                        {LinkItem}
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-semibold">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return LinkItem;
              })}
            </div>
          ))}
        </nav>
      </div>

    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-surface border-r border-default shrink-0 shadow-sm relative z-20",
          isMounted && "transition-all duration-300 ease-in-out",
          isDesktopExpanded ? "w-64" : "w-20"
        )}
      >
        {RenderSidebarContent(isDesktopExpanded)}

        {/* Floating toggle button — always at the same position on the right edge */}
        <button
          onClick={toggleDesktop}
          className="absolute top-1/2 -translate-y-1/2 -right-4 hidden lg:flex h-8 w-8 items-center justify-center rounded-full bg-surface border-2 border-border shadow-md text-text-muted hover:text-brand-primary hover:border-brand-primary transition-colors z-30"
          title={isDesktopExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isDesktopExpanded ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-surface flex flex-col [&>div:last-child]:hidden">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <SheetDescription className="sr-only">
            Navigasi utama dasbor admin Dinosaku
          </SheetDescription>
          {RenderSidebarContent(true)}
        </SheetContent>
      </Sheet>
    </>
  );
}
