import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const children = await prisma.user.findMany({
    where: { role: 'CHILDREN' }
  });

  console.log(`Found ${children.length} children. Seeding activities...`);

  for (const child of children) {
    // Generate activities for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (Math.random() > 0.2) {
        // Random score: 0 to 3 out of 3 questions
        const score = Math.floor(Math.random() * 4); // 0, 1, 2, or 3
        const quizPoints = Math.round((score / 3) * 8);
        const pointsEarned = 2 + quizPoints; // 2 for reading, up to 8 for quiz

        await prisma.activityHistory.create({
          data: {
            userId: child.id,
            type: 'QUIZ_COMPLETED',
            title: `Misi Harian ${i+1}`,
            score: Math.floor((score / 3) * 100), // percentage
            pointsEarned: pointsEarned, // 2 to 10 points
            createdAt: date
          }
        });
      }
    }
    
    // Create random gamification baseline points so they have badges etc
    await prisma.gamification.create({
      data: {
        userId: child.id,
        totalPoints: Math.floor(Math.random() * 50) + 10,
        currentStreak: Math.floor(Math.random() * 5)
      }
    });
  }
  
  console.log("Seeding complete with new point rules!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
