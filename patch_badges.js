const fs = require('fs');
let code = fs.readFileSync('lib/progress.ts', 'utf-8');

if (!code.includes("id: 'weekly-top'")) {
  const replacement = `  { id: 'streak', name: 'Rajin Belajar', description: 'Selesaikan kuis selama tiga hari berturut-turut.' },
  { id: 'weekly-top', name: 'Juara Mingguan', description: 'Berhasil menjadi Top 1 Global dalam seminggu.' },
  { id: 'monthly-top', name: 'Juara Bulanan', description: 'Berhasil menjadi Top 1 Global dalam sebulan.' },
] as const;`;
  
  code = code.replace(
    `  { id: 'streak', name: 'Rajin Belajar', description: 'Selesaikan kuis selama tiga hari berturut-turut.' },\n] as const;`,
    replacement
  );
  
  fs.writeFileSync('lib/progress.ts', code);
  console.log("Successfully added new badges to progress.ts");
} else {
  console.log("Badges already exist in progress.ts");
}
