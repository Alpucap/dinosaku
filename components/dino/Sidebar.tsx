"use client";

import { Flame } from "lucide-react";
import { useGamification } from "./GamificationProvider";

export function LearnSidebarFooter() {
  const { gamification } = useGamification();
  const streak = gamification.currentStreak;
  const ready = true;

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
    </div>
  );
}
