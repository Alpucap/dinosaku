'use client';

import { Flame, Medal, Zap } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

export default function LearningStats() {
  const { ready, points, streak, energy } = useProgress();

  return (
    <div className="learning-stats" aria-label="Ringkasan progres">
      <div>
        <span className="stat-icon">
          <Medal size={21} />
        </span>
        <span>
          <strong>{ready ? points : '...'}</strong>
          <small>Poin terkumpul</small>
        </span>
      </div>
      <div>
        <span className="stat-icon stat-icon-warm">
          <Flame size={21} />
        </span>
        <span>
          <strong>{ready ? streak : '...'} hari</strong>
          <small>Streak belajar</small>
        </span>
      </div>
      <div>
        <span className="stat-icon">
          <Zap size={21} />
        </span>
        <span>
          <strong>{ready ? energy : '...'}</strong>
          <small>Energi bulan ini</small>
        </span>
      </div>
    </div>
  );
}
