import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { BookOpen, CheckCircle, Clock } from "lucide-react";

export default async function ProgresBelajarPage() {
  const user = await requireRole(["parents", "teacher"]);

  let childrenIds = [];
  if (user.role === 'teacher' && user.classCode) {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', classCode: user.classCode }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  } else if (user.role === 'parents') {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true } });
    childrenIds = children.map((c: any) => c.id);
  }

  const activities = await prisma.activityHistory.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-text-primary">
          Progres Belajar
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Pantau aktivitas membaca cerita dan hasil kuis terbaru dari anak-anak.
        </p>
      </div>

      <div className="rounded-xl border border-default bg-surface p-6">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-text-secondary">
            Belum ada aktivitas belajar yang tercatat.
          </div>
        ) : (
          <div className="relative border-l-2 border-border-light ml-3">
            {activities.map((act) => (
              <div key={act.id} className="mb-8 pl-6 relative">
                <div className="absolute w-6 h-6 bg-brand-primary rounded-full -left-[13px] top-0 flex items-center justify-center text-white ring-4 ring-surface">
                  {act.type === 'QUIZ_COMPLETED' ? <CheckCircle size={12} /> : <BookOpen size={12} />}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-bold text-text-primary">{act.title}</p>
                    <p className="text-sm text-text-secondary">
                      {act.user.fullName} {act.type === 'QUIZ_COMPLETED' ? 'menyelesaikan kuis' : 'membaca cerita'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {act.score !== null && (
                      <span className="px-2 py-1 bg-brand-accent-soft text-brand-primary text-xs font-bold rounded-full">
                        Skor: {act.score}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-surface-soft text-text-muted text-xs rounded-full flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(act.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
