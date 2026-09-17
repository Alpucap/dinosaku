import { requireRole } from "@/lib/auth/guard";
import { Settings, User, Bell, Shield, Link as LinkIcon } from "lucide-react";

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
