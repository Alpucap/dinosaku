import type { ChildReportSummary } from "@/lib/data/report";
import { formatRelativeTime } from "@/lib/data/report";

interface PrintableReportProps {
  guardianName: string;
  role: string;
  students: ChildReportSummary[];
}

export function PrintableReport({ guardianName, role, students }: PrintableReportProps) {
  const isTeacher = role === "teacher";
  const subjectLabel = isTeacher ? "Murid" : "Anak";

  const ranked = [...students].sort((a, b) => b.pointsThisWeek - a.pointsThisWeek);
  const totalPoints = students.reduce((sum, c) => sum + c.totalPoints, 0);
  const totalBadges = students.reduce((sum, c) => sum + c.badgeCount, 0);
  const pointsThisWeek = students.reduce((sum, c) => sum + c.pointsThisWeek, 0);
  const activitiesThisWeek = students.reduce((sum, c) => sum + c.activitiesThisWeek, 0);
  const activeThisWeek = students.filter((c) => c.activitiesThisWeek > 0).length;

  const printedAt = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const summaryRows = [
    { label: `Total ${subjectLabel}`, value: students.length },
    { label: `${subjectLabel} Aktif Minggu Ini`, value: `${activeThisWeek} dari ${students.length}` },
    { label: "Total Poin (Sepanjang Waktu)", value: totalPoints },
    { label: "Total Lencana", value: totalBadges },
    { label: "Poin Minggu Ini", value: pointsThisWeek },
    { label: "Aktivitas Minggu Ini", value: activitiesThisWeek },
  ];

  return (
    <section className="printable-report" aria-hidden>
      <header className="printable-report__head">
        <div>
          <p className="printable-report__eyebrow">Dinosaku — Laporan Perkembangan Belajar</p>
          <h1>Laporan {isTeacher ? "Kelas" : "Keluarga"}</h1>
        </div>
        <dl className="printable-report__meta">
          <div>
            <dt>{isTeacher ? "Guru" : "Orang Tua"}</dt>
            <dd>{guardianName}</dd>
          </div>
          <div>
            <dt>Dicetak</dt>
            <dd>{printedAt}</dd>
          </div>
        </dl>
      </header>

      <h2>Ringkasan</h2>
      <table className="printable-report__summary">
        <tbody>
          {summaryRows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Rincian per {subjectLabel}</h2>
      {ranked.length === 0 ? (
        <p className="printable-report__empty">
          Belum ada {subjectLabel.toLowerCase()} yang terhubung dengan akun ini.
        </p>
      ) : (
        <table className="printable-report__table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nama</th>
              <th scope="col">Poin (7 hari)</th>
              <th scope="col">Aktivitas (7 hari)</th>
              <th scope="col">Streak</th>
              <th scope="col">Total Poin</th>
              <th scope="col">Lencana</th>
              <th scope="col">Terakhir Aktif</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((child, index) => (
              <tr key={child.id}>
                <td>{index + 1}</td>
                <td>
                  {child.fullName}
                  <span className="printable-report__username">@{child.username}</span>
                </td>
                <td>{child.pointsThisWeek}</td>
                <td>{child.activitiesThisWeek}</td>
                <td>{child.currentStreak} hari</td>
                <td>{child.totalPoints}</td>
                <td>{child.badgeCount}</td>
                <td>{formatRelativeTime(child.lastActiveAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="printable-report__footer">
        Laporan ini dibuat otomatis oleh Dinosaku pada {printedAt}. Data mencakup aktivitas membaca
        cerita dan pengerjaan kuis dalam 7 hari terakhir.
      </p>
    </section>
  );
}
