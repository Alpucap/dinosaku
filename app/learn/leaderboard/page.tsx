'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Trophy, UserPlus } from 'lucide-react';
import { createProfile, getPoints, getStreak, updateProgress } from '@/lib/progress';
import { useProgress } from '@/lib/use-progress';

export default function LeaderboardPage() {
  const { data, profile, day, ready } = useProgress();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const ranked = [...data.profiles].sort((a, b) => getPoints(b) - getPoints(a) || a.name.localeCompare(b.name, 'id'));

  function saveProfile(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 24) { setMessage('Isi nama panggilan antara 1–24 karakter.'); return; }
    try {
      updateProgress(state => {
        if (state.profiles.some(p => p.name.toLocaleLowerCase('id') === trimmed.toLocaleLowerCase('id') && (!editing || p.id !== state.activeProfileId))) throw new Error('Nama itu sudah dipakai. Coba nama panggilan lain.');
        if (editing) return { ...state, profiles: state.profiles.map(p => p.id === state.activeProfileId ? { ...p, name: trimmed } : p) };
        if (state.profiles.length >= 8) throw new Error('Maksimal delapan profil di perangkat ini.');
        const next = createProfile(crypto.randomUUID(), trimmed);
        return { ...state, activeProfileId: next.id, profiles: [...state.profiles, next] };
      });
      setName(''); setEditing(false); setMessage(`Profil ${trimmed} siap belajar.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Profil belum bisa disimpan.'); }
  }

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
    <section id="profiles" className="profile-section">
      <div className="section-heading"><h2>Siapa yang belajar?</h2><span>{data.profiles.length} / 8 profil</span></div>
      <p className="mb-5 text-secondary">Pakai nama panggilan saja. Setiap profil punya progres sendiri; energi cerita AI dipakai bersama.</p>
      <div className="profile-picker">{data.profiles.map(p => <button key={p.id} aria-pressed={p.id === profile.id} onClick={() => { updateProgress(state => ({ ...state, activeProfileId: p.id })); setEditing(false); setName(''); setMessage(`Sekarang belajar sebagai ${p.name}.`); }}><span className="profile-avatar" aria-hidden="true">{p.name.slice(0, 1).toUpperCase()}</span><span className="min-w-0 break-words">{p.name}</span>{p.id === profile.id && <Check size={18} className="shrink-0" />}</button>)}</div>
      <form onSubmit={saveProfile} className="profile-form">
        <label htmlFor="profile-name">{editing ? `Ubah nama ${profile.name}` : 'Tambahkan petualang'}</label>
        <div className="flex flex-col gap-3 sm:flex-row"><input id="profile-name" className="input min-w-0 flex-1 p-3" value={name} maxLength={24} onChange={event => setName(event.target.value)} placeholder="Nama panggilan" required /><button disabled={!name.trim() || (!editing && data.profiles.length >= 8)} className="button-primary px-5 py-3 disabled:opacity-50"><UserPlus size={18} />{editing ? 'Simpan nama' : 'Tambah profil'}</button></div>
        <button type="button" className="mt-3 min-h-11 text-sm text-brand-primary underline underline-offset-4" onClick={() => { setEditing(!editing); setName(editing ? '' : profile.name); setMessage(''); }}>{editing ? 'Batal ubah nama' : 'Ubah nama profil aktif'}</button>
        <p role="status" className="mt-2 text-sm text-secondary">{message}</p>
      </form>
    </section>
  </div>;
}
