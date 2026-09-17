'use client';
import { Trophy, Medal, Star, LockKeyhole } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

export default function ChildBadges() {
  const { ready, points, streak } = useProgress();

  if (!ready) return null;

  // Logika sederhana penentuan badge berdasar poin & streak simulasi
  const hasWeeklyTop1 = points > 100;
  const hasMonthlyTop1 = points > 500;
  const hasSuperReader = streak >= 3;

  return (
    <div className="mb-10">
      <h3 className="font-heading text-lg font-bold text-primary mb-3">Lencana Prestasimu</h3>
      <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Lencana Mingguan */}
        <div className={`snap-start shrink-0 min-w-[220px] rounded-2xl p-4 flex flex-col gap-3 border shadow-sm transition-all ${
          hasWeeklyTop1 
            ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200" 
            : "bg-surface-soft border-border-light opacity-60 grayscale"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full shadow-inner ${hasWeeklyTop1 ? 'bg-amber-400 text-white' : 'bg-surface text-secondary'}`}>
              <Trophy size={20} />
            </div>
            <div>
              <p className={`font-bold leading-tight ${hasWeeklyTop1 ? 'text-amber-900' : 'text-secondary'}`}>Juara Mingguan</p>
              <p className={`text-[0.65rem] font-bold uppercase mt-0.5 tracking-wider ${hasWeeklyTop1 ? 'text-amber-700/80' : 'text-muted'}`}>Top 1 Global In a Week</p>
            </div>
          </div>
          {!hasWeeklyTop1 && (
            <p className="text-xs text-muted flex items-center gap-1 font-medium"><LockKeyhole size={12}/> Kumpulkan 100 poin</p>
          )}
        </div>

        {/* Lencana Bulanan */}
        <div className={`snap-start shrink-0 min-w-[220px] rounded-2xl p-4 flex flex-col gap-3 border shadow-sm transition-all ${
          hasMonthlyTop1 
            ? "bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 border-brand-primary/30" 
            : "bg-surface-soft border-border-light opacity-60 grayscale"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full shadow-inner ${hasMonthlyTop1 ? 'bg-brand-primary text-white' : 'bg-surface text-secondary'}`}>
              <Medal size={20} />
            </div>
            <div>
              <p className={`font-bold leading-tight ${hasMonthlyTop1 ? 'text-brand-primary' : 'text-secondary'}`}>Juara Bulanan</p>
              <p className={`text-[0.65rem] font-bold uppercase mt-0.5 tracking-wider ${hasMonthlyTop1 ? 'text-brand-primary/80' : 'text-muted'}`}>Top 1 Global In a Month</p>
            </div>
          </div>
          {!hasMonthlyTop1 && (
            <p className="text-xs text-muted flex items-center gap-1 font-medium"><LockKeyhole size={12}/> Kumpulkan 500 poin</p>
          )}
        </div>
        
        {/* Lencana Super Reader */}
        <div className={`snap-start shrink-0 min-w-[220px] rounded-2xl p-4 flex flex-col gap-3 border shadow-sm transition-all ${
          hasSuperReader 
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
            : "bg-surface-soft border-border-light opacity-60 grayscale"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full shadow-inner ${hasSuperReader ? 'bg-blue-400 text-white' : 'bg-surface text-secondary'}`}>
              <Star size={20} />
            </div>
            <div>
              <p className={`font-bold leading-tight ${hasSuperReader ? 'text-blue-900' : 'text-secondary'}`}>Kutu Buku</p>
              <p className={`text-[0.65rem] font-bold uppercase mt-0.5 tracking-wider ${hasSuperReader ? 'text-blue-700/80' : 'text-muted'}`}>Super Reader</p>
            </div>
          </div>
          {!hasSuperReader && (
            <p className="text-xs text-muted flex items-center gap-1 font-medium"><LockKeyhole size={12}/> 3 Hari Streak Baca</p>
          )}
        </div>

      </div>
    </div>
  );
}
