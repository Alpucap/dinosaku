'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, LockKeyhole, Play, Flag } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';
import LearningStats from '@/components/dino/LearningStats';
import ChildBadges from '@/components/dino/ChildBadges';
import AdventureWelcome from '@/components/dino/AdventureWelcome';

export default function StoriesLibraryPage() {
  const { profile, ready } = useProgress();
  const reduceMotion = useReducedMotion();
  const [presetStories, setPresetStories] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function syncProgressOnLoad() {
      if (!ready) return;
      try {
        const { getPoints, getBadges, getStreak, readProgress } = await import('@/lib/progress');
        const state = readProgress();
        const profile = state.profiles.find(p => p.id === state.activeProfileId);
        if (profile) {
          await fetch('/api/progress/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              totalPoints: getPoints(profile),
              badges: getBadges(profile),
              currentStreak: getStreak(profile.studyDays)
            })
          });
        }
      } catch(e) {}
    }
    
    syncProgressOnLoad();
  }, [ready]);

  useEffect(() => {
    async function loadData() {
      try {
        const [storiesRes, assignRes] = await Promise.all([
          fetch('/api/stories/preset'),
          fetch('/api/assignments')
        ]);
        
        const storiesData = await storiesRes.json();
        if (storiesData.stories) setPresetStories(storiesData.stories);
        if (storiesData.isPremium) setIsPremium(true);

        const assignData = await assignRes.json();
        if (assignData.assignments) setAssignments(assignData.assignments);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    async function pollAssignments() {
      try {
        const res = await fetch('/api/assignments');
        const data = await res.json();
        if (data.assignments) {
          // Hanya update state jika ada perubahan agar tidak re-render terus
          setAssignments(prev => JSON.stringify(prev) !== JSON.stringify(data.assignments) ? data.assignments : prev);
        }
      } catch (e) {
        // Abaikan error polling senyap
      }
    }

    loadData();
    


    // Auto-refresh misi setiap 5 detik
    const interval = setInterval(pollAssignments, 5000);
    return () => clearInterval(interval);
  }, []);

  const completed = presetStories.filter(story => profile.completedStories.includes(story.id)).length;
  const next = presetStories.find(story => !profile.completedStories.includes(story.id));
  
  return <div className="learning-page">
    <AdventureWelcome
      name={profile.name}
      ctaHref={next ? `/learn/stories/${next.id}` : '/learn/badges'}
      ctaLabel={completed === 0 ? 'Mulai petualangan' : next ? 'Lanjutkan petualangan' : 'Lihat pencapaianku'}
    />

    {assignments.length > 0 && (
      <section className="mt-8 mb-8 rounded-xl border-2 border-brand-primary bg-brand-primary/5 p-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-primary flex items-center gap-2">
              <Flag size={20} /> Misi Khusus dari {assignments[0].assigner?.fullName || 'Guru/Ortu'}
            </h2>
            <p className="mt-1 text-sm text-text-primary">
              Ada tugas cerita berjudul <strong>{assignments[0].topic}</strong> yang harus kamu selesaikan!
            </p>
          </div>
          <Link href={assignments[0].storyId ? `/learn/stories/${assignments[0].storyId}?assignmentId=${assignments[0].id}` : `/learn/create?topic=${encodeURIComponent(assignments[0].topic)}&theme=${encodeURIComponent(assignments[0].theme)}&assignmentId=${assignments[0].id}`} className="button-primary shrink-0 px-5 py-2.5 shadow-sm">
            Mulai Misi Khusus
          </Link>
        </div>
      </section>
    )}

    <LearningStats />
    <ChildBadges />
    <section aria-labelledby="adventure-map-heading">
      <div className="section-heading"><div><p className="eyebrow">Bab 01 · Kenalan dengan uang</p><h2 id="adventure-map-heading">Peta petualanganmu</h2></div><span>{completed} / {presetStories.length} selesai</span></div>
      <progress className="learning-progress mb-8" value={completed} max={Math.max(1, presetStories.length)} aria-label="Cerita selesai" />
      {(!ready || isLoading) ? (
        <div role="status" className="flex flex-col items-center gap-3 py-12 text-secondary">
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -14, 0], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image src="/mascot/dino.png" alt="" aria-hidden width={72} height={72} />
          </motion.div>
          <p>Membuka peta petualangan...</p>
        </div>
      ) : presetStories.length === 0 ? <p role="status">Cerita baru sedang disiapkan. Coba buat cerita sendiri dulu, ya!</p> : <ol className="adventure-path">{presetStories.map((story, index) => {
        const done = profile.completedStories.includes(story.id);
        const isPaywalled = !isPremium && index >= 2;
        const unlocked = (index === 0 || profile.completedStories.includes(presetStories[index - 1].id)) && !isPaywalled;
        const result = profile.results.find(r => r.storyId === story.id);
        const isCurrent = unlocked && !done;
        return <motion.li
          key={story.id}
          className={`adventure-stop ${done ? 'stop-done' : unlocked ? 'stop-current' : 'stop-locked'}`}
          initial={reduceMotion ? false : { opacity: 0, y: 40, x: index % 2 ? 28 : -28 }}
          whileInView={{ opacity: 1, y: 0, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ type: 'spring', stiffness: 110, damping: 17, delay: Math.min(index, 3) * 0.12 }}
        >
          <motion.span
            className={`path-checkpoint ${isCurrent ? 'checkpoint-beacon' : ''}`}
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 12, delay: Math.min(index, 3) * 0.12 + 0.25 }}
          >
            {done ? <Check size={23} /> : unlocked ? index + 1 : <LockKeyhole size={21} />}
          </motion.span>
          <motion.article
            className="story-stop-card"
            whileHover={unlocked && !reduceMotion ? { y: -5 } : undefined}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={`story-scene ${index % 2 ? 'scene-forest' : 'scene-space'}`} aria-hidden="true"><span className="scene-orbit" /><span className="scene-world" /><Image src="/mascot/dino.png" alt="" width={130} height={130} /><span className="scene-label">{story.themeLabel || (index % 2 ? 'Hutan Ajaib' : 'Luar Angkasa')}</span></div>
            <div className="story-stop-copy"><p className="eyebrow">Misi 0{index + 1} · {story.quiz?.length || 0} pertanyaan</p><h3>{story.title}</h3><p>{story.description}</p>
              {unlocked ? <><Link href={`/learn/stories/${story.id}`} className={`mt-4 w-full px-4 py-3 ${done ? 'button-secondary' : 'button-primary'}`}><Play size={17} />{done ? 'Mainkan lagi' : 'Mainkan'}</Link>{result && <p className="mt-3 text-sm text-brand-primary">Nilai terbaik: {result.score} / {result.total}</p>}</> : 
               isPaywalled ? <div className="locked-message bg-brand-accent-soft text-brand-accent-strong border border-brand-accent-soft rounded-lg p-3 flex gap-2 text-sm mt-3"><LockKeyhole size={16} className="shrink-0 mt-0.5" /><span>Berlangganan Premium untuk membuka misi ini dan misi selanjutnya!</span></div> :
               <div className="locked-message"><LockKeyhole size={16} className="shrink-0" /><span>Selesaikan misi sebelumnya untuk membuka.</span></div>}
            </div>
          </motion.article>
        </motion.li>;
      })}<motion.li
        className="path-finish"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
      ><Flag size={22} aria-hidden="true" /><span>{completed === presetStories.length ? 'Semua misi selesai. Hebat, petualang!' : 'Selangkah demi selangkah, kamu pasti bisa.'}</span></motion.li></ol>}
    </section>
  </div>;
}
