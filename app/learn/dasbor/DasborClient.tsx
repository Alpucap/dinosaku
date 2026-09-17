'use client';

import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck,
  Flag,
  Flame,
  ListChecks,
  Medal,
  PiggyBank,
  Play,
  Star,
  Target,
  Wallet,
} from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

interface DasborClientProps {
  firstName: string;
  isPremium: boolean;
  quizCount: number;
  stats: {
    totalPoints: number;
    currentStreak: number;
    badgeCount: number;
    activitiesThisWeek: number;
    pointsThisWeek: number;
  };
  weekly: { label: string; points: number }[];
  recent: { id: string; title: string; label: string; pointsEarned: number; timeAgo: string }[];
  presetStories: { id: string; title: string }[];
  assignments: {
    id: string;
    topic: string;
    theme: string;
    storyId: string | null;
    completed: boolean;
    assignerName: string;
  }[];
  wallet: {
    balance: number;
    saved: number;
    goalsTotal: number;
    goalsDone: number;
    topGoal: { title: string; percent: number } | null;
  };
}

const FREE_STORY_LIMIT = 2;

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

function assignmentHref(a: DasborClientProps['assignments'][number]) {
  if (a.storyId) return `/learn/stories/${a.storyId}?assignmentId=${a.id}`;
  return `/learn/create?topic=${encodeURIComponent(a.topic)}&theme=${encodeURIComponent(a.theme)}&assignmentId=${a.id}`;
}

export default function DasborClient({
  firstName,
  isPremium,
  quizCount,
  stats,
  weekly,
  recent,
  presetStories,
  assignments,
  wallet,
}: DasborClientProps) {
  const { profile, ready } = useProgress();

  const total = presetStories.length;
  const completed = presetStories.filter((s) => profile.completedStories.includes(s.id)).length;
  const remaining = Math.max(total - completed, 0);
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const nextIndex = presetStories.findIndex((s) => !profile.completedStories.includes(s.id));
  const next = nextIndex >= 0 ? presetStories[nextIndex] : null;
  const nextLocked = next !== null && !isPremium && nextIndex >= FREE_STORY_LIMIT;

  const storyTitle = new Map(presetStories.map((s) => [s.id, s.title]));
  const quizResults = profile.results.map((r) => ({
    storyId: r.storyId,
    title: storyTitle.get(r.storyId) ?? 'Cerita buatanmu',
    score: r.score,
    total: r.total,
    percent: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
  }));
  const quizAverage = quizResults.length
    ? Math.round(quizResults.reduce((sum, r) => sum + r.percent, 0) / quizResults.length)
    : null;
  const perfectCount = quizResults.filter((r) => r.score === r.total).length;

  const pendingAssignments = assignments.filter((a) => !a.completed);
  const doneAssignments = assignments.length - pendingAssignments.length;

  const maxWeekly = Math.max(...weekly.map((d) => d.points), 1);
  const bestDay = weekly.reduce((best, d) => (d.points > best.points ? d : best), weekly[0]);

  let headline: string;
  if (!ready) headline = 'Sedang menyiapkan catatan belajarmu...';
  else if (total > 0 && completed === total) headline = 'Luar biasa! Semua misi petualangan sudah kamu selesaikan.';
  else if (completed === 0) headline = 'Yuk, mulai misi pertamamu hari ini dan kumpulkan poin!';
  else headline = `Kamu sudah menyelesaikan ${completed} dari ${total} misi. Tinggal ${remaining} lagi, semangat!`;

  const statCards = [
    { icon: Star, label: 'Total Poin', value: stats.totalPoints, tint: 'bg-warning/10 text-warning' },
    { icon: Flame, label: 'Streak Belajar', value: `${stats.currentStreak} hari`, tint: 'bg-destructive/10 text-destructive' },
    { icon: Medal, label: 'Lencana', value: stats.badgeCount, tint: 'bg-info/10 text-info' },
    {
      icon: ListChecks,
      label: 'Rata-rata Kuis',
      value: !ready ? '...' : quizAverage === null ? '-' : `${quizAverage}%`,
      tint: 'bg-brand-primary/10 text-brand-primary',
    },
  ];

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Dasbor Belajarku</p>
        <h1>Halo, {firstName}!</h1>
        <p>{headline}</p>
      </header>

      <div className="flex flex-col gap-6">
        <section className="rounded-2xl bg-brand-primary p-6 text-white shadow-md sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-secondary">Progres Misi Petualangan</p>
              <p className="mt-2 font-heading text-4xl font-bold">
                {ready ? completed : '...'}
                <span className="text-2xl text-white/70"> / {total} misi</span>
              </p>
              <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-white/15 md:max-w-md">
                <div
                  className="h-full rounded-full bg-brand-accent transition-all duration-700"
                  style={{ width: `${ready ? percent : 0}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white/80">
                {ready ? `${percent}% selesai` : 'Memuat...'}
                {ready && remaining > 0 && ` · ${remaining} misi lagi menuju garis finis`}
              </p>
            </div>

            {ready && (
              <div className="shrink-0">
                {next ? (
                  nextLocked ? (
                    <Link
                      href="/subscribe"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                    >
                      Buka misi berikutnya dengan Premium <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link
                      href={`/learn/stories/${next.id}`}
                      className="inline-flex max-w-full items-center gap-2 rounded-xl bg-brand-accent px-5 py-3 text-sm font-bold text-brand-primary hover:bg-brand-accent-hover transition-colors"
                    >
                      <Play size={16} className="shrink-0" />
                      <span className="truncate">Lanjut: {next.title}</span>
                    </Link>
                  )
                ) : (
                  <Link
                    href="/learn/badges"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-accent px-5 py-3 text-sm font-bold text-brand-primary hover:bg-brand-accent-hover transition-colors"
                  >
                    <Medal size={16} /> Lihat lencanaku
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${card.tint}`}>
                <card.icon size={18} />
              </span>
              <p className="mt-3 font-heading text-2xl font-bold text-text-primary">{card.value}</p>
              <p className="text-xs font-semibold text-text-secondary">{card.label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-text-primary">Semangat Belajar Minggu Ini</h2>
              <p className="mt-1 text-sm text-text-secondary">
                {stats.activitiesThisWeek} aktivitas · {stats.pointsThisWeek} poin dalam 7 hari terakhir
              </p>
            </div>
            {bestDay && bestDay.points > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent-soft px-3 py-1 text-xs font-bold text-brand-primary">
                <CalendarCheck size={14} /> Paling rajin: {bestDay.label}
              </span>
            )}
          </div>

          <div className="mt-6 flex h-36 items-end justify-between gap-2 sm:gap-4">
            {weekly.map((day) => (
              <div key={day.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] font-bold text-text-primary">{day.points > 0 ? day.points : ''}</span>
                <div
                  className={`w-full max-w-[44px] rounded-t-md ${day.points > 0 ? 'bg-brand-primary' : 'bg-surface-soft'}`}
                  style={{ height: `${Math.max((day.points / maxWeekly) * 100, day.points > 0 ? 6 : 4)}%` }}
                />
                <span className="text-[10px] font-bold text-text-muted whitespace-nowrap">{day.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">Nilai Kuisku</h2>
              {ready && perfectCount > 0 && (
                <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-bold text-warning">
                  {perfectCount} nilai sempurna
                </span>
              )}
            </div>

            {!ready ? (
              <p className="mt-4 text-sm text-text-secondary">Memuat nilai kuis...</p>
            ) : quizResults.length === 0 ? (
              <div className="mt-4 rounded-xl bg-surface-soft p-5 text-center text-sm text-text-secondary">
                {quizCount > 0
                  ? `Kamu sudah mengerjakan ${quizCount} kuis. Rincian nilai per cerita akan muncul di sini setelah kamu bermain lagi di perangkat ini.`
                  : 'Belum ada kuis yang dikerjakan. Selesaikan cerita pertamamu untuk membuka kuis!'}
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {quizResults.map((result) => (
                  <li key={result.storyId}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate font-semibold text-text-primary">{result.title}</span>
                      <span className="shrink-0 font-bold text-brand-primary">
                        {result.score}/{result.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-soft">
                      <div
                        className={`h-full rounded-full ${result.percent === 100 ? 'bg-warning' : result.percent >= 60 ? 'bg-brand-primary' : 'bg-destructive/70'}`}
                        style={{ width: `${result.percent}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg font-bold text-text-primary">Misi dari Guru & Orang Tua</h2>
              <span className="shrink-0 text-xs font-bold text-text-muted">
                {doneAssignments}/{assignments.length} selesai
              </span>
            </div>

            {assignments.length === 0 ? (
              <div className="mt-4 rounded-xl bg-surface-soft p-5 text-center text-sm text-text-secondary">
                Belum ada misi khusus untukmu.
              </div>
            ) : pendingAssignments.length === 0 ? (
              <div className="mt-4 rounded-xl bg-brand-accent-soft p-5 text-center text-sm font-semibold text-brand-primary">
                Hebat! Semua misi khusus sudah kamu selesaikan.
              </div>
            ) : (
              <ul className="mt-4 space-y-3">
                {pendingAssignments.slice(0, 3).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-border-light p-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                        <Flag size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-text-primary">{a.topic}</p>
                        <p className="truncate text-xs text-text-secondary">Dari {a.assignerName}</p>
                      </div>
                    </div>
                    <Link
                      href={assignmentHref(a)}
                      className="shrink-0 rounded-lg bg-brand-primary px-3 py-2 text-xs font-bold text-white hover:bg-brand-primary/90 transition-colors"
                    >
                      Mulai
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-heading text-lg font-bold text-text-primary">Keuanganku</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/learn/tracker" className="rounded-xl bg-surface-soft p-4 hover:bg-surface-green transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <Wallet size={14} /> Sisa Uang
                </span>
                <span className={`mt-2 block font-heading text-lg font-bold ${wallet.balance < 0 ? 'text-destructive' : 'text-text-primary'}`}>
                  {formatRupiah(wallet.balance)}
                </span>
              </Link>
              <Link href="/learn/impian" className="rounded-xl bg-surface-soft p-4 hover:bg-surface-green transition-colors">
                <span className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
                  <PiggyBank size={14} /> Tabungan
                </span>
                <span className="mt-2 block font-heading text-lg font-bold text-text-primary">{formatRupiah(wallet.saved)}</span>
              </Link>
            </div>

            <div className="mt-4 rounded-xl border border-border-light p-4">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-semibold text-text-primary">
                  <Target size={16} className="text-brand-accent" /> Impian tercapai
                </span>
                <span className="font-bold text-brand-primary">
                  {wallet.goalsDone}/{wallet.goalsTotal}
                </span>
              </div>
              {wallet.topGoal ? (
                <>
                  <p className="mt-3 text-xs text-text-secondary">
                    Paling dekat: <span className="font-semibold text-text-primary">{wallet.topGoal.title}</span> ({wallet.topGoal.percent}%)
                  </p>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-soft">
                    <div className="h-full rounded-full bg-brand-accent" style={{ width: `${wallet.topGoal.percent}%` }} />
                  </div>
                </>
              ) : (
                <p className="mt-3 text-xs text-text-secondary">
                  {wallet.goalsTotal === 0 ? 'Belum ada target impian.' : 'Semua impianmu sudah tercapai!'}{' '}
                  <Link href="/learn/impian" className="font-bold text-brand-primary hover:underline">
                    Buka Impianku
                  </Link>
                </p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-heading text-lg font-bold text-text-primary">Aktivitas Terbaru</h2>
            {recent.length === 0 ? (
              <div className="mt-4 rounded-xl bg-surface-soft p-5 text-center text-sm text-text-secondary">
                Belum ada aktivitas. Ayo mulai berpetualang!
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-border-light">
                {recent.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-text-primary">{entry.title}</p>
                      <p className="text-xs text-text-secondary">
                        {entry.label} · {entry.timeAgo}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-brand-primary">+{entry.pointsEarned} poin</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
