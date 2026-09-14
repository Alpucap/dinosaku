'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, LockKeyhole, Play, Flag } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';
import LearningStats from '@/components/dino/LearningStats';

export default function StoriesLibraryPage() {
  const { profile, ready } = useProgress();
  const [presetStories, setPresetStories] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [storiesRes, assignRes] = await Promise.all([
          fetch('/api/stories/preset'),
          fetch('/api/assignments')
        ]);
        
        const storiesData = await storiesRes.json();
        if (storiesData.stories) setPresetStories(storiesData.stories);

        const assignData = await assignRes.json();
        if (assignData.assignments) setAssignments(assignData.assignments);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const completed = presetStories.filter(story => profile.completedStories.includes(story.id)).length;
  const next = presetStories.find(story => !profile.completedStories.includes(story.id));
  
  return <div className="learning-page">
    <header className="adventure-welcome">
      <div className="welcome-copy"><p className="eyebrow">Halo, {profile.name}!</p><h1>Petualangan kecil.<br /><span>Bekal untuk masa depan.</span></h1><p>Temani Purba menjelajah, belajar mengelola uang, dan mengisi buku pencapaianmu.</p><Link href={next ? `/learn/stories/${next.id}` : '/learn/badges'} className="button-primary mt-5 px-6 py-3">{completed === 0 ? 'Mulai petualangan' : next ? 'Lanjutkan petualangan' : 'Lihat pencapaianku'}<Play size={17} aria-hidden="true" /></Link></div>
      <div className="welcome-mascot"><span className="mascot-speech">Kita belajar bersama, yuk!</span><Image src="/mascot/dino.png" alt="Purba, teman petualanganmu" width={230} height={230} priority /><span className="mascot-ground" aria-hidden="true" /></div>
    </header>

    {assignments.length > 0 && (
      <section className="mb-8 rounded-xl border-2 border-brand-primary bg-brand-primary/5 p-6 shadow-sm">
        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row justify-between">
          <div>
            <h2 className="font-heading text-lg font-bold text-brand-primary flex items-center gap-2">
              <Flag size={20} /> Misi Khusus dari {assignments[0].assigner?.fullName || 'Guru/Ortu'}
            </h2>
            <p className="mt-1 text-sm text-text-primary">
              Ada tugas petualangan bertema <strong>{assignments[0].theme}</strong> tentang <strong>{assignments[0].topic}</strong> yang harus kamu selesaikan!
            </p>
          </div>
          <Link href={`/learn/create?topic=${encodeURIComponent(assignments[0].topic)}&theme=${encodeURIComponent(assignments[0].theme)}&assignmentId=${assignments[0].id}`} className="button-primary shrink-0 px-5 py-2.5 shadow-sm">
            Mulai Misi Khusus
          </Link>
        </div>
      </section>
    )}

    <LearningStats />
    <section aria-labelledby="adventure-map-heading">
      <div className="section-heading"><div><p className="eyebrow">Bab 01 · Kenalan dengan uang</p><h2 id="adventure-map-heading">Peta petualanganmu</h2></div><span>{completed} / {presetStories.length} selesai</span></div>
      <progress className="learning-progress mb-8" value={completed} max={Math.max(1, presetStories.length)} aria-label="Cerita selesai" />
      {(!ready || isLoading) ? <p role="status" className="py-10">Membuka peta petualangan...</p> : presetStories.length === 0 ? <p role="status">Cerita baru sedang disiapkan. Coba buat cerita sendiri dulu, ya!</p> : <ol className="adventure-path">{presetStories.map((story, index) => {
        const done = profile.completedStories.includes(story.id);
        const unlocked = index === 0 || profile.completedStories.includes(presetStories[index - 1].id);
        const result = profile.results.find(r => r.storyId === story.id);
        return <li key={story.id} className={`adventure-stop ${done ? 'stop-done' : unlocked ? 'stop-current' : 'stop-locked'}`}>
          <span className="path-checkpoint" aria-hidden="true">{done ? <Check size={23} /> : unlocked ? index + 1 : <LockKeyhole size={21} />}</span>
          <article className="story-stop-card">
            <div className={`story-scene ${index % 2 ? 'scene-forest' : 'scene-space'}`} aria-hidden="true"><span className="scene-orbit" /><span className="scene-world" /><Image src="/mascot/dino.png" alt="" width={130} height={130} /><span className="scene-label">{story.themeLabel || (index % 2 ? 'Hutan Ajaib' : 'Luar Angkasa')}</span></div>
            <div className="story-stop-copy"><p className="eyebrow">Misi 0{index + 1} · {story.quiz?.length || 0} pertanyaan</p><h3>{story.title}</h3><p>{story.description}</p>
              {unlocked ? <><Link href={`/learn/stories/${story.id}`} className={`mt-4 w-full px-4 py-3 ${done ? 'button-secondary' : 'button-primary'}`}><Play size={17} />{done ? 'Mainkan lagi' : 'Mainkan'}</Link>{result && <p className="mt-3 text-sm text-brand-primary">Nilai terbaik: {result.score} / {result.total}</p>}</> : <div className="locked-message"><LockKeyhole size={16} className="shrink-0" /><span>Selesaikan misi sebelumnya untuk membuka.</span></div>}
            </div>
          </article>
        </li>;
      })}<li className="path-finish"><Flag size={22} aria-hidden="true" /><span>{completed === presetStories.length ? 'Semua misi selesai. Hebat, petualang!' : 'Selangkah demi selangkah, kamu pasti bisa.'}</span></li></ol>}
    </section>
  </div>;
}
