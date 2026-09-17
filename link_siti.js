const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.findFirst({
    where: { 
      role: 'TEACHER',
      fullName: { contains: 'Siti Aminah', mode: 'insensitive' }
    }
  });

  if (!teacher) {
    console.log("Guru Siti Aminah tidak ditemukan.");
    return;
  }

  const classroom = await prisma.classroom.create({
    data: {
      name: "Cerdas Keuangan 5B",
      code: "SITI5B-X",
      teacherId: teacher.id
    }
  });
  console.log("Dibuatkan kelas baru:", classroom.name, "untuk", teacher.fullName);

  const children = await prisma.user.findMany({
    where: { role: 'CHILDREN' },
    skip: 3,
    take: 3
  });

  for (const child of children) {
    await prisma.user.update({
      where: { id: child.id },
      data: {
        joinedClasses: {
          connect: { id: classroom.id }
        }
      }
    });
    console.log("Berhasil menghubungkan murid", child.fullName, "ke kelas Siti Aminah");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
