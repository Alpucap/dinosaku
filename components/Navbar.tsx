import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-default bg-surface/80 backdrop-blur-md">
      <div className="container-main flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo/dinosaku.svg" 
            alt="Dinosaku Logo" 
            width={140} 
            height={48} 
            className="object-contain"
            priority
          />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-label text-secondary">
          <Link href="#learn" className="hover:text-primary transition-colors">Learn</Link>
          <Link href="#about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="#contact" className="hover:text-primary transition-colors">Contact</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-label font-semibold text-secondary hover:text-primary transition-colors hidden sm:block">
            Masuk
          </Link>
          <Link href="/subscribe" className="button-primary px-5 py-2.5 text-sm">
            Berlangganan
          </Link>
        </div>
      </div>
    </header>
  );
}
