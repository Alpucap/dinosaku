'use client';

import Link from 'next/link';
import { Trophy } from 'lucide-react';
import { getPoints, getStreak } from '@/lib/progress';
import { useProgress } from '@/lib/use-progress';

export default function LeaderboardPage() {
  const { data, profile, day, ready } = useProgress();
  const ranked = [...data.profiles].sort((a, b) => getPoints(b) - getPoints(a) || a.name.localeCompare(b.name, 'id'));

  return <div className="learning-page">
    <header className="page-heading"><p className="eyebrow">Belajar bersama, tumbuh bersama</p><h1>Papan peringkat</h1><p>Rayakan usaha setiap petualang. Peringkat ini hanya berisi profil di browser yang sama.</p></header>
    <section className="leaderboard-sheet" aria-label="Peringkat lokal">
      <div className="leaderboard-title"><Trophy size={28} /><div><h2>Petualang di perangkat ini</h2><p>Nilai terbaik tiap cerita dijumlahkan menjadi poin. Nilai sama mendapat peringkat sama.</p></div></div>
      {!ready ? <p role="status" className="p-6">Menghitung peringkat...</p> : <ol className="ranking-list">{ranked.map((entry, index) => {
        const points = getPoints(entry);
        const rank = ranked.findIndex(p => getPoints(p) === points) + 1;
        return <li key={entry.id} className={entry.id === profile.id ? 'ranking-current' : ''}>
          <span className={`rank-number ${rank === 1 && points > 0 ? 'rank-first' : ''}`}>{rank}</span>
          <span className={`profile-avatar avatar-${index % 3}`} aria-hidden="true">{entry.name.slice(0, 1).toUpperCase()}</span>
          <div className="min-w-0 flex-1"><strong className="break-words">{entry.name}</strong>{entry.id === profile.id && <span className="ml-2 text-xs text-secondary">Kamu</span>}<small className="block text-secondary">{entry.results.length} kuis · {day ? getStreak(entry.studyDays, day) : 0} hari streak</small></div>
          <div className="text-right"><strong className="text-xl text-brand-primary">{points}</strong><small className="block text-secondary">poin</small></div>
        </li>;
      })}</ol>}
      {data.profiles.every(p => !p.results.length) && <div className="ranking-empty"><p>Belum ada kuis yang selesai. Petualangan pertamamu menunggu!</p><Link href="/learn" className="button-primary mt-3 px-5 py-3">Mulai kumpulkan poin</Link></div>}
    </section>
  </div>;
}
