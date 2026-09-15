import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Star, Medal, ChevronRight, BookOpen, CheckCircle, Clock } from "lucide-react";

export default async function PembimbingDashboardPage() {
  const user = await requireRole(["parents", "teacher"]);

  let childrenIds: string[] = [];
  let children: any[] = [];

  if (user.role === 'teacher' && user.classCode) {
    children = await prisma.user.findMany({
      where: { role: 'CHILDREN', classCode: user.classCode },
      include: { gamification: true, userBadges: true }
    });
    childrenIds = children.map((c) => c.id);
  } else if (user.role === 'parents') {
    children = await prisma.user.findMany({
      where: { role: 'CHILDREN', parentId: user.id },
      include: { gamification: true, userBadges: true }
    });
    childrenIds = children.map((c) => c.id);
  }

  const totalChildren = children.length;
  const totalPoints = children.reduce((sum, child) => sum + (child.gamification?.totalPoints || 0), 0);
  const totalBadges = children.reduce((sum, child) => sum + (child.userBadges?.length || 0), 0);
  
  const topPerformers = [...children]
    .sort((a, b) => (b.gamification?.totalPoints || 0) - (a.gamification?.totalPoints || 0))
    .slice(0, 3);

  const recentActivities = await prisma.activityHistory.findMany({
    where: { userId: { in: childrenIds } },
    include: { user: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
    take: 3
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-text-primary">
          Dasbor {user.role === 'teacher' ? 'Guru' : 'Orang Tua'}
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Selamat datang, {user.fullName}! Pantau perkembangan belajar {user.role === 'teacher' ? 'murid-muridmu' : 'anak-anakmu'} di sini.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="flex flex-col justify-center rounded-xl border border-default bg-surface p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total {user.role === 'teacher' ? 'Murid' : 'Anak'}</span>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-brand-primary">{totalChildren}</p>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-default bg-surface p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <Star className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Poin</span>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-brand-accent">{totalPoints}</p>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-default bg-surface p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <Medal className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Total Lencana</span>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-brand-primary">{totalBadges}</p>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-warning/30 bg-warning-soft/30 p-5">
          <div className="flex items-center gap-2 text-warning">
            <span className="text-lg leading-none">⚡</span>
            <span className="text-xs font-bold uppercase tracking-wider">Energi Bulanan</span>
          </div>
          <p className="mt-2 font-heading text-3xl font-bold text-warning">{user.gamification?.energy || 0}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-default bg-surface overflow-hidden flex flex-col">
          <div className="border-b border-border-light bg-surface-soft px-5 py-4 flex justify-between items-center">
            <h3 className="font-heading text-base font-bold text-text-primary">Bintang Kelas</h3>
            <Link href="/pembimbing/anak" className="text-xs font-semibold text-brand-primary flex items-center hover:underline">
              Lihat semua <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          {topPerformers.length > 0 ? (
            <ul className="divide-y divide-border-light flex-1">
              {topPerformers.map((child, idx) => (
                <li key={child.id} className="flex items-center justify-between p-5 hover:bg-surface-soft transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${idx === 0 ? 'bg-brand-accent' : idx === 1 ? 'bg-[#94a3b8]' : 'bg-[#d97706]'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary">{child.fullName}</p>
                      <p className="text-xs text-text-muted">@{child.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading text-lg font-bold text-brand-primary">{child.gamification?.totalPoints || 0}</p>
                    <p className="text-xs text-text-secondary">poin</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center text-text-secondary text-sm flex-1 flex items-center justify-center">
              Belum ada anak yang aktif belajar.
            </div>
          )}
        </div>

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
                      {act.type === 'QUIZ_COMPLETED' ? <CheckCircle size={16} /> : <BookOpen size={16} />}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{act.title}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      <span className="font-semibold">{act.user.fullName}</span> {act.type === 'QUIZ_COMPLETED' ? 'mendapatkan' : 'membaca'} {act.pointsEarned} poin
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
                      <Clock size={10} />
                      {new Date(act.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
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
