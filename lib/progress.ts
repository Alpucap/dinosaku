export const PROGRESS_KEY = 'dinosaku_progress_v1';
export const DAILY_ENERGY = 3;
export type QuizResult = { storyId: string; score: number; total: number };
export type Profile = { id: string; name: string; completedStories: string[]; results: QuizResult[]; studyDays: string[] };
export type Progress = {
  version: 1;
  activeProfileId: string;
  profiles: Profile[];
  energy: { day: string; reservations: string[] };
};

export const BADGES = [
  { id: 'first', name: 'Langkah Pertama', description: 'Selesaikan kuis pertamamu.' },
  { id: 'perfect', name: 'Bintang Kuis', description: 'Jawab semua soal dengan benar dalam satu kuis.' },
  { id: 'saving', name: 'Penabung Ulung', description: 'Raih nilai sempurna di Misi Menabung di Planet Asing.' },
  { id: 'needs', name: 'Pembeli Cermat', description: 'Raih nilai sempurna di Berburu Harta Karun Hutan.' },
  { id: 'streak', name: 'Rajin Belajar', description: 'Selesaikan kuis selama tiga hari berturut-turut.' },
] as const;

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function previousDay(day: string): string {
  const date = new Date(`${day}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function createProfile(id: string, name: string): Profile {
  return { id, name, completedStories: [], results: [], studyDays: [] };
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length <= 200))] : [];
}

function validResult(value: unknown): value is QuizResult {
  if (!value || typeof value !== 'object') return false;
  const result = value as QuizResult;
  return typeof result.storyId === 'string' && result.storyId.length > 0 && result.storyId.length <= 200 && Number.isInteger(result.score) && Number.isInteger(result.total) && result.total > 0 && result.total <= 100 && result.score >= 0 && result.score <= result.total;
}

export function parseProgress(raw: string | null, legacy: string | null = null): Progress {
  const initial: Progress = { version: 1, activeProfileId: 'default', profiles: [createProfile('default', 'Petualang')], energy: { day: '', reservations: [] } };
  try {
    if (!raw) {
      initial.profiles[0].completedStories = strings(JSON.parse(legacy || '[]'));
      return initial;
    }
    const data = JSON.parse(raw);
    if (data.version !== 1 || !Array.isArray(data.profiles)) return initial;
    const ids = new Set<string>();
    const profiles: Profile[] = data.profiles.filter((p: Profile) => {
      if (!p || typeof p.id !== 'string' || !p.id || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim()) return false;
      ids.add(p.id);
      return true;
    }).slice(0, 8).map((p: Profile) => ({
      id: p.id, name: p.name.trim().slice(0, 24),
      completedStories: strings(p.completedStories),
      results: Array.isArray(p.results) ? p.results.filter(validResult) : [],
      studyDays: strings(p.studyDays).filter(day => /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day)) && new Date(day).toISOString().slice(0, 10) === day),
    }));
    if (!profiles.length) return initial;
    return {
      version: 1, profiles,
      activeProfileId: profiles.some(p => p.id === data.activeProfileId) ? data.activeProfileId : profiles[0].id,
      energy: { day: typeof data.energy?.day === 'string' ? data.energy.day : '', reservations: strings(data.energy?.reservations).slice(0, DAILY_ENERGY) },
    };
  } catch {
    return initial;
  }
}

export function getStreak(days: string[], today = localDay()): number {
  const studied = new Set(days);
  let day = studied.has(today) ? today : previousDay(today);
  let streak = 0;
  while (studied.has(day)) {
    streak++;
    day = previousDay(day);
  }
  return streak;
}

export function getPoints(profile: Profile): number {
  return profile.results.reduce((sum, result) => sum + Math.round(result.score / result.total * 100), 0);
}

export function getBadges(profile: Profile): string[] {
  const perfect = profile.results.filter(r => r.score === r.total);
  return [
    ...(profile.results.length ? ['first'] : []),
    ...(perfect.length ? ['perfect'] : []),
    ...(perfect.some(r => r.storyId === 'menabung-luar-angkasa') ? ['saving'] : []),
    ...(perfect.some(r => r.storyId === 'kebutuhan-hutan-ajaib') ? ['needs'] : []),
    ...(profile.studyDays.some(day => getStreak(profile.studyDays, day) >= 3) ? ['streak'] : []),
  ];
}

export function applyQuizResult(profile: Profile, storyId: string, score: number, total: number, day = localDay()): Profile {
  const result = { storyId, score, total };
  if (!validResult(result)) throw new Error('Hasil kuis tidak valid.');
  const previous = profile.results.find(r => r.storyId === storyId);
  const best = previous && previous.score / previous.total >= score / total ? previous : result;
  return {
    ...profile,
    completedStories: [...new Set([...profile.completedStories, storyId])],
    results: [...profile.results.filter(r => r.storyId !== storyId), best],
    studyDays: [...new Set([...profile.studyDays, day])],
  };
}

export function getEnergy(state: Progress, day = localDay()): number {
  return state.energy.day === day ? Math.max(0, DAILY_ENERGY - state.energy.reservations.length) : DAILY_ENERGY;
}

export function reserveEnergy(state: Progress, id: string, day = localDay()): Progress {
  if (getEnergy(state, day) === 0) throw new Error('Energi hari ini habis. Mainkan koleksi cerita atau coba mode demo, ya!');
  return { ...state, energy: { day, reservations: [...(state.energy.day === day ? state.energy.reservations : []), id] } };
}

export function refundEnergy(state: Progress, id: string): Progress {
  return { ...state, energy: { ...state.energy, reservations: state.energy.reservations.filter(value => value !== id) } };
}

let fallback: string | null = null;
let storageUnavailable = false;
export function readProgress(): Progress {
  if (typeof window === 'undefined') return parseProgress(null);
  try {
    return parseProgress(fallback ?? localStorage.getItem(PROGRESS_KEY), localStorage.getItem('dinosaku_completed_stories'));
  } catch {
    storageUnavailable = true;
    return parseProgress(fallback);
  }
}

export function progressSnapshot(): string {
  return JSON.stringify({ data: readProgress(), day: localDay(), storageUnavailable });
}

export function subscribeProgress(listener: () => void): () => void {
  window.addEventListener('storage', listener);
  window.addEventListener('dinosaku-progress', listener);
  window.addEventListener('focus', listener);
  const timer = window.setInterval(listener, 30_000);
  return () => {
    window.removeEventListener('storage', listener);
    window.removeEventListener('dinosaku-progress', listener);
    window.removeEventListener('focus', listener);
    window.clearInterval(timer);
  };
}

export function updateProgress(update: (state: Progress) => Progress): void {
  const value = JSON.stringify(update(readProgress()));
  try {
    localStorage.setItem(PROGRESS_KEY, value);
    fallback = null;
    storageUnavailable = false;
  } catch {
    fallback = value;
    storageUnavailable = true;
  }
  window.dispatchEvent(new Event('dinosaku-progress'));
}

export function recordQuiz(profileId: string, storyId: string, score: number, total: number): void {
  updateProgress(state => ({ ...state, profiles: state.profiles.map(p => p.id === profileId ? applyQuizResult(p, storyId, score, total) : p) }));
}

export async function takeEnergy(): Promise<string> {
  const id = crypto.randomUUID();
  const reserve = () => updateProgress(state => reserveEnergy(state, id));
  if (navigator.locks) await navigator.locks.request('dinosaku-energy', reserve);
  else reserve();
  return id;
}

export async function returnEnergy(id: string): Promise<void> {
  const refund = () => updateProgress(state => refundEnergy(state, id));
  if (navigator.locks) await navigator.locks.request('dinosaku-energy', refund);
  else refund();
}

export const getCompletedStories = (): string[] => {
  const state = readProgress();
  return state.profiles.find(p => p.id === state.activeProfileId)!.completedStories;
};
