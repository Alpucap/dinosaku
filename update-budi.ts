import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.user.updateMany({
    where: { email: 'ortu@dinosaku.com' },
    data: { plan: 'PREMIUM' }
  });
  console.log("Updated Budi Santoso (ortu@dinosaku.com) to PREMIUM");
}

main().catch(console.error).finally(() => prisma.$disconnect());
