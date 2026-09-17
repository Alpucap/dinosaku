import { ACTIVITY_TYPE_META, type ActivityType, type DayBreakdown } from "@/lib/data/report";

const SERIES_ORDER: (ActivityType | "OTHER")[] = [
  "STORY_READ",
  "QUIZ_COMPLETED",
  "SAVING_DEPOSIT",
  "OTHER",
];

export function WeeklyActivityChart({ days }: { days: DayBreakdown[] }) {
  const hasOther = days.some((d) => (d.byType.OTHER ?? 0) > 0);
  const series = hasOther ? SERIES_ORDER : SERIES_ORDER.slice(0, 3);

  // Satu skala untuk semua bar, supaya tingginya bisa dibandingkan
  // antar-hari — bukan tiap bar diskalakan ke dirinya sendiri.
  const maxTotal = Math.max(...days.map((d) => d.totalPoints), 1);
  const weekTotal = days.reduce((sum, d) => sum + d.totalPoints, 0);

  return (
    <div className="rounded-xl border border-default bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-text-primary">
            Poin 7 Hari Terakhir
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Dipecah menurut jenis aktivitas — cerita, kuis, dan menabung.
          </p>
        </div>
        <p className="text-sm text-text-secondary shrink-0">
          Total minggu ini:{" "}
          <span className="font-bold text-text-primary">{weekTotal} poin</span>
        </p>
      </div>

      {/* Legenda — selalu tampil karena ini grafik banyak-seri (>= 2). */}
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5">
        {series.map((type) => (
          <li key={type} className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: ACTIVITY_TYPE_META[type].colorVar }}
              aria-hidden
            />
            {ACTIVITY_TYPE_META[type].label}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between gap-2 sm:gap-3 h-48">
        {days.map((day, i) => {
          const heightPercent = Math.max((day.totalPoints / maxTotal) * 100, day.totalPoints > 0 ? 4 : 2);
          return (
            <div key={i} className="group relative flex h-full w-full flex-col items-center justify-end gap-2">
              {/* Tooltip — murni CSS, tidak butuh state client. */}
              <div className="pointer-events-none absolute bottom-full mb-2 hidden min-w-max flex-col items-center gap-0.5 rounded-lg bg-text-primary px-2.5 py-1.5 text-white shadow-lg group-hover:flex z-10">
                <span className="text-[11px] font-bold">{day.totalPoints} poin</span>
                {series.map((type) => {
                  const value = day.byType[type];
                  if (!value) return null;
                  return (
                    <span key={type} className="text-[10px] text-white/80">
                      {ACTIVITY_TYPE_META[type].label}: {value}
                    </span>
                  );
                })}
              </div>

              <div
                className="flex w-full flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px]"
                style={{ height: `${heightPercent}%` }}
              >
                {day.totalPoints === 0 ? (
                  <div className="h-full w-full bg-surface-soft" />
                ) : (
                  series
                    .filter((type) => (day.byType[type] ?? 0) > 0)
                    .map((type) => (
                      <div
                        key={type}
                        className="w-full"
                        style={{
                          height: `${((day.byType[type] ?? 0) / day.totalPoints) * 100}%`,
                          backgroundColor: ACTIVITY_TYPE_META[type].colorVar,
                        }}
                      />
                    ))
                )}
              </div>
              <span className="text-[10px] font-bold text-text-muted">{day.label}</span>
            </div>
          );
        })}
      </div>

      {/* Tabel yang sama sebagai data — bukan cuma dekorasi tersembunyi. */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full sm:min-w-[420px] text-left text-xs">
          <caption className="sr-only">Rincian poin harian menurut jenis aktivitas</caption>
          <thead>
            <tr className="border-b border-border-light text-text-muted">
              <th scope="col" className="py-2 pr-3 font-semibold">Hari</th>
              {series.map((type) => (
                <th key={type} scope="col" className="py-2 pr-3 font-semibold">
                  {ACTIVITY_TYPE_META[type].label}
                </th>
              ))}
              <th scope="col" className="py-2 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day, i) => (
              <tr key={i} className="border-b border-border-light last:border-0">
                <td className="py-2 pr-3 font-semibold text-text-primary">{day.label}</td>
                {series.map((type) => (
                  <td key={type} className="py-2 pr-3 text-text-secondary">
                    {day.byType[type] ?? 0}
                  </td>
                ))}
                <td className="py-2 font-bold text-text-primary">{day.totalPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
