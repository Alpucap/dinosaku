"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLinkItem,
} from "@/components/ui/dropdown-menu";
import { getDashboardPath, type Role } from "@/lib/constants/roles";

export type ProfileUser = {
  fullName: string;
  avatarUrl?: string;
  role?: Role;
  gamification?: {
    totalPoints?: number;
    energy?: number;
  };
};

interface ProfileAvatarProps {
  user: ProfileUser;
  className?: string;
}

/**
 * Sengaja memakai <img>, bukan next/image: sebagian avatar berasal dari
 * dicebear dan host itu belum terdaftar di images.remotePatterns.
 */
export function ProfileAvatar({ user, className }: ProfileAvatarProps) {
  const pathname = usePathname();
  const initial = user.fullName.trim().slice(0, 1).toUpperCase() || "?";
  const dashboardHref = user.role ? getDashboardPath(user.role) : "/dashboard";

  // Kalau sudah di dalam dasbornya sendiri, "Dashboard" itu tujuan yang
  // percuma — item pertama berubah jadi jalan keluar ke landing page.
  const onDashboard =
    pathname === dashboardHref || pathname.startsWith(`${dashboardHref}/`);
  const primaryItem = onDashboard
    ? { href: "/", label: "Beranda", icon: Home }
    : { href: dashboardHref, label: "Dashboard", icon: LayoutDashboard };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title={user.fullName}
        aria-label={`Menu profil ${user.fullName}`}
        className={cn(
          "shrink-0 rounded-full ring-2 ring-border transition-all hover:ring-brand-primary data-popup-open:ring-brand-primary",
          className,
        )}
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            aria-hidden
            className="h-9 w-9 rounded-full object-cover bg-surface-soft"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
            {initial}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLinkItem render={<Link href={primaryItem.href} />}>
          <primaryItem.icon />
          {primaryItem.label}
        </DropdownMenuLinkItem>
        <DropdownMenuLinkItem render={<Link href="/profile" />}>
          <UserRound />
          Profil
        </DropdownMenuLinkItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
