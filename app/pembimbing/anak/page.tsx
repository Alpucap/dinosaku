import { Flame, Star, Medal, UserRound } from "lucide-react";
import { requireRole } from "@/lib/auth/guard";
import {
  getChildrenForGuardian,
  getGuardianScopeLabel,
} from "@/lib/data/children";

const STATUS_LABEL: Record<string, string> = {
  active: "Aktif",
  inactive: "Tidak aktif",
  suspended: "Ditangguhkan",
};

export default async function DaftarAnakPage() {
  const guardian = await requireRole(["parents", "teacher"]);
  const children = getChildrenForGuardian(guardian);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-text-primary">
          Daftar Anak
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          {getGuardianScopeLabel(guardian)} — {children.length} anak.
        </p>
      </div>

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
                <div className="flex items-center gap-3">
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

                  <div className="min-w-0">
                    <p className="truncate font-heading text-base font-bold text-text-primary">
                      {child.fullName}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      @{child.username}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {child.classCode && (
                    <span className="rounded-full bg-brand-accent-soft px-2.5 py-1 text-[11px] font-semibold text-brand-primary">
                      {child.classCode}
                    </span>
                  )}
                  <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                    {STATUS_LABEL[child.status] ?? child.status}
                  </span>
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
                        {game.totalBadges}
                      </dd>
                      <p className="text-[11px] text-text-muted">Lencana</p>
                    </div>
                  </dl>
                ) : (
                  <p className="border-t border-border-light pt-3 text-xs text-text-muted">
                    Belum ada aktivitas belajar yang tercatat.
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
