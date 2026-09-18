import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'CHILDREN' },
    include: { gamification: true, activities: true }
  });

  for (const user of users) {
    if (!user.gamification) continue;
    
    // Calculate total points earned from activity history
    const historyPoints = user.activities.reduce((sum, act) => sum + (act.pointsEarned || 0), 0);
    
    // For dummy users, they might have a base totalPoints from seed (e.g. 200). 
    // We should ensure gamification.totalPoints is at least the sum of their activities.
    // If their current totalPoints is 0 but they have activities, they got hit by the bug.
    const newTotal = Math.max(user.gamification.totalPoints, historyPoints);
    
    if (user.gamification.totalPoints < historyPoints || user.gamification.totalPoints === 0 && historyPoints > 0) {
       console.log(`Repaired ${user.fullName}: ${user.gamification.totalPoints} -> ${newTotal}`);
       await prisma.gamification.update({
         where: { userId: user.id },
         data: { totalPoints: newTotal }
       });
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
