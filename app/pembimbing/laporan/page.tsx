import { requireRole } from "@/lib/auth/guard";
import { FileText, Download, TrendingUp } from "lucide-react";

export default async function LaporanPage() {
  const user = await requireRole(["parents", "teacher"]);

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Laporan Belajar</h1>
        <p>Ringkasan mingguan atau bulanan tentang aktivitas anak.</p>
      </header>
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 border border-border-strong text-text-primary text-sm font-bold rounded-lg hover:bg-surface-soft transition-colors w-max">
            <Download size={16} /> Unduh PDF
          </button>
        </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-default bg-surface p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-primary" /> Statistik 7 Hari Terakhir
            </h3>
            <p className="text-sm text-text-secondary mt-1">Grafik perolehan poin membaca dan kuis.</p>
          </div>
          
          <div className="mt-8 flex items-end justify-between gap-2 h-40">
            {[30, 70, 45, 90, 60, 100, 85].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full">
                <div className="w-full bg-surface-soft rounded-t-sm relative flex justify-end flex-col h-full">
                  <div className="w-full bg-brand-primary rounded-t-sm" style={{ height: `${val}%` }}></div>
                </div>
                <span className="text-[10px] text-text-muted">H-{7-i}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-default bg-surface p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-brand-primary" /> Analisis Gaya Belajar (Segera Hadir)
            </h3>
            <p className="text-sm text-text-secondary mt-1">Sistem AI Dinosaku akan menganalisis topik apa yang paling disukai anak dan di mana mereka butuh bantuan.</p>
          </div>
          
          <p className="text-xs text-text-muted mt-8 p-4 bg-surface-soft rounded-lg italic">
            Sistem membutuhkan setidaknya 7 hari data berturut-turut untuk menghasilkan analisis gaya belajar AI yang akurat.
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
