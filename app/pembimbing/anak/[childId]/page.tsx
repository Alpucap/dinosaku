import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flame, Medal, Zap, CalendarClock } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import { getChildrenForGuardian } from "@/lib/data/children";
import {
  getChildReportSummaries,
  getWeeklyBreakdown,
  getActivityComposition,
  getChildActivityLog,
  formatRelativeTime,
} from "@/lib/data/report";
import { WeeklyActivityChart } from "@/components/dino/report/WeeklyActivityChart";
import { ActivityCompositionDonut } from "@/components/dino/report/ActivityCompositionDonut";

export default async function ChildReportPage({
  params,
}: {
  params: Promise<{ childId: string }>;
}) {
  const { childId } = await params;
  const guardian = await requireRole(["parents", "teacher"]);

  // Guru/orang tua hanya boleh membuka laporan anak dalam pengampuannya —
  // bukan sekadar disembunyikan dari menu, tapi ditolak di server.
  const inScope = (await getChildrenForGuardian(guardian)).some((c) => c.id === childId);
  if (!inScope) notFound();

  const [[summary], weeklyBreakdown, composition, log] = await Promise.all([
    getChildReportSummaries([childId]),
    getWeeklyBreakdown([childId]),
    getActivityComposition([childId]),
    getChildActivityLog(childId),
  ]);

  if (!summary) notFound();

  const stats = [
    { icon: Zap, label: "Total Poin", value: summary.totalPoints, tint: "bg-warning/10 text-warning" },
    { icon: Flame, label: "Streak Saat Ini", value: `${summary.currentStreak} hari`, tint: "bg-brand-accent-soft text-brand-primary" },
    { icon: Medal, label: "Lencana", value: summary.badgeCount, tint: "bg-info/10 text-info" },
    { icon: CalendarClock, label: "Terakhir Aktif", value: formatRelativeTime(summary.lastActiveAt), tint: "bg-success/10 text-success" },
  ];

  return (
    <div className="learning-page">
      <Link
        href="/pembimbing/anak"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-brand-primary transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Daftar Anak
      </Link>

      <header className="page-heading mt-3 flex items-center gap-4">
        {summary.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={summary.avatarUrl}
            alt=""
            aria-hidden
            className="h-14 w-14 shrink-0 rounded-full bg-surface-soft object-cover ring-2 ring-border"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-bold text-white">
            {summary.fullName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="eyebrow">Laporan Belajar</p>
          <h1 className="!mb-0 truncate">{summary.fullName}</h1>
          <p className="!mt-0">@{summary.username}</p>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-default bg-surface p-4">
              <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.tint}`}>
                <stat.icon size={18} />
              </span>
              <p className="mt-3 font-heading text-xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs font-semibold text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 [&>*]:min-w-0">
          <WeeklyActivityChart days={weeklyBreakdown} />
          <ActivityCompositionDonut slices={composition} />
        </div>

        <div className="rounded-xl border border-default bg-surface overflow-hidden">
          <div className="border-b border-border-light p-5">
            <h3 className="font-bold text-text-primary">Riwayat Aktivitas</h3>
            <p className="text-sm text-text-secondary mt-1">
              {log.length} aktivitas terakhir, terbaru di atas.
            </p>
          </div>

          {log.length === 0 ? (
            <p className="p-5 text-sm text-text-secondary">
              Belum ada aktivitas yang tercatat untuk {summary.fullName}.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full sm:min-w-[520px] text-left text-sm">
                <caption className="sr-only">Riwayat aktivitas {summary.fullName}</caption>
                <thead>
                  <tr className="border-b border-border-light bg-surface-soft text-xs text-text-muted">
                    <th scope="col" className="py-3 pl-4 sm:pl-5 pr-3 font-semibold">Aktivitas</th>
                    <th scope="col" className="hidden sm:table-cell py-3 pr-3 font-semibold">Jenis</th>
                    <th scope="col" className="py-3 pr-3 font-semibold">Skor</th>
                    <th scope="col" className="py-3 pr-4 sm:pr-3 font-semibold">Poin</th>
                    <th scope="col" className="hidden sm:table-cell py-3 pr-5 font-semibold">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {log.map((entry) => (
                    <tr key={entry.id} className="border-b border-border-light last:border-0">
                      <td className="py-3 pl-4 sm:pl-5 pr-3">
                        <span className="block font-semibold text-text-primary">{entry.title}</span>
                        <span className="mt-0.5 block text-xs text-text-secondary sm:hidden">
                          {entry.label} · {formatRelativeTime(entry.createdAt)}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell py-3 pr-3 text-text-secondary">{entry.label}</td>
                      <td className="py-3 pr-3 text-text-secondary">
                        {entry.score !== null ? entry.score : "—"}
                      </td>
                      <td className="py-3 pr-4 sm:pr-3 font-bold text-text-primary">+{entry.pointsEarned}</td>
                      <td className="hidden sm:table-cell py-3 pr-5 text-text-secondary">{formatRelativeTime(entry.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
