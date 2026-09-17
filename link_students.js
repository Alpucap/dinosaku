const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find a teacher
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER' }
  });

  if (!teacher) {
    console.log("Tidak ada guru di database.");
    return;
  }

  // Create a default class if teacher doesn't have one
  let classroom = await prisma.classroom.findFirst({
    where: { teacherId: teacher.id }
  });

  if (!classroom) {
    classroom = await prisma.classroom.create({
      data: {
        name: "Cerdas Finansial 4A",
        code: "FIN4A-X",
        teacherId: teacher.id
      }
    });
    console.log("Dibuatkan kelas baru:", classroom.name);
  }

  // Find some children
  const children = await prisma.user.findMany({
    where: { role: 'CHILDREN' },
    take: 3
  });

  if (children.length === 0) {
    console.log("Tidak ada murid di database.");
    return;
  }

  // Link children to classroom
  for (const child of children) {
    await prisma.user.update({
      where: { id: child.id },
      data: {
        joinedClasses: {
          connect: { id: classroom.id }
        }
      }
    });
    console.log("Berhasil menghubungkan murid", child.fullName, "ke kelas", classroom.name);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
