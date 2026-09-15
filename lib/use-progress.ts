'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { getBadges, getEnergy, getPoints, getStreak, parseProgress, progressSnapshot, subscribeProgress, type Progress } from './progress';

export function useProgress() {
  const snapshot = useSyncExternalStore(subscribeProgress, progressSnapshot, () => null);
  return useMemo(() => {
    const parsed: { data: Progress; day: string; storageUnavailable: boolean } = snapshot ? JSON.parse(snapshot) : { data: parseProgress(null), day: '', storageUnavailable: false };
    const profile = parsed.data.profiles.find(p => p.id === parsed.data.activeProfileId)!;
    return {
      ...parsed, profile, ready: snapshot !== null,
      points: getPoints(profile), badges: getBadges(profile),
      streak: parsed.day ? getStreak(profile.studyDays, parsed.day) : 0,
      energy: getEnergy(parsed.data, parsed.day),
    };
  }, [snapshot]);
}
