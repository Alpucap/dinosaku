import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS } from '../lib/data/dummy-users'

const prisma = new PrismaClient()

async function main() {
  console.log(`Mulai memindahkan data dummy ke database Neon...`)
  
  for (const user of DUMMY_USERS) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        username: user.username,
        role: user.role.toUpperCase() as any,
        avatarUrl: user.avatarUrl,
        classCode: user.classCode,
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
      })
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
