import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const charlotte = await prisma.user.findFirst({
    where: { fullName: { contains: "Charlotte" } },
    include: { gamification: true, activities: true }
  });
  console.log(JSON.stringify(charlotte, null, 2));
}
main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
