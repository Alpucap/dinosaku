import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, Trophy, Settings } from 'lucide-react';

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <aside className="w-64 bg-surface border-r border-border flex-shrink-0 flex flex-col">
        <div className="p-6 flex items-center justify-center md:justify-start border-b border-border h-20">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/dinosaku.svg" alt="Dinosaku" className="h-10 object-contain" />
          </Link>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-soft hover:text-brand-primary transition-colors font-medium">
            <Home size={20} /> Beranda
          </Link>
          <Link href="/learn" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-green text-brand-primary font-bold shadow-sm">
            <BookOpen size={20} /> Petualangan Cerita
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-soft hover:text-brand-primary transition-colors font-medium opacity-50 cursor-not-allowed">
            <Trophy size={20} /> Riwayat Kuis
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:bg-surface-soft hover:text-brand-primary transition-colors font-medium opacity-50 cursor-not-allowed">
            <Settings size={20} /> Pengaturan
          </Link>
        </div>

        <div className="p-4 border-t border-border">
          <div className="bg-brand-accent-soft p-4 rounded-xl text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-heading font-bold text-brand-primary mb-2">Pahlawan Finansial!</p>
              <p className="text-sm text-secondary mb-4">Terus belajar kelola uang saku ya!</p>
            </div>
            {/* Mascot peek */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-30">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src="/mascot/dino.png" alt="Dino Mascot" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative h-full">
        {children}
      </main>
    </div>
  );
}
