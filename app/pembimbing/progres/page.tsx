import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import ProgresBelajarClient from "./ProgresBelajarClient";

export default async function ProgresBelajarPage() {
  const user = await requireRole(["parents", "teacher"]);

  let childrenIds = [];
  if (user.role === 'teacher' ) {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', joinedClasses: { some: { teacherId: user.id } } }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  } else if (user.role === 'parents') {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  }

  const activities = await prisma.activityHistory.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
    // Fetch more for client-side pagination (e.g. 500 max)
    take: 500
  });

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Progres Belajar</h1>
        <p>Pantau aktivitas membaca cerita dan hasil kuis terbaru dari anak-anak.</p>
      </header>
      <div className="flex flex-col gap-6">
        <ProgresBelajarClient data={activities} />
      </div>
    </div>
  );
}
