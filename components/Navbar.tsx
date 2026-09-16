import Image from "next/image";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileAvatar } from "@/components/layout/ProfileAvatar";

export default async function Navbar() {
  const user = await getSessionUser();

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 md:top-6">
      <div
        className={`mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-surface/60 bg-surface/70 pl-5 shadow-card backdrop-blur-xl sm:pl-7 ${
          user ? "pr-5 sm:pr-7" : "pr-2"
        }`}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/dinosaku.svg"
            alt="Dinosaku Logo"
            width={140}
            height={48}
            className="w-28 md:w-[132px] object-contain"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-label text-secondary">
          {user ? (
            <Link 
              href={user.role === 'children' ? '/learn' : user.role === 'admin' ? '/admin' : '/pembimbing'} 
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link href="/learn" className="hover:text-primary transition-colors">Learn</Link>
          )}
          <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        {user ? (
          <ProfileAvatar
            user={{ fullName: user.fullName, avatarUrl: user.avatarUrl, role: user.role }}
          />
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-label font-semibold text-secondary hover:text-primary transition-colors hidden sm:block"
            >
              Masuk
            </Link>
            <Link
              href="/subscribe"
              className="button-primary rounded-full px-5 py-2.5 text-sm"
            >
              Berlangganan
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
