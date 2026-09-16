import Link from "next/link";
import { GraduationCap, UserRound } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { findClassTeacher } from "@/lib/data/class";
import { JoinClassForm } from "@/components/dino/JoinClassForm";

export default async function KelasPage() {
  const user = await getSessionUser();
  const teacher = user?.classCode ? await findClassTeacher(user.classCode) : null;

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Kelas</p>
        <h1>Kelasku</h1>
        <p>Gabung ke kelas gurumu pakai kode yang dia bagikan.</p>
      </header>

      <div className="flex max-w-2xl flex-col gap-6">
        {!user ? (
          <div className="rounded-xl border border-default bg-surface p-6">
            <p className="text-text-secondary">
              Kamu belum masuk.{" "}
              <Link href="/login" className="font-bold text-brand-primary hover:underline">
                Masuk dulu
              </Link>{" "}
              supaya bisa bergabung ke kelas.
            </p>
          </div>
        ) : user.role !== "children" ? (
          <div className="rounded-xl border border-default bg-surface p-6">
            <p className="text-text-secondary">
              Halaman ini untuk akun anak. Guru membagikan kode kelasnya lewat
              menu Pengaturan di dasbor Pembimbing.
            </p>
          </div>
        ) : (
          <>
            {teacher ? (
              <div className="flex items-start gap-4 rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                  <GraduationCap size={20} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-bold text-brand-primary">
                    Kamu sudah di kelas ini
                  </h3>
                  <div className="mt-3 inline-block rounded-lg border border-border-strong bg-white px-4 py-2 font-mono text-lg font-bold tracking-widest text-text-primary shadow-sm">
                    {teacher.classCode}
                  </div>
                  <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                    <UserRound size={16} aria-hidden /> Guru: {teacher.fullName}
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border-strong bg-surface p-6 text-center">
                <p className="font-semibold text-text-primary">
                  Kamu belum masuk kelas mana pun
                </p>
                <p className="mt-1 text-sm text-text-secondary">
                  Minta kode kelas ke gurumu, lalu ketik di bawah ini.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-default bg-surface p-6">
              <JoinClassForm currentCode={user.classCode} />
              <p className="mt-4 text-xs text-text-muted">
                Setelah gabung, gurumu bisa memantau progres belajarmu dan
                mengirim misi lewat menu Aksi &amp; Misi.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
