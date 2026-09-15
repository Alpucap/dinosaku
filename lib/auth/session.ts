import { cookies } from "next/headers";
import { DUMMY_USERS, type User, type UserBadge } from "@/lib/data/dummy-users";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "dinosaku_session";

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  
  const dummyUser = DUMMY_USERS.find((u) => u.id === sessionId) ?? null;
  if (!dummyUser) return null;

  try {
    const dbGamification = await prisma.gamification.findUnique({
      where: { userId: dummyUser.id }
    });
    
    const dbUserBadges = await prisma.userBadge.findMany({
      where: { userId: dummyUser.id },
      include: { badge: true }
    });

    if (dbGamification) {
      const realBadges: UserBadge[] = dbUserBadges.map(ub => ({
        id: ub.badge.id,
        icon: ub.badge.icon,
        title: ub.badge.title,
        description: ub.badge.description,
        unlocked: true
      }));

      return {
        ...dummyUser,
        gamification: {
          ...dummyUser.gamification,
          totalPoints: dbGamification.totalPoints,
          currentStreak: dbGamification.currentStreak,
          energy: dbGamification.energy,
          maxEnergy: dbGamification.maxEnergy ?? dummyUser.gamification?.maxEnergy ?? 0,
          totalBadges: dbUserBadges.length,
          badges: realBadges
        }
      };
    }
  } catch (err) {
    console.error("Error fetching gamification for session:", err);
  }

  return dummyUser;
}
