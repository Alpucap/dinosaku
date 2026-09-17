import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { UserStatus, SubscriptionPlan, UserBadge, User as BaseUser } from "@/lib/data/dummy-users";

export const SESSION_COOKIE = "dinosaku_session";

// Temporary shim to keep compatibility with existing dummy types
export async function getSessionUser(): Promise<any | null> {
  const store = await cookies();
  const sessionId = store.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: sessionId },
      include: {
        gamification: true,
        joinedClasses: { include: { teacher: { select: { id: true, fullName: true } } } },
        ownedClasses: true,
        userBadges: {
          include: { badge: true }
        }
      }
    });

    if (!user) return null;

    // Convert to the shape expected by the frontend UI (similar to DUMMY_USERS)
    const formattedBadges = user.userBadges.map(ub => ({
      id: ub.badge.id,
      icon: ub.badge.icon,
      title: ub.badge.title,
      description: ub.badge.description,
      unlocked: true
    }));

    return {
      id: user.id,
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      username: user.username,
      role: user.role.toLowerCase(),
      avatarUrl: user.avatarUrl || undefined,
      status: user.status.toLowerCase() as UserStatus,
      plan: user.plan ? user.plan.toLowerCase() as SubscriptionPlan : undefined,
      classCode: undefined, // deprecated
      joinedClasses: user.joinedClasses || [],
      ownedClasses: user.ownedClasses || [],
      createdAt: user.createdAt.toISOString(),
      parentId: user.parentId || undefined,
      schoolId: user.schoolId || undefined,
      preferences: {
        notificationsEnabled: user.notificationsEnabled
      },
      gamification: user.gamification ? {
        totalPoints: user.gamification.totalPoints,
        currentStreak: user.gamification.currentStreak,
        energy: user.gamification.energy,
        maxEnergy: user.gamification.maxEnergy || 1,
        totalBadges: formattedBadges.length,
        badges: formattedBadges
      } : undefined
    };
  } catch (err) {
    console.error("Error fetching user for session:", err);
    return null;
  }
}
