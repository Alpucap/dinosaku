import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import {
  formatRelativeTime,
  getChildActivityLog,
  getChildReportSummaries,
  getWeeklyBreakdown,
} from "@/lib/data/report";
import DasborClient from "./DasborClient";

export default async function DasborAnakPage() {
  const user = await requireRole(["children"]);

  const [[summary], weekly, log, presetStories, assignments, transactions, goals, quizCount] = await Promise.all([
    getChildReportSummaries([user.id]),
    getWeeklyBreakdown([user.id]),
    getChildActivityLog(user.id, 5),
    prisma.story.findMany({
      where: { isPreset: true },
      orderBy: { createdAt: "asc" },
      select: { id: true, title: true },
    }),
    prisma.assignment.findMany({
      where: { assigneeId: user.id },
      include: { assigner: { select: { fullName: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.walletTransaction.findMany({
      where: { userId: user.id },
      select: { type: true, amount: true },
    }),
    prisma.savingGoal.findMany({
      where: { userId: user.id },
      select: { id: true, title: true, targetAmount: true, currentAmount: true, isCompleted: true },
    }),
    prisma.activityHistory.count({ where: { userId: user.id, type: "QUIZ_COMPLETED" } }),
  ]);

  const income = transactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);

  return (
    <DasborClient
      firstName={user.fullName.split(" ")[0]}
      isPremium={user.plan === "premium"}
      quizCount={quizCount}
      stats={{
        totalPoints: summary?.totalPoints ?? 0,
        currentStreak: summary?.currentStreak ?? 0,
        badgeCount: summary?.badgeCount ?? 0,
        activitiesThisWeek: summary?.activitiesThisWeek ?? 0,
        pointsThisWeek: summary?.pointsThisWeek ?? 0,
      }}
      weekly={weekly.map((day) => ({ label: day.label, points: day.totalPoints }))}
      recent={log.map((entry) => ({
        id: entry.id,
        title: entry.title,
        label: entry.label,
        pointsEarned: entry.pointsEarned,
        timeAgo: formatRelativeTime(entry.createdAt),
      }))}
      presetStories={presetStories}
      assignments={assignments.map((a) => ({
        id: a.id,
        topic: a.topic,
        theme: a.theme,
        storyId: a.storyId,
        completed: a.status === "COMPLETED",
        assignerName: a.assigner.fullName,
      }))}
      wallet={{
        balance: income - expense,
        saved: goals.reduce((sum, g) => sum + g.currentAmount, 0),
        goalsTotal: goals.length,
        goalsDone: goals.filter((g) => g.isCompleted).length,
        topGoal:
          goals
            .filter((g) => !g.isCompleted)
            .map((g) => ({ title: g.title, percent: Math.min(Math.round((g.currentAmount / g.targetAmount) * 100), 100) }))
            .sort((a, b) => b.percent - a.percent)[0] ?? null,
      }}
    />
  );
}
