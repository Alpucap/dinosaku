import type { CompositionSlice } from "@/lib/data/report";

const RADIUS = 40;
const STROKE = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3; // celah kecil antar-segmen, dalam satuan keliling SVG

export function ActivityCompositionDonut({ slices }: { slices: CompositionSlice[] }) {
  const totalCount = slices.reduce((sum, s) => sum + s.count, 0);
  const visible = slices.filter((s) => s.count > 0);

  let offset = 0;
  const arcs = visible.map((slice) => {
    const length = Math.max((slice.percent / 100) * CIRCUMFERENCE - GAP, 0);
    const arc = { ...slice, dasharray: `${length} ${CIRCUMFERENCE - length}`, dashoffset: -offset };
    offset += (slice.percent / 100) * CIRCUMFERENCE;
    return arc;
  });


  const storySlice = slices.find(s => s.type === 'STORY_READ')?.count || 0;
  const quizSlice = slices.find(s => s.type === 'QUIZ_COMPLETED')?.count || 0;
  
  const literasiScore = Math.min(Math.max(Math.round((storySlice / 5) * 100), 15), 98);
  const quizScore = Math.min(Math.max(Math.round(totalCount > 0 ? (quizSlice / (storySlice + quizSlice || 1)) * 100 : 10), 15), 95);
  const consistScore = Math.min(Math.max(Math.round((totalCount / 20) * 100), 20), 90);

  const getLabel = (score: number) => score >= 80 ? "Sangat Baik" : score >= 50 ? "Menengah" : "Pemula";

  return (
    <div className="rounded-xl border border-default bg-surface p-6 flex flex-col h-full">
      <h3 className="font-bold text-text-primary">Komposisi Aktivitas</h3>
      <p className="text-sm text-text-secondary mt-1">
        Sebaran jenis aktivitas sepanjang riwayat belajarnya.
      </p>

      <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative shrink-0">
          <svg viewBox="0 0 100 100" className="h-40 w-40 -rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--color-surface-soft)"
              strokeWidth={STROKE}
            />
            {arcs.map((arc) => (
              <circle
                key={arc.type}
                cx="50"
                cy="50"
                r={RADIUS}
                fill="none"
                stroke={arc.colorVar}
                strokeWidth={STROKE}
                strokeDasharray={arc.dasharray}
                strokeDashoffset={arc.dashoffset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-bold text-text-primary">
              {totalCount}
            </span>
            <span className="text-[11px] text-text-muted">aktivitas</span>
          </div>
        </div>

        {/* Legenda sekaligus tabel datanya — bukan dua hal terpisah. */}
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Rincian komposisi jenis aktivitas</caption>
          <thead>
            <tr className="border-b border-border-light text-xs text-text-muted">
              <th scope="col" className="py-1.5 pr-3 font-semibold">Jenis</th>
              <th scope="col" className="py-1.5 pr-3 font-semibold">Jumlah</th>
              <th scope="col" className="py-1.5 font-semibold">Persentase</th>
            </tr>
          </thead>
          <tbody>
            {slices.map((slice) => (
              <tr key={slice.type} className="border-b border-border-light last:border-0">
                <td className="py-2 pr-3">
                  <span className="flex items-center gap-2 font-semibold text-text-primary">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.colorVar }}
                      aria-hidden
                    />
                    {slice.label}
                  </span>
                </td>
                <td className="py-2 pr-3 text-text-secondary">{slice.count}</td>
                <td className="py-2 font-bold text-text-primary">{slice.percent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-auto pt-8">
        <h4 className="font-bold text-text-primary text-sm mb-4">Estimasi Keterampilan Anak</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-text-secondary">Minat Literasi Cerita</span>
              <span className="font-bold text-[#10b981]">{getLabel(literasiScore)}</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-[#10b981] transition-all duration-1000" style={{ width: `${literasiScore}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-text-secondary">Pemahaman Teks (Kuis)</span>
              <span className="font-bold text-brand-primary">{getLabel(quizScore)}</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-primary transition-all duration-1000" style={{ width: `${quizScore}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-text-secondary">Konsistensi Belajar</span>
              <span className="font-bold text-brand-accent">{getLabel(consistScore)}</span>
            </div>
            <div className="h-2 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-brand-accent transition-all duration-1000" style={{ width: `${consistScore}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
