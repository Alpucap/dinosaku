const fs = require('fs');
let code = fs.readFileSync('app/learn/leaderboard/page.tsx', 'utf-8');

code = code.replace(
  /include: { user: { select: { id: true, fullName: true, classCode: true, avatarUrl: true } } }/g,
  `include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }`
);

code = code.replace(
  /if \(user.classCode\) \{/g,
  `const firstClass = user.role === 'children' ? (await prisma.classroom.findFirst({ where: { students: { some: { id: user.id } } }, include: { teacher: true } })) : null;
  if (firstClass) {`
);

code = code.replace(
  /const teacher = await prisma.user.findFirst\(\{.*?classCode: user.classCode.*?\}\);/s,
  `const teacher = firstClass.teacher;`
);

code = code.replace(
  /where: \{ user: \{ classCode: user.classCode, role: 'CHILDREN' \} \}/g,
  `where: { user: { role: 'CHILDREN', joinedClasses: { some: { id: firstClass.id } } } }`
);

code = code.replace(
  /\{user.classCode && \(/g,
  `{firstClass && (`
);

code = code.replace(
  /<h2>\{schoolName\} - Kelas \{user.classCode\}<\/h2>/g,
  `<h2>{schoolName} - Kelas {firstClass.name}</h2>`
);

fs.writeFileSync('app/learn/leaderboard/page.tsx', code);
console.log("Fixed leaderboard page");
