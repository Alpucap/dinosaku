import { requireRole } from "@/lib/auth/guard";
import { FileText, Download, TrendingUp } from "lucide-react";

export default async function LaporanPage() {
  const user = await requireRole(["parents", "teacher"]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text-primary">
            Laporan Belajar
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Ringkasan mingguan atau bulanan tentang aktivitas anak.
          </p>
        </div>
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

        <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-border-strong bg-surface">
          <div className="h-16 w-16 bg-surface-soft rounded-full flex items-center justify-center text-text-muted mb-4">
            <FileText size={28} />
          </div>
          <h3 className="font-bold text-text-primary mb-2">Laporan Lengkap Belum Siap</h3>
          <p className="text-sm text-text-secondary max-w-xs mx-auto">
            Sistem membutuhkan setidaknya 7 hari data berturut-turut untuk menghasilkan analisis gaya belajar AI yang akurat.
          </p>
        </div>
      </div>
    </div>
  );
}
