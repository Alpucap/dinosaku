'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Map, Medal, Trophy, Flame, ChevronRight } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

const links = [
  { href: '/learn/stories', label: 'Petualangan', icon: Map },
  { href: '/learn', label: 'Buat Cerita', icon: BookOpen },
  { href: '/learn/badges', label: 'Lencana', icon: Medal },
  { href: '/learn/leaderboard', label: 'Peringkat', icon: Trophy },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, ready, streak } = useProgress();
  return <aside className="learning-sidebar" data-ready={ready}>
    <a href="#learning-content" className="skip-link">Lewati ke isi</a>
    <div className="sidebar-brand"><Link href="/" aria-label="Dinosaku, beranda"><Image src="/logo/dinosaku.svg" alt="Dinosaku" width={144} height={48} priority /></Link><span className="hidden md:block text-sm text-secondary">Kecil langkahnya. Besar mimpinya.</span></div>
    <nav aria-label="Navigasi belajar" className="learning-nav">{links.map(({ href, label, icon: Icon }) => {
      const active = href === '/learn' ? pathname === href : pathname.startsWith(href);
      return <Link key={href} href={href} aria-current={active ? 'page' : undefined} className={active ? 'is-active' : ''}><Icon size={21} aria-hidden="true" /><span>{label}</span>{active && <span className="nav-active-dot" aria-hidden="true" />}</Link>;
    })}</nav>
    <div className="sidebar-bottom">
      <div className="streak-note"><Flame size={25} aria-hidden="true" /><div><strong>{ready ? streak : 0} hari berturut-turut</strong><p>{streak ? 'Satu kuis hari ini, jaga semangatmu!' : 'Mulai dari satu kuis hari ini.'}</p></div></div>
      <Link href="/learn/leaderboard#profiles" className="profile-link"><span className="profile-avatar" aria-hidden="true">{profile.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0 flex-1"><strong className="block truncate">{profile.name}</strong><small>Profil di perangkat ini</small></span><ChevronRight size={18} /></Link>
    </div>
  </aside>;
}
