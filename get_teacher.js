const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teacher = await prisma.user.findFirst({ where: { role: 'TEACHER' } });
  if (teacher) {
    console.log("Guru:", teacher.fullName, "Email:", teacher.email);
  }
}

main().finally(() => prisma.$disconnect());
