'use client';

import React, { useEffect, useState } from 'react';
import { getCollection, SavedStory } from '@/lib/collection';
import { notFound, useParams, useRouter } from 'next/navigation';
import ComicViewer from '@/components/dino/ComicViewer';
import QuizViewer from '@/components/dino/QuizViewer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CollectionStoryViewer() {
  const params = useParams();
  const router = useRouter();
  const [story, setStory] = useState<SavedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'comic' | 'quiz'>('comic');

  useEffect(() => {
    getCollection().then(stories => {
      const found = stories.find(s => s.id === params.id);
      if (found) setStory(found);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <p role="status" className="p-8">Memuat buku...</p>;
  if (!story) return <div className="p-8"><h1>Cerita tidak ditemukan</h1><Link className="button-primary p-3 mt-4 inline-block" href="/learn/collection">Kembali ke Koleksi</Link></div>;

  return (
    <div className="min-h-full text-primary py-8 px-4 lg:px-10">
      <div className="max-w-[1600px] mx-auto w-full">
        <Link href="/learn/collection" className="inline-flex items-center gap-2 text-secondary hover:text-brand-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={20} />
          Kembali ke Koleksi
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
            storyId={story.id}
            quiz={story.quiz} 
            onRestart={() => router.push('/learn/collection')}
            restartLabel="Kembali ke Rak Buku"
          />
        )}
      </div>
    </div>
  );
}
