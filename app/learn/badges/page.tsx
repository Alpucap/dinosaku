import Link from 'next/link';
import { Check, LockKeyhole } from 'lucide-react';
import { BADGES } from '@/lib/progress';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import BadgeMedal from '@/components/dino/BadgeMedal';
import LearningStats from '@/components/dino/LearningStats';

export default async function BadgesPage() {
  const user = await getSessionUser();
  if (!user || user.role !== 'children') redirect('/login');

  const userBadges = await prisma.userBadge.findMany({
    where: { userId: user.id }
  });
  const earnedBadgeIds = userBadges.map(ub => ub.badgeId);

  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Buku pencapaian {user.fullName}</p>
        <h1>Kecil usahanya, berharga hasilnya.</h1>
        <p>Setiap lencana menyimpan cerita tentang hal baru yang kamu pelajari.</p>
      </header>
      
      <LearningStats />
      
      <div className="section-heading">
        <h2>Koleksi lencana</h2>
        <span>{earnedBadgeIds.length} dari {BADGES.length} terbuka</span>
      </div>
      
      <div className="badge-collection">
        {BADGES.map((badge, index) => {
          const earned = earnedBadgeIds.includes(badge.id);
          return (
            <article key={badge.id} className={`badge-card ${earned ? 'badge-card-earned' : ''}`}>
              <span className="badge-number">0{index + 1}</span>
              <BadgeMedal id={badge.id} unlocked={earned} />
              <h2>{badge.name}</h2>
              <p>{badge.description}</p>
              <span className="badge-status">
                {earned ? (
                  <><Check size={16} /> Sudah diraih</>
                ) : (
                  <><LockKeyhole size={14} /> Belum terbuka</>
                )}
              </span>
            </article>
          );
        })}
      </div>
      
      <div className="learning-callout">
        <div>
          <h2>Satu cerita, satu kesempatan baru.</h2>
          <p>Ulangi kuis untuk memperbaiki nilaimu. Skor terbaikmu tetap tersimpan.</p>
        </div>
        <Link href="/learn" className="button-primary px-6 py-3">Buka peta petualangan</Link>
      </div>
    </div>
  );
}
