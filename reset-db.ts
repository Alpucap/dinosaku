import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Wiping gamification data...");
  await prisma.activityHistory.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.gamification.deleteMany();
  await prisma.assignment.deleteMany();
  console.log("Database reset complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
