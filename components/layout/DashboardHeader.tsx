"use client";

import { useState, useEffect } from "react";
import { Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSidebar } from "@/components/layout/SidebarProvider";
import { ProfileAvatar, type ProfileUser } from "@/components/layout/ProfileAvatar";

interface DashboardHeaderProps {
  title?: string;
  user?: ProfileUser | null;
}

function LiveHeaderClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setNow(new Date()));
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);

  if (!now) return null;

  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <>
      {/* Desktop Inline Live Clock */}
      <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-soft border border-border text-xs font-semibold text-text-primary shrink-0 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-brand-primary shrink-0 animate-pulse" />
        <span>
          {dateStr} •{" "}
          <span className="font-mono text-brand-primary">{timeStr} WIB</span>
        </span>
      </div>

      {/* Mobile Popover Clock Button */}
      <div className="lg:hidden">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 shrink-0"
            >
              <Clock className="h-[18px] w-[18px]" />
              <span className="sr-only">Lihat Waktu</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            className="w-auto px-3.5 py-2 text-xs font-medium text-text-primary shadow-md whitespace-nowrap"
          >
            <span>
              {dateStr} • {timeStr} WIB
            </span>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const { toggleMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-default bg-surface px-4 shadow-sm sm:px-6 shrink-0 gap-4">
      {/* Left Section: Sidebar Toggle + Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobile}
          className="h-9 w-9 rounded-lg text-text-secondary hover:text-brand-primary hover:bg-brand-primary/10 lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
          <span className="sr-only">Buka menu</span>
        </Button>

        {title && (
          <h1 className="font-heading text-base sm:text-lg font-bold text-text-primary truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right Section: Koin, Live Clock + Profil */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user?.gamification?.aiCoins !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning-soft text-warning font-bold text-xs border border-warning/20 shadow-sm whitespace-nowrap">
            <span>⚡</span>
            <span>{user.gamification.aiCoins} Koin</span>
          </div>
        )}
        <LiveHeaderClock />
        {user && <ProfileAvatar user={user} />}
      </div>
    </header>
  );
}
