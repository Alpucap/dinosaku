import Link from "next/link";
import {
  Users,
  Star,
  Medal,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Clock,
  Trophy,
  CalendarCheck,
  Zap,
} from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getChildrenForGuardian } from "@/lib/data/children";
import {
  getChildReportSummaries,
  getWeeklyBreakdown,
  getActivityComposition,
  formatRelativeTime,
} from "@/lib/data/report";
import { WeeklyActivityChart } from "@/components/dino/report/WeeklyActivityChart";
import { ActivityCompositionDonut } from "@/components/dino/report/ActivityCompositionDonut";
import { PrintReportButton } from "@/components/dino/report/PrintReportButton";

export default async function PembimbingDashboardPage() {
  const user = await requireRole(["parents", "teacher"]);

  const children = await getChildrenForGuardian(user);
  const childIds = children.map((c) => c.id);

  const [summaries, weeklyBreakdown, composition, recentActivities] = await Promise.all([
    getChildReportSummaries(childIds),
    getWeeklyBreakdown(childIds),
    getActivityComposition(childIds),
    prisma.activityHistory.findMany({
      where: { userId: { in: childIds } },
      include: { user: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const sorted = [...summaries].sort((a, b) => b.pointsThisWeek - a.pointsThisWeek);
  const activeThisWeek = summaries.filter((s) => s.activitiesThisWeek > 0);
  const totalPoints = summaries.reduce((sum, s) => sum + s.totalPoints, 0);
  const totalBadges = summaries.reduce((sum, s) => sum + s.badgeCount, 0);
  const totalPointsThisWeek = summaries.reduce((sum, s) => sum + s.pointsThisWeek, 0);
  const totalActivitiesThisWeek = summaries.reduce((sum, s) => sum + s.activitiesThisWeek, 0);
  const topPerformer = sorted[0]?.pointsThisWeek > 0 ? sorted[0] : null;

  const overviewTiles = [
    { icon: Users, label: user.role === "teacher" ? "Total Murid" : "Total Anak", value: summaries.length, valueClass: "text-brand-primary" },
    { icon: Star, label: "Total Poin", value: totalPoints, valueClass: "text-brand-accent" },
    { icon: Medal, label: "Total Lencana", value: totalBadges, valueClass: "text-brand-primary" },
  ];

  const weeklyTiles = [
    { icon: CalendarCheck, label: "Aktif Minggu Ini", value: `${activeThisWeek.length} / ${summaries.length}`, tint: "bg-info/10 text-info" },
    { icon: Zap, label: "Poin Minggu Ini", value: totalPointsThisWeek, tint: "bg-warning/10 text-warning" },
    { icon: Trophy, label: "Aktivitas Minggu Ini", value: totalActivitiesThisWeek, tint: "bg-success/10 text-success" },
  ];

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Dasbor Pembimbing</p>
        <h1>Dasbor {user.role === "teacher" ? "Guru" : "Orang Tua"}</h1>
        <p>
          Selamat datang, {user.fullName}! Pantau perkembangan belajar{" "}
          {user.role === "teacher" ? "murid-muridmu" : "anak-anakmu"} di sini.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <PrintReportButton />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          {overviewTiles.map((tile) => (
            <div key={tile.label} className="flex flex-col justify-center rounded-xl border border-default bg-surface p-5">
              <div className="flex items-center gap-2 text-text-secondary">
                <tile.icon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">{tile.label}</span>
              </div>
              <p className={`mt-2 font-heading text-3xl font-bold ${tile.valueClass}`}>{tile.value}</p>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-xl border border-warning/30 bg-warning-soft/30 p-5">
            <div className="flex items-center gap-2 text-warning">
              <span className="text-lg leading-none">⚡</span>
              <span className="text-xs font-bold uppercase tracking-wider">Energi Bulanan</span>
            </div>
            <p className="mt-2 font-heading text-3xl font-bold text-warning">{user.gamification?.energy || 0}</p>
          </div>
        </div>

        {summaries.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-text-muted">
              <Users className="h-6 w-6" />
            </span>
            <p className="text-sm font-semibold text-text-primary">
              {user.role === "teacher" ? "Belum ada murid yang terhubung" : "Belum ada anak yang terhubung"}
            </p>
            <p className="max-w-sm text-sm text-text-secondary">
              {user.role === "teacher"
                ? "Bagikan kode kelasmu dari halaman Pengaturan agar murid bisa bergabung."
                : "Hubungkan akun anak dulu dari halaman Pengaturan."}
            </p>
          </div>
        ) : (
          <>
            {/* Ringkasan minggu ini — pelengkap tiga kartu di atas yang bersifat total sepanjang waktu. */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {weeklyTiles.map((tile) => (
                <div key={tile.label} className="rounded-xl border border-default bg-surface p-4">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${tile.tint}`}>
                    <tile.icon size={18} />
                  </span>
                  <p className="mt-3 font-heading text-2xl font-bold text-text-primary">{tile.value}</p>
                  <p className="text-xs font-semibold text-text-secondary">{tile.label}</p>
                </div>
              ))}
            </div>

            {topPerformer && (
              <div className="flex items-center gap-4 rounded-xl border border-brand-accent/30 bg-brand-accent-soft p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Trophy size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-primary">Paling aktif minggu ini</p>
                  <p className="text-sm text-text-secondary">
                    <span className="font-bold text-text-primary">{topPerformer.fullName}</span>{" "}
                    mengumpulkan {topPerformer.pointsThisWeek} poin dari {topPerformer.activitiesThisWeek} aktivitas.
                  </p>
                </div>
              </div>
            )}

            {/* Peringkat lengkap semua anak — klik nama untuk laporan detailnya. */}
            <div className="rounded-xl border border-default bg-surface overflow-hidden">
              <div className="border-b border-border-light bg-surface-soft px-5 py-4">
                <h3 className="font-heading text-base font-bold text-text-primary">
                  {user.role === "teacher" ? "Murid-muridmu" : "Anak-anakmu"}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <caption className="sr-only">Ringkasan belajar tiap anak</caption>
                  <thead>
                    <tr className="border-b border-border-light text-xs text-text-muted">
                      <th scope="col" className="py-3 pl-5 pr-3 font-semibold">Anak</th>
                      <th scope="col" className="py-3 pr-3 font-semibold">Aktivitas (7 hari)</th>
                      <th scope="col" className="py-3 pr-3 font-semibold">Poin (7 hari)</th>
                      <th scope="col" className="py-3 pr-3 font-semibold">Streak</th>
                      <th scope="col" className="py-3 pr-5 font-semibold">Terakhir Aktif</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((child) => (
                      <tr key={child.id} className="border-b border-border-light last:border-0 hover:bg-surface-soft transition-colors">
                        <td className="py-3 pl-5 pr-3">
                          <Link href={`/pembimbing/anak/${child.id}`} className="flex items-center gap-3 group">
                            {child.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={child.avatarUrl}
                                alt=""
                                aria-hidden
                                className="h-9 w-9 shrink-0 rounded-full bg-surface-soft object-cover"
                              />
                            ) : (
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                                {child.fullName.slice(0, 1).toUpperCase()}
                              </span>
                            )}
                            <span className="min-w-0">
                              <span className="block truncate font-semibold text-text-primary group-hover:text-brand-primary group-hover:underline">
                                {child.fullName}
                              </span>
                              <span className="block truncate text-xs text-text-muted">@{child.username}</span>
                            </span>
                            <ChevronRight size={16} className="ml-1 shrink-0 text-text-muted group-hover:text-brand-primary" />
                          </Link>
                        </td>
                        <td className="py-3 pr-3 text-text-secondary">{child.activitiesThisWeek}</td>
                        <td className="py-3 pr-3 font-bold text-text-primary">{child.pointsThisWeek}</td>
                        <td className="py-3 pr-3 text-text-secondary">{child.currentStreak} hari</td>
                        <td className="py-3 pr-5 text-text-secondary">{formatRelativeTime(child.lastActiveAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <WeeklyActivityChart days={weeklyBreakdown} />
              <ActivityCompositionDonut slices={composition} />
            </div>
          </>
        )}

        <div className="rounded-xl border border-default bg-surface overflow-hidden flex flex-col">
          <div className="border-b border-border-light bg-surface-soft px-5 py-4 flex justify-between items-center">
            <h3 className="font-heading text-base font-bold text-text-primary">Aktivitas Terbaru</h3>
            <Link href="/pembimbing/progres" className="text-xs font-semibold text-brand-primary flex items-center hover:underline">
              Selengkapnya <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          {recentActivities.length > 0 ? (
            <ul className="divide-y divide-border-light flex-1">
              {recentActivities.map((act) => (
                <li key={act.id} className="p-5 hover:bg-surface-soft transition-colors flex gap-4">
                  <div className="shrink-0 mt-1">
                    <div className="h-8 w-8 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
                      {act.type === "QUIZ_COMPLETED" ? <CheckCircle size={16} /> : <BookOpen size={16} />}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{act.title}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <span className="font-semibold">{act.user.fullName}</span>{" "}
                      {act.type === "QUIZ_COMPLETED" ? "mendapatkan" : "membaca"} {act.pointsEarned} poin
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
                      <Clock size={10} />
                      {act.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
              Belum ada aktivitas baru.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
