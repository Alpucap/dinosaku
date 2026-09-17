import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS } from '../lib/data/dummy-users'
import { DUMMY_SCHOOLS } from '../lib/data/dummy-schools'

const prisma = new PrismaClient()

const NEW_BADGES = [
  { id: 'first', icon: '👣', title: 'Langkah Pertama', description: 'Berhasil lulus kuis pertamamu.' },
  { id: 'perfect', icon: '⭐', title: 'Bintang Kuis', description: 'Jawab semua soal dengan benar dalam satu kuis.' },
  { id: 'veteran', icon: '🎖️', title: 'Petualang Veteran', description: 'Berhasil menyelesaikan dan lulus 5 misi.' },
  { id: 'master', icon: '👑', title: 'Master Edukasi', description: 'Berhasil menyelesaikan dan lulus 10 misi.' },
  { id: 'rich', icon: '🪙', title: 'Sultan Poin', description: 'Berhasil mengumpulkan lebih dari 200 poin secara total.' },
  { id: 'streak', icon: '🔥', title: 'Rajin Belajar', description: 'Selesaikan kuis selama tiga hari berturut-turut.' }
];

async function main() {
  console.log(`Mulai memindahkan data dummy ke database Neon...`)
  
  // Seed Badges
  for (const b of NEW_BADGES) {
    await prisma.badge.upsert({
      where: { id: b.id },
      update: { icon: b.icon, title: b.title, description: b.description },
      create: { id: b.id, icon: b.icon, title: b.title, description: b.description }
    });
  }

  // Seed Schools
  for (const school of DUMMY_SCHOOLS) {
    await prisma.school.upsert({
      where: { id: school.id },
      update: { name: school.name, address: school.city },
      create: { id: school.id, name: school.name, address: school.city }
    })
  }

  for (const user of DUMMY_USERS) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        role: user.role.toUpperCase() as any,
        plan: user.plan ? user.plan.toUpperCase() as any : null,
        schoolId: user.schoolId
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        username: user.username,
        role: user.role.toUpperCase() as any,
        avatarUrl: user.avatarUrl,
        plan: user.plan ? user.plan.toUpperCase() as any : null,
        parentId: user.parentId,
        schoolId: user.schoolId
      }
    })

    if (user.gamification) {
      await prisma.gamification.upsert({
        where: { userId: user.id },
        update: {
          totalPoints: user.gamification.totalPoints,
          currentStreak: user.gamification.currentStreak,
          energy: user.gamification.energy || 0,
          maxEnergy: user.gamification.maxEnergy || 0,
        },
        create: {
          userId: user.id,
          totalPoints: user.gamification.totalPoints,
          currentStreak: user.gamification.currentStreak,
          energy: user.gamification.energy || 0,
          maxEnergy: user.gamification.maxEnergy || 0,
        }
      });

      // Clear existing badges to avoid duplicates/old badges
      await prisma.userBadge.deleteMany({
        where: { userId: user.id }
      });

      // Generate realistic badges based on their points/streak
      const badgesToGive = [];
      if (user.gamification.totalPoints > 0) badgesToGive.push('first');
      if (user.gamification.totalPoints >= 100) badgesToGive.push('perfect');
      if (user.gamification.totalPoints > 200) badgesToGive.push('rich');
      if (user.gamification.totalPoints >= 500) badgesToGive.push('veteran');
      if (user.gamification.totalPoints >= 1000) badgesToGive.push('master');
      if (user.gamification.currentStreak >= 3) badgesToGive.push('streak');

      for (const badgeId of badgesToGive) {
        await prisma.userBadge.create({
          data: {
            userId: user.id,
            badgeId: badgeId,
            unlockedAt: new Date()
          }
        });
      }
    }
  }
  console.log(`Berhasil memindahkan ${DUMMY_USERS.length} user ke Neon Database!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
