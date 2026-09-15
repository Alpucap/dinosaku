import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const teacher = await prisma.user.findFirst({
    where: { role: 'TEACHER', classCode: 'DINO-4A' }
  })
  console.log(teacher)
}
main()
