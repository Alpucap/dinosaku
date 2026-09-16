import { prisma } from "@/lib/prisma";

/**
 * Jenis aktivitas dari schema.prisma. Field aslinya String bebas, bukan enum,
 * jadi apa pun di luar tiga ini dikelompokkan sebagai "Lainnya" alih-alih
 * membuat query gagal atau datanya diam-diam hilang dari laporan.
 */
export const ACTIVITY_TYPES = [
  "STORY_READ",
  "QUIZ_COMPLETED",
  "SAVING_DEPOSIT",
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

function isKnownActivityType(type: string): type is ActivityType {
  return (ACTIVITY_TYPES as readonly string[]).includes(type);
}

export const ACTIVITY_TYPE_META: Record<
  ActivityType | "OTHER",
  { label: string; colorVar: string }
> = {
  STORY_READ: { label: "Membaca Cerita", colorVar: "var(--color-success)" },
  QUIZ_COMPLETED: { label: "Kuis", colorVar: "var(--color-info)" },
  SAVING_DEPOSIT: { label: "Menabung", colorVar: "var(--color-warning)" },
  OTHER: { label: "Lainnya", colorVar: "var(--color-text-muted)" },
};

export interface DayBreakdown {
  date: Date;
  label: string;
  totalPoints: number;
  byType: Partial<Record<ActivityType | "OTHER", number>>;
}

/**
 * Dipatok ke tengah malam UTC, bukan waktu lokal server — supaya
 * pengelompokan "hari ke berapa" tidak bergeser sehari kalau server dan
 * data createdAt (yang UTC) berada di zona waktu yang beda.
 */
function weekStartUTC(): Date {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - 6);
  return start;
}

export async function getWeeklyBreakdown(
  userIds: string[],
): Promise<DayBreakdown[]> {
  const start = weekStartUTC();

  const days: DayBreakdown[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    return {
      date,
      label: i === 6 ? "Hari Ini" : `H-${6 - i}`,
      totalPoints: 0,
      byType: {},
    };
  });

  if (userIds.length === 0) return days;

  const activities = await prisma.activityHistory.findMany({
    where: { userId: { in: userIds }, createdAt: { gte: start } },
    select: { type: true, pointsEarned: true, createdAt: true },
  });

  for (const act of activities) {
    const dayIndex = Math.floor(
      (act.createdAt.getTime() - start.getTime()) / 86_400_000,
    );
    const day = days[dayIndex];
    if (!day) continue;

    const bucket = isKnownActivityType(act.type) ? act.type : "OTHER";
    day.totalPoints += act.pointsEarned;
    day.byType[bucket] = (day.byType[bucket] ?? 0) + act.pointsEarned;
  }

  return days;
}

export interface CompositionSlice {
  type: ActivityType | "OTHER";
  label: string;
  colorVar: string;
  count: number;
  points: number;
  percent: number;
}

/** Komposisi jenis aktivitas sepanjang riwayat anak, bukan cuma minggu ini. */
export async function getActivityComposition(
  userIds: string[],
): Promise<CompositionSlice[]> {
  if (userIds.length === 0) return [];

  const grouped = await prisma.activityHistory.groupBy({
    by: ["type"],
    where: { userId: { in: userIds } },
    _count: { _all: true },
    _sum: { pointsEarned: true },
  });

  const total = grouped.reduce((sum, g) => sum + g._count._all, 0);

  // Tiga jenis yang dikenal skema selalu tampil di legenda walau nol —
  // legenda mendefinisikan domain penuh, bukan cuma yang kebetulan terjadi.
  const slices: CompositionSlice[] = ACTIVITY_TYPES.map((type) => {
    const row = grouped.find((g) => g.type === type);
    const count = row?._count._all ?? 0;
    return {
      type,
      label: ACTIVITY_TYPE_META[type].label,
      colorVar: ACTIVITY_TYPE_META[type].colorVar,
      count,
      points: row?._sum.pointsEarned ?? 0,
      percent: total > 0 ? Math.round((count / total) * 100) : 0,
    };
  });

  const otherRows = grouped.filter((g) => !isKnownActivityType(g.type));
  const otherCount = otherRows.reduce((sum, g) => sum + g._count._all, 0);

  if (otherCount > 0) {
    slices.push({
      type: "OTHER",
      label: ACTIVITY_TYPE_META.OTHER.label,
      colorVar: ACTIVITY_TYPE_META.OTHER.colorVar,
      count: otherCount,
      points: otherRows.reduce((sum, g) => sum + (g._sum.pointsEarned ?? 0), 0),
      percent: total > 0 ? Math.round((otherCount / total) * 100) : 0,
    });
  }

  return slices;
}

export interface ChildReportSummary {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string | null;
  totalPoints: number;
  currentStreak: number;
  badgeCount: number;
  activitiesThisWeek: number;
  pointsThisWeek: number;
  lastActiveAt: Date | null;
}

export async function getChildReportSummaries(
  childIds: string[],
): Promise<ChildReportSummary[]> {
  if (childIds.length === 0) return [];

  const [children, activities] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: childIds } },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        gamification: { select: { totalPoints: true, currentStreak: true } },
        userBadges: { select: { id: true } },
      },
    }),
    // Diambil sekali untuk semua anak, diurutkan terbaru dulu, lalu
    // dikelompokkan di memori — lebih murah daripada satu query per anak.
    prisma.activityHistory.findMany({
      where: { userId: { in: childIds } },
      select: { userId: true, pointsEarned: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const start = weekStartUTC();
  const lastActiveByUser = new Map<string, Date>();
  const weeklyByUser = new Map<string, { count: number; points: number }>();

  for (const act of activities) {
    if (!lastActiveByUser.has(act.userId)) {
      lastActiveByUser.set(act.userId, act.createdAt);
    }
    if (act.createdAt >= start) {
      const entry = weeklyByUser.get(act.userId) ?? { count: 0, points: 0 };
      entry.count += 1;
      entry.points += act.pointsEarned;
      weeklyByUser.set(act.userId, entry);
    }
  }

  return children.map((c) => ({
    id: c.id,
    fullName: c.fullName,
    username: c.username,
    avatarUrl: c.avatarUrl,
    totalPoints: c.gamification?.totalPoints ?? 0,
    currentStreak: c.gamification?.currentStreak ?? 0,
    badgeCount: c.userBadges.length,
    activitiesThisWeek: weeklyByUser.get(c.id)?.count ?? 0,
    pointsThisWeek: weeklyByUser.get(c.id)?.points ?? 0,
    lastActiveAt: lastActiveByUser.get(c.id) ?? null,
  }));
}

export function formatRelativeTime(date: Date | null): string {
  if (!date) return "Belum ada aktivitas";

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;

  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return "Kemarin";
  if (diffDay < 7) return `${diffDay} hari lalu`;

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export interface ActivityLogEntry {
  id: string;
  type: ActivityType | "OTHER";
  label: string;
  title: string;
  score: number | null;
  pointsEarned: number;
  createdAt: Date;
}

/** Riwayat lengkap satu anak, terbaru dulu — dipakai di halaman detail. */
export async function getChildActivityLog(
  childId: string,
  limit = 50,
): Promise<ActivityLogEntry[]> {
  const rows = await prisma.activityHistory.findMany({
    where: { userId: childId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    type: isKnownActivityType(r.type) ? r.type : "OTHER",
    label: ACTIVITY_TYPE_META[isKnownActivityType(r.type) ? r.type : "OTHER"].label,
    title: r.title,
    score: r.score,
    pointsEarned: r.pointsEarned,
    createdAt: r.createdAt,
  }));
}
