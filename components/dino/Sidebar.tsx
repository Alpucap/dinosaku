"use client";

import Link from "next/link";
import { Flame, ChevronRight } from "lucide-react";
import { useProgress } from "@/lib/use-progress";

export function LearnSidebarFooter() {
  const { profile, ready, streak } = useProgress();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3 rounded-lg bg-surface-soft px-3 py-2.5">
        <Flame size={22} aria-hidden="true" className="shrink-0 text-brand-primary" />
        <div className="min-w-0">
          <strong className="block text-xs font-bold text-text-primary">
            {ready ? streak : 0} hari berturut-turut
          </strong>
          <p className="text-[11px] leading-tight text-text-secondary">
            {streak
              ? "Satu kuis hari ini, jaga semangatmu!"
              : "Mulai dari satu kuis hari ini."}
          </p>
        </div>
      </div>

      <Link
        href="/learn/leaderboard#profiles"
        className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-brand-primary/10"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white"
        >
          {profile.name.slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-xs font-bold text-text-primary">
            {profile.name}
          </strong>
          <small className="text-[11px] text-text-muted">
            Profil di perangkat ini
          </small>
        </span>
        <ChevronRight
          size={18}
          className="shrink-0 text-text-muted group-hover:text-brand-primary"
        />
      </Link>
    </div>
  );
}
