import { PrismaClient } from '@prisma/client'
import { DUMMY_USERS } from '../lib/data/dummy-users'

const prisma = new PrismaClient()

async function main() {
  console.log(`Mulai memindahkan data dummy ke database Neon...`)
  
  for (const user of DUMMY_USERS) {
    // Upsert agar tidak error kalau script ini dijalankan 2 kali
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        email: user.email,
        password: user.password, // Ingat: Di produksi ini harus di-hash (bcrypt)!
        fullName: user.fullName,
        username: user.username,
        role: user.role.toUpperCase() as any, // Enum role
        avatarUrl: user.avatarUrl,
        classCode: user.classCode,
      }
    })
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
