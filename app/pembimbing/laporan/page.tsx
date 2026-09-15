import { requireRole } from "@/lib/auth/guard";
import { prisma } from "@/lib/prisma";
import { FileText, Download, TrendingUp, AlertCircle } from "lucide-react";

export default async function LaporanPage() {
  const user = await requireRole(["parents", "teacher"]);

  let childrenIds: string[] = [];
  if (user.role === 'teacher' && user.classCode) {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', classCode: user.classCode }, select: { id: true } });
    childrenIds = children.map(c => c.id);
  } else if (user.role === 'parents') {
    const children = await prisma.user.findMany({ where: { role: 'CHILDREN', parentId: user.id }, select: { id: true } });
    childrenIds = children.map(c => c.id);
  }

  // Set the timezone/date boundaries
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Fetch real activities
  const activities = await prisma.activityHistory.findMany({
    where: {
      userId: { in: childrenIds },
      createdAt: { gte: sevenDaysAgo }
    },
    select: {
      pointsEarned: true,
      createdAt: true
    }
  });

  // Create an array of 7 days (H-6 to H-0)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sevenDaysAgo);
    date.setDate(date.getDate() + i);
    return {
      date,
      points: 0,
      label: i === 6 ? 'Hr Ini' : `H-${6 - i}`
    };
  });

  // Group activities into the 7 days
  activities.forEach(act => {
    const actDateStr = act.createdAt.toISOString().split('T')[0];
    const targetDay = chartData.find(d => d.date.toISOString().split('T')[0] === actDateStr);
    if (targetDay) {
      targetDay.points += act.pointsEarned;
    }
  });

  // Find max points for relative bar heights
  const maxPoints = Math.max(...chartData.map(d => d.points), 20);

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Manajemen Murid / Anak</p>
        <h1>Laporan Belajar</h1>
        <p>Ringkasan mingguan tentang aktivitas dan perolehan poin.</p>
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
            <p className="text-sm text-text-secondary mt-1">Grafik perolehan poin dari petualangan dan kuis.</p>
          </div>
          
          <div className="mt-8 flex items-end justify-between gap-3 h-48">
            {chartData.map((data, i) => {
              const heightPercent = Math.max((data.points / maxPoints) * 100, 2); // Minimum 2% height so it's visible
              return (
                <div key={i} className="flex flex-col items-center gap-2 w-full group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 bg-surface-strong text-text-primary text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.points} Poin
                  </div>
                  
                  <div className="w-full bg-surface-soft rounded-t-md relative flex justify-end flex-col h-32 overflow-hidden">
                    <div 
                      className="w-full bg-brand-primary rounded-t-md transition-all duration-1000 ease-out" 
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-text-muted font-bold">{data.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-default bg-surface p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-text-primary flex items-center gap-2">
              <FileText size={18} className="text-brand-primary" /> Analisis Gaya Belajar
            </h3>
            <p className="text-sm text-text-secondary mt-1">Sistem AI Dinosaku menganalisis preferensi belajar.</p>
          </div>
          
          <div className="mt-8 flex items-start gap-4 p-4 bg-brand-primary/5 border border-brand-primary/20 rounded-xl">
            <AlertCircle className="text-brand-primary shrink-0" size={24} />
            <div>
              <h4 className="text-sm font-bold text-brand-primary">Data Belum Cukup</h4>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Dinosaku membutuhkan setidaknya riwayat aktivitas belajar selama <strong>7 hari berturut-turut</strong> dari anak-anak untuk menghasilkan wawasan gaya belajar menggunakan AI (Kecerdasan Buatan).
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
