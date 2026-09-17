const fs = require('fs');
const filePath = 'app/(dashboard)/profile/_sections/ChildrenProfileSection.tsx';
let lines = fs.readFileSync(filePath, 'utf-8').split('\\n');

// Hapus semua "use client" dan import Link
lines = lines.filter(line => !line.includes('use client') && line !== 'import Link from "next/link";');

// Tambahkan "use client" di baris pertama dan import Link di baris kedua
lines.unshift('import Link from "next/link";');
lines.unshift('"use client";');

fs.writeFileSync(filePath, lines.join('\\n'));
console.log("Fixed use client positioning");
