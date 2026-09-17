const fs = require('fs');
let code = fs.readFileSync('app/(dashboard)/profile/page.tsx', 'utf-8');

code = code.replace(
  /} else if (user.role === 'teacher' && user.classCode) {/g,
  `} else if (user.role === 'teacher') {`
);

code = code.replace(
  /where: { role: 'CHILDREN', classCode: user.classCode },/g,
  `where: { role: 'CHILDREN', joinedClasses: { some: { teacherId: user.id } } },`
);

code = code.replace(
  /if (user.role === 'children' && user.classCode) {/g,
  `if (user.role === 'children') {`
);

code = code.replace(
  /where: { role: 'TEACHER', classCode: user.classCode },/g,
  `where: { role: 'TEACHER', ownedClasses: { some: { students: { some: { id: user.id } } } } },`
);

code = code.replace(
  /select: { id: true, fullName: true, classCode: true }/g,
  `select: { id: true, fullName: true }`
);

fs.writeFileSync('app/(dashboard)/profile/page.tsx', code);
console.log("Fixed profile page");
