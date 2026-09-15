'use client';

import { Flame, Medal, Zap } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

export default function LearningStats() {
  const { ready, points, streak, energy } = useProgress();
  
  const handleResetEnergy = () => {
    const raw = localStorage.getItem('dinosaku_progress_v1');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        parsed.energy = { day: '', reservations: [] };
        localStorage.setItem('dinosaku_progress_v1', JSON.stringify(parsed));
        window.dispatchEvent(new Event('storage'));
        location.reload();
      } catch (e) {}
    }
  };

  return <div className="learning-stats" aria-label="Ringkasan progres">
    <div><span className="stat-icon"><Medal size={21} /></span><span><strong>{ready ? points : '...'}</strong><small>Poin terkumpul</small></span></div>
    <div><span className="stat-icon stat-icon-warm"><Flame size={21} /></span><span><strong>{ready ? streak : '...'} hari</strong><small>Streak belajar</small></span></div>
    <div onDoubleClick={handleResetEnergy} title="Klik 2x untuk cheat reset energi (Developer)" className="cursor-pointer hover:bg-surface-soft transition-colors rounded-xl p-1 -m-1"><span className="stat-icon"><Zap size={21} /></span><span><strong>{ready ? energy : '...'}</strong><small>Energi bulan ini</small></span></div>
  </div>;
}
