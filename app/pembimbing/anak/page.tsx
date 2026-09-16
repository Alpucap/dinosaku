import Link from "next/link";
import { Flame, Star, Medal, UserRound, ChevronRight } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { getGuardianScopeLabel } from "@/lib/data/children";
import UnlinkButton from "@/components/dino/UnlinkButton";

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  inactive: "Tidak aktif",
  suspended: "Ditangguhkan",
};

export default async function DaftarAnakPage() {
  const guardian = await requireRole(["parents", "teacher"]);
  
  let children: any[] = [];
  if (guardian.role === 'teacher' && guardian.classCode) {
    children = await prisma.user.findMany({
      where: { role: 'CHILDREN', classCode: guardian.classCode },
      include: { gamification: true, userBadges: true, activities: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
  } else if (guardian.role === 'parents') {
    children = await prisma.user.findMany({
      where: { role: 'CHILDREN', parentId: guardian.id },
      include: { gamification: true, userBadges: true, activities: { take: 1, orderBy: { createdAt: 'desc' } } }
    });
  }

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Daftar Anak</h1>
        <p>{getGuardianScopeLabel(guardian as any)} — {children.length} anak.</p>
      </header>
      <div className="flex flex-col gap-6">

      {children.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-text-muted">
            <UserRound className="h-6 w-6" />
          </span>
          <p className="text-sm font-semibold text-text-primary">
            Belum ada anak yang terhubung
          </p>
          <p className="max-w-sm text-sm text-text-secondary">
            {guardian.role === "teacher"
              ? "Anak akan muncul di sini setelah kode kelasmu dipakai saat mereka mendaftar."
              : "Tambahkan anak dari halaman pengaturan untuk mulai memantau progresnya."}
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => {
            const game = child.gamification;

            return (
              <li
                key={child.id}
                className="flex flex-col gap-4 rounded-xl border border-default bg-surface p-5 transition-shadow hover:shadow-card"
              >
                <Link
                  href={`/pembimbing/anak/${child.id}`}
                  className="group flex items-center gap-3"
                >
                  {child.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={child.avatarUrl}
                      alt=""
                      aria-hidden
                      className="h-12 w-12 shrink-0 rounded-full bg-surface-soft object-cover ring-2 ring-border"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-primary text-base font-bold text-white">
                      {child.fullName.slice(0, 1).toUpperCase()}
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-base font-bold text-text-primary group-hover:text-brand-primary group-hover:underline">
                      {child.fullName}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      @{child.username}
                    </p>
                  </div>
                  <ChevronRight size={18} className="shrink-0 text-text-muted group-hover:text-brand-primary" />
                </Link>

                <div className="flex flex-wrap gap-2 items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {child.classCode && (
                      <span className="rounded-full bg-brand-accent-soft px-2.5 py-1 text-[11px] font-semibold text-brand-primary">
                        {child.classCode}
                      </span>
                    )}
                    <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                      Aktif
                    </span>
                  </div>
                  <UnlinkButton role={guardian.role} childName={child.fullName} childId={child.id} />
                </div>

                {game ? (
                  <dl className="grid grid-cols-3 gap-2 border-t border-border-light pt-3 text-center">
                    <div>
                      <dt className="sr-only">Poin</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Star className="h-3.5 w-3.5 text-brand-accent" />
                        {game.totalPoints}
                      </dd>
                      <p className="text-[11px] text-text-muted">Poin</p>
                    </div>
                    <div>
                      <dt className="sr-only">Runtutan hari</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Flame className="h-3.5 w-3.5 text-brand-primary" />
                        {game.currentStreak}
                      </dd>
                      <p className="text-[11px] text-text-muted">Hari</p>
                    </div>
                    <div>
                      <dt className="sr-only">Lencana</dt>
                      <dd className="flex items-center justify-center gap-1 font-heading text-sm font-bold text-text-primary">
                        <Medal className="h-3.5 w-3.5 text-brand-primary" />
                        {child.userBadges?.length || 0}
                      </dd>
                      <p className="text-[11px] text-text-muted">Lencana</p>
                    </div>
                  </dl>
                ) : (
                  <p className="border-t border-border-light pt-3 text-xs text-text-muted">
                    Belum ada aktivitas belajar yang tercatat.
                  </p>
                )}

                {child.activities && child.activities.length > 0 && (
                  <div className="border-t border-border-light pt-3">
                    <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Aktivitas Terakhir</p>
                    <p className="text-xs text-brand-primary font-semibold truncate bg-brand-primary/5 px-2 py-1 rounded-md">
                      {child.activities[0].title}
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
    </div>
  );
}
