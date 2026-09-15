import Link from 'next/link';
import { Trophy, Users } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';

import { DUMMY_SCHOOLS } from '@/lib/data/dummy-schools';

export default async function LeaderboardPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'children') {
    redirect('/login');
  }

  // 1. Ambil Leaderboard Global (Top 10)
  const globalGamifications = await prisma.gamification.findMany({
    where: { user: { role: 'CHILDREN' } },
    orderBy: { totalPoints: 'desc' },
    take: 10,
    include: { user: { select: { id: true, fullName: true, classCode: true, avatarUrl: true } } }
  });

  // 2. Ambil Leaderboard Sekolah/Kelas jika anak punya classCode
  let classGamifications: any[] = [];
  let schoolName = 'Sekolah';
  
  if (user.classCode) {
    // Cari guru yang memiliki classCode yang sama
    const teacher = await prisma.user.findFirst({
      where: { role: 'TEACHER', classCode: user.classCode }
    });
    
    const schoolIdToUse = user.schoolId || teacher?.schoolId;
    
    if (schoolIdToUse) {
      const school = DUMMY_SCHOOLS.find(s => s.id === schoolIdToUse);
      if (school) schoolName = school.name;
    }

    classGamifications = await prisma.gamification.findMany({
      where: { user: { classCode: user.classCode, role: 'CHILDREN' } },
      orderBy: { totalPoints: 'desc' },
      take: 10,
      include: { user: { select: { id: true, fullName: true, avatarUrl: true } } }
    });
  }

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Belajar bersama, tumbuh bersama</p>
        <h1>Papan peringkat</h1>
        <p>Rayakan usaha setiap petualang dari seluruh dunia dan di sekolahmu.</p>
      </header>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* LEADERBOARD GLOBAL */}
        <section className="leaderboard-sheet" aria-label="Peringkat Global">
          <div className="leaderboard-title">
            <Trophy size={28} className="text-brand-accent" />
            <div>
              <h2>Global (Top 10)</h2>
              <p>Petualang terbaik dari seluruh dunia.</p>
            </div>
          </div>
          <ol className="ranking-list">
            {globalGamifications.map((entry, index) => {
              const points = entry.totalPoints;
              const rank = index + 1;
              const isCurrentUser = entry.user.id === user.id;
              let rankClass = '';
              if (points > 0) {
                if (rank === 1) rankClass = 'rank-first';
                else if (rank === 2) rankClass = 'rank-second';
                else if (rank === 3) rankClass = 'rank-third';
              }
              
              return (
                <li key={entry.id} className={isCurrentUser ? 'ranking-current' : ''}>
                  <span className={`rank-number ${rankClass}`}>{rank}</span>
                  {entry.user.avatarUrl ? (
                    <img src={entry.user.avatarUrl} alt="" aria-hidden className="w-10 h-10 rounded-full border border-border" />
                  ) : (
                    <span className={`profile-avatar avatar-${index % 3}`} aria-hidden="true">
                      {entry.user.fullName.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <strong className="break-words">{entry.user.fullName}</strong>
                    {isCurrentUser && <span className="ml-2 text-xs text-secondary">Kamu</span>}
                    <small className="block text-secondary">
                      Streak: {entry.currentStreak} hari
                    </small>
                  </div>
                  <div className="text-right">
                    <strong className="text-xl text-brand-primary">{points}</strong>
                    <small className="block text-secondary">poin</small>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* LEADERBOARD KELAS/SEKOLAH */}
        {user.classCode && (
          <section className="leaderboard-sheet" aria-label="Peringkat Sekolah">
            <div className="leaderboard-title">
              <Users size={28} className="text-brand-primary" />
              <div>
                <h2>{schoolName} - Kelas {user.classCode}</h2>
                <p>Bersaing secara sehat dengan teman sekelasmu.</p>
              </div>
            </div>
            <ol className="ranking-list">
              {classGamifications.map((entry, index) => {
                const points = entry.totalPoints;
                const rank = index + 1;
                const isCurrentUser = entry.user.id === user.id;
                
                let rankClass = '';
                if (points > 0) {
                  if (rank === 1) rankClass = 'rank-first';
                  else if (rank === 2) rankClass = 'rank-second';
                  else if (rank === 3) rankClass = 'rank-third';
                }
                
                return (
                  <li key={entry.id} className={isCurrentUser ? 'ranking-current' : ''}>
                    <span className={`rank-number ${rankClass}`}>{rank}</span>
                    {entry.user.avatarUrl ? (
                      <img src={entry.user.avatarUrl} alt="" aria-hidden className="w-10 h-10 rounded-full border border-border" />
                    ) : (
                      <span className={`profile-avatar avatar-${index % 3}`} aria-hidden="true">
                        {entry.user.fullName.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <strong className="break-words">{entry.user.fullName}</strong>
                      {isCurrentUser && <span className="ml-2 text-xs text-secondary">Kamu</span>}
                      <small className="block text-secondary">
                        Streak: {entry.currentStreak} hari
                      </small>
                    </div>
                    <div className="text-right">
                      <strong className="text-xl text-brand-primary">{points}</strong>
                      <small className="block text-secondary">poin</small>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>

    </div>
  );
}
