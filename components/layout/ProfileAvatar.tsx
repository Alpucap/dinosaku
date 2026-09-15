import Link from "next/link";
import { cn } from "@/lib/utils";

export type ProfileUser = {
  fullName: string;
  avatarUrl?: string;
  gamification?: {
    totalPoints?: number;
    energy?: number;
  };
};

interface ProfileAvatarProps {
  user: ProfileUser;
  className?: string;
}

/**
 * Sengaja memakai <img>, bukan next/image: sebagian avatar berasal dari
 * dicebear dan host itu belum terdaftar di images.remotePatterns.
 */
export function ProfileAvatar({ user, className }: ProfileAvatarProps) {
  const initial = user.fullName.trim().slice(0, 1).toUpperCase() || "?";

  return (
    <Link
      href="/profile"
      title={user.fullName}
      aria-label={`Profil ${user.fullName}`}
      className={cn(
        "shrink-0 rounded-full ring-2 ring-border transition-all hover:ring-brand-primary",
        className,
      )}
    >
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt=""
          aria-hidden
          className="h-9 w-9 rounded-full object-cover bg-surface-soft"
        />
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
          {initial}
        </span>
      )}
    </Link>
  );
}
