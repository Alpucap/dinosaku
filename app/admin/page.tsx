import { DashboardClient } from "./DashboardClient";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/guard";

export const metadata = {
  title: "Dasbor Admin | Dinosaku",
};

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);

  const [totalUsers, activeUsers, premiumUsers, roleGroup] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({ where: { plan: "PREMIUM" } }),
    prisma.user.groupBy({
      by: ["role"],
      _count: {
        role: true,
      },
    }),
  ]);

  const roleData = roleGroup.map((r) => ({
    name: r.role,
    value: r._count.role,
  }));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const growthMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    growthMap.set(dateStr, 0);
  }

  recentUsers.forEach((user) => {
    const dateStr = user.createdAt.toISOString().split("T")[0];
    if (growthMap.has(dateStr)) {
      growthMap.set(dateStr, growthMap.get(dateStr)! + 1);
    }
  });

  const growthData = Array.from(growthMap.entries()).map(([date, count]) => ({
    date: date.substring(5),
    users: count,
  }));

  const stats = {
    totalUsers,
    activeUsers,
    premiumUsers,
  };

  return (
    <div className="learning-page w-full space-y-6">
      <header className="page-heading">
        <p className="eyebrow">Administrasi</p>
        <h1>Dasbor Admin</h1>
        <p>Ikhtisar statistik dan performa Dinosaku.</p>
      </header>

      <DashboardClient stats={stats} growthData={growthData} roleData={roleData} />
    </div>
  );
}
