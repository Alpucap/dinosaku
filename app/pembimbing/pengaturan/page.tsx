import { requireRole } from "@/lib/auth/guard";
import { Settings, User, Bell, Shield, KeyRound, Link as LinkIcon } from "lucide-react";

export default async function PengaturanPage() {
  const user = await requireRole(["parents", "teacher"]);

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Akun</p>
        <h1>Pengaturan Akun</h1>
        <p>Kelola preferensi akun {user.role === 'teacher' ? 'Guru' : 'Orang Tua'} Anda di sini.</p>
      </header>
      <div className="flex flex-col gap-6 max-w-3xl">

      {user.role === 'teacher' && user.classCode && (
        <div className="rounded-xl border border-brand-primary/20 bg-brand-primary/5 p-5 flex items-start gap-4">
          <div className="h-10 w-10 bg-brand-primary text-white rounded-full flex items-center justify-center shrink-0">
            <KeyRound size={20} />
          </div>
          <div>
            <h3 className="font-bold text-brand-primary">Kode Kelas Anda</h3>
            <p className="text-sm text-text-secondary mt-1">Bagikan kode ini kepada murid-murid Anda saat mereka mendaftar agar otomatis masuk ke daftar pantauan Anda.</p>
            <div className="mt-3 bg-white border border-border-strong px-4 py-2 rounded-lg font-mono font-bold text-lg inline-block text-text-primary tracking-widest shadow-sm">
              {user.classCode}
            </div>
          </div>
        </div>
      )}

      {user.role === 'parents' && (
        <div className="rounded-xl border border-brand-accent/20 bg-brand-accent/5 p-5 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="font-bold text-text-primary">Hubungkan Anak Baru</h3>
            <p className="text-sm text-text-secondary mt-1">Masukkan kode unik dari perangkat anak untuk menghubungkannya ke dasbor ini.</p>
          </div>
          <button className="shrink-0 flex items-center gap-2 px-4 py-2 bg-brand-accent text-white text-sm font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity">
            <LinkIcon size={16} /> Hubungkan
          </button>
        </div>
      )}

      <div className="rounded-xl border border-default bg-surface overflow-hidden">
        <ul className="divide-y divide-border-light">
          <li className="flex items-center gap-4 p-5 hover:bg-surface-soft cursor-pointer transition-colors">
            <User size={20} className="text-text-muted" />
            <div>
              <p className="font-bold text-text-primary">Profil Pengguna</p>
              <p className="text-xs text-text-secondary">Ubah nama, avatar, dan kata sandi</p>
            </div>
          </li>
          <li className="flex items-center gap-4 p-5 hover:bg-surface-soft cursor-pointer transition-colors">
            <Bell size={20} className="text-text-muted" />
            <div>
              <p className="font-bold text-text-primary">Notifikasi</p>
              <p className="text-xs text-text-secondary">Atur pengingat belajar dan laporan mingguan</p>
            </div>
          </li>
          <li className="flex items-center gap-4 p-5 hover:bg-surface-soft cursor-pointer transition-colors">
            <Shield size={20} className="text-text-muted" />
            <div>
              <p className="font-bold text-text-primary">Privasi & Keamanan</p>
              <p className="text-xs text-text-secondary">Atur visibilitas data anak-anak</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
}
