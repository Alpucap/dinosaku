import { Flame, Footprints, LockKeyhole, Star, Medal, Crown, Coins } from 'lucide-react';

const icons = { 
  first: Footprints, 
  perfect: Star, 
  veteran: Medal, 
  master: Crown, 
  rich: Coins, 
  streak: Flame 
};

export default function BadgeMedal({ id, unlocked }: { id: string; unlocked: boolean }) {
  const Icon = icons[id as keyof typeof icons] ?? Star;
  return <div aria-hidden="true" className={`badge-medal ${unlocked ? 'badge-medal-earned' : ''}`}>
    <Icon size={34} strokeWidth={1.8} />
    {!unlocked && <span className="medal-lock"><LockKeyhole size={12} /></span>}
  </div>;
}
