const fs = require('fs');
let codeBadge = fs.readFileSync('components/dino/BadgeMedal.tsx', 'utf-8');

if (!codeBadge.includes('PiggyBank')) {
  codeBadge = codeBadge.replace(
    "Trophy, Award } from 'lucide-react';",
    "Trophy, Award, PiggyBank } from 'lucide-react';"
  );
  codeBadge = codeBadge.replace(
    "'monthly-top': Award",
    "'monthly-top': Award,\n  'gold-saver': PiggyBank"
  );
  fs.writeFileSync('components/dino/BadgeMedal.tsx', codeBadge);
  console.log("Updated BadgeMedal.tsx");
}

let codeProg = fs.readFileSync('lib/progress.ts', 'utf-8');
if (!codeProg.includes("id: 'gold-saver'")) {
  codeProg = codeProg.replace(
    `  { id: 'monthly-top', name: 'Juara Bulanan', description: 'Berhasil menjadi Top 1 Global dalam sebulan.' },\n] as const;`,
    `  { id: 'monthly-top', name: 'Juara Bulanan', description: 'Berhasil menjadi Top 1 Global dalam sebulan.' },\n  { id: 'gold-saver', name: 'Celengan Emas', description: 'Mengumpulkan 1.000 Poin dan menjadi master literasi finansial.' },\n] as const;`
  );
  fs.writeFileSync('lib/progress.ts', codeProg);
  console.log("Updated progress.ts");
}
