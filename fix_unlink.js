const fs = require('fs');
let code = fs.readFileSync('app/api/pembimbing/unlink/route.ts', 'utf-8');

const target = `    if (user.role === 'teacher') {
      await prisma.user.update({
        where: { id: childId },
        data: { classCode: null }
      });
    } else if (user.role === 'parents') {`;

const replacement = `    if (user.role === 'teacher') {
      const classrooms = await prisma.classroom.findMany({
        where: { teacherId: user.id, students: { some: { id: childId } } },
        select: { id: true }
      });
      await prisma.user.update({
        where: { id: childId },
        data: { joinedClasses: { disconnect: classrooms.map(c => ({ id: c.id })) } }
      });
    } else if (user.role === 'parents') {`;

code = code.replace(target, replacement);
fs.writeFileSync('app/api/pembimbing/unlink/route.ts', code);
console.log("Fixed unlink route");
