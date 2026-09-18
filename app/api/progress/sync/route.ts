import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { totalPoints, badges, currentStreak, recentActivity } = await req.json();

    let gamification = await prisma.gamification.findUnique({ where: { userId: user.id } });
    if (!gamification) {
      gamification = await prisma.gamification.create({
        data: { userId: user.id, totalPoints, currentStreak: currentStreak || 0 }
      });
    } else {
      let nextPoints = gamification.totalPoints;
      if (recentActivity?.pointsEarned) {
        nextPoints += recentActivity.pointsEarned;
      } else {
        nextPoints = Math.max(gamification.totalPoints, totalPoints);
      }
      
      await prisma.gamification.update({
        where: { userId: user.id },
        data: { 
          totalPoints: nextPoints, 
          currentStreak: Math.max(gamification.currentStreak, currentStreak || 0) 
        }
      });
    }

    if (badges && Array.isArray(badges)) {
      await prisma.userBadge.deleteMany({ where: { userId: user.id } });
      for (const badgeId of badges) {
        const existingBadge = await prisma.badge.findUnique({ where: { id: badgeId } });
        if (!existingBadge) {
          await prisma.badge.create({
            data: { id: badgeId, icon: "⭐", title: badgeId, description: "Lencana pencapaian" }
          });
        }
        await prisma.userBadge.create({
          data: { userId: user.id, badgeId: badgeId, unlockedAt: new Date() }
        });
      }
    }

    if (recentActivity) {
      await prisma.activityHistory.create({
        data: {
          userId: user.id,
          type: recentActivity.type,
          title: recentActivity.title,
          score: recentActivity.score,
          pointsEarned: recentActivity.pointsEarned
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing progress:', error);
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}
