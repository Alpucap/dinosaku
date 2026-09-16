const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER' },
    select: { id: true, fullName: true }
  });

  if (teachers.length === 0) {
    console.log("No teachers found!");
    return;
  }

  for (const teacher of teachers) {
    await prisma.gamification.upsert({
      where: { userId: teacher.id },
      update: { energy: 2 },
      create: {
        userId: teacher.id,
        totalPoints: 0,
        currentStreak: 0,
        energy: 2,
        maxEnergy: 5
      }
    });
    console.log(`Updated energy to 2 for teacher: ${teacher.fullName}`);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
