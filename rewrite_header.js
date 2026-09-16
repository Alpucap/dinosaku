const fs = require('fs');
let content = fs.readFileSync('app/pembimbing/page.tsx', 'utf-8');

const oldHeader = `      <header className="page-heading">
        <p className="eyebrow">Dasbor Pembimbing</p>
        <h1>Dasbor {user.role === "teacher" ? "Guru" : "Orang Tua"}</h1>
        <p>
          Pantau seberapa sering {user.role === "teacher" ? "murid-murid" : "anak-anak"}
          belajar, kuis yang diselesaikan, dan poin yang dikumpulkan.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <PrintReportButton />
        </div>`;

const newHeader = `      <header className="page-heading flex flex-col md:flex-row md:items-start md:justify-between gap-4 max-w-full">
        <div className="max-w-2xl">
          <p className="eyebrow">Dasbor Pembimbing</p>
          <h1>Dasbor {user.role === "teacher" ? "Guru" : "Orang Tua"}</h1>
          <p>
            Pantau seberapa sering {user.role === "teacher" ? "murid-murid" : "anak-anak"}
            belajar, kuis yang diselesaikan, dan poin yang dikumpulkan.
          </p>
        </div>
        <div className="shrink-0 mt-4 md:mt-10">
          <PrintReportButton />
        </div>
      </header>

      <div className="flex flex-col gap-6">`;

if(content.includes('flex justify-end')) {
  content = content.replace(oldHeader, newHeader);
  fs.writeFileSync('app/pembimbing/page.tsx', content);
  console.log("Success");
} else {
  console.log("Failed to find header");
}
