const fs = require('fs');

// 1. Update lib/menu/pembimbing.ts
let menuCode = fs.readFileSync('lib/menu/pembimbing.ts', 'utf-8');
menuCode = menuCode.replace(
  'import {',
  'import {\n  Briefcase,'
);
menuCode = menuCode.replace(
  '{ name: "Dasbor", href: "/pembimbing", icon: LayoutDashboard },',
  '{ name: "Dasbor", href: "/pembimbing", icon: LayoutDashboard },\n      { name: "Manajemen Kelas", href: "/pembimbing/kelas", icon: Briefcase },'
);
fs.writeFileSync('lib/menu/pembimbing.ts', menuCode);

// 2. Update components/layout/PembimbingShell.tsx to filter out "Manajemen Kelas" for non-teachers
let shellCode = fs.readFileSync('components/layout/PembimbingShell.tsx', 'utf-8');
shellCode = shellCode.replace(
  'if (item.name === "Koleksi Cerita" && user?.role !== \'teacher\') return false;',
  'if ((item.name === "Koleksi Cerita" || item.name === "Manajemen Kelas") && user?.role !== \'teacher\') return false;'
);
fs.writeFileSync('components/layout/PembimbingShell.tsx', shellCode);
console.log("Menu updated!");
