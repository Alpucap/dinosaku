'use client';

import React, { useState } from 'react';
import ComicViewer from '@/components/dino/ComicViewer';
import HandController from '@/components/dino/HandController';
import QuizViewer from '@/components/dino/QuizViewer';
import { StoryData } from '@/components/dino/DinoApp';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { useProgress } from '@/lib/use-progress';

import { useRouter } from 'next/navigation';

export default function PresetStoryViewer({ story, storyId }: { story: StoryData, storyId: string }) {
  const [mode, setMode] = useState<'comic' | 'quiz'>('comic');
  const router = useRouter();
  const { profile, ready } = useProgress();
  const unlocked = true; // Temporarily unlock all if reached via URL
  // Removed strict locked check

  const handleQuizFinish = () => {
    router.push('/learn');
  };

  if (!ready) return <p role="status" className="p-8">Membuka cerita...</p>;
  if (!unlocked) return <div className="p-8"><h1>Petualangan ini masih terkunci</h1><p className="my-4">Selesaikan cerita sebelumnya di peta untuk melanjutkan.</p><Link className="button-primary p-3" href="/learn">Kembali ke Peta</Link></div>;

  return (
    <div className="min-h-full text-primary py-8 px-4 lg:px-10">
      <HandController mode={mode} />
      <div className="max-w-5xl mx-auto">
        <Link href="/learn" className="inline-flex items-center gap-2 text-secondary hover:text-brand-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={20} />
          Kembali ke Peta
        </Link>
        
        {mode === 'comic' && (
          <ComicViewer 
            title={story.title} 
            panels={story.panels} 
            onComplete={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setMode('quiz');
            }}
          />
        )}
        
        {mode === 'quiz' && (
          <QuizViewer 
            key={profile.id}
            storyId={storyId}
            quiz={story.quiz} 
            onRestart={handleQuizFinish}
            restartLabel="Selesai & Kembali ke Peta"
          />
        )}
      </div>
    </div>
  );
}
