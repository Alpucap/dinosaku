'use client';

import Link from 'next/link';
import { Check, LockKeyhole } from 'lucide-react';
import { BADGES } from '@/lib/progress';
import { useProgress } from '@/lib/use-progress';
import BadgeMedal from '@/components/dino/BadgeMedal';
import LearningStats from '@/components/dino/LearningStats';

export default function BadgesPage() {
  const { profile, badges, ready } = useProgress();
  return <div className="learning-page">
    <header className="page-heading"><p className="eyebrow">Buku pencapaian {profile.name}</p><h1>Kecil usahanya, berharga hasilnya.</h1><p>Setiap lencana menyimpan cerita tentang hal baru yang kamu pelajari.</p></header>
    <LearningStats />
    <div className="section-heading"><h2>Koleksi lencana</h2><span>{badges.length} dari {BADGES.length} terbuka</span></div>
    {!ready ? <p role="status">Membuka koleksimu...</p> : <div className="badge-collection">{BADGES.map((badge, index) => {
      const earned = badges.includes(badge.id);
      return <article key={badge.id} className={`badge-card ${earned ? 'badge-card-earned' : ''}`}><span className="badge-number">0{index + 1}</span><BadgeMedal id={badge.id} unlocked={earned} /><h2>{badge.name}</h2><p>{badge.description}</p><span className="badge-status">{earned ? <><Check size={16} /> Sudah diraih</> : <><LockKeyhole size={14} /> Belum terbuka</>}</span></article>;
    })}</div>}
    <div className="learning-callout"><div><h2>Satu cerita, satu kesempatan baru.</h2><p>Ulangi kuis untuk memperbaiki nilaimu. Skor terbaikmu tetap tersimpan.</p></div><Link href="/learn/stories" className="button-primary px-6 py-3">Buka peta petualangan</Link></div>
  </div>;
}
