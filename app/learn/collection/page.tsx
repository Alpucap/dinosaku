'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getCollection, deleteStoryFromCollection, SavedStory } from '@/lib/collection';
import { Book, Play, Search, Sparkles, Trash2 } from 'lucide-react';
import { useProgress } from '@/lib/use-progress';

export default function CollectionPage() {
  const { profile } = useProgress();
  const [stories, setStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string, title: string} | null>(null);

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stories;
    return stories.filter(story => story.title.toLowerCase().includes(query));
  }, [stories, search]);

  useEffect(() => {
    getCollection().then(res => {
      setStories(res.reverse());
      setLoading(false);
    });
  }, []);


  
  const handleDelete = (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteStoryFromCollection(deleteConfirm.id);
      setStories(s => s.filter(story => story.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    }
  };


  return (
    <div className="learning-page">
      <header className="page-heading">
        <p className="eyebrow">Buku karangan {profile.name}</p>
        <h1>Karya Ceritamu Sendiri</h1>
        <p>Koleksi komik seru yang kamu buat menggunakan bantuan AI.</p>
      </header>

      <div className="section-heading">
        <h2>Rak Buku</h2>
        <span>{stories.length} cerita tersimpan</span>
      </div>

      {!loading && stories.length > 0 && (
        <div className="relative w-full max-w-sm mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul ceritamu..."
            className="w-full bg-white border-[3px] border-border-light rounded-2xl py-3 pl-12 pr-4 font-medium text-primary placeholder:text-secondary/70 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
      )}

      {loading ? (
        <p role="status">Memuat koleksimu...</p>
      ) : stories.length === 0 ? (
        <div className="ranking-empty py-16 flex flex-col items-center justify-center">
          <Book size={48} className="text-secondary opacity-50 mb-4 mx-auto" />
          <p className="mb-6 text-secondary">Rak bukumu masih kosong. Yuk buat cerita pertamamu!</p>
          <Link href="/learn/create" className="button-primary px-8 py-4 text-lg">Buat Cerita Sekarang</Link>
        </div>
      ) : filteredStories.length === 0 ? (
        <div className="ranking-empty py-16 flex flex-col items-center justify-center">
          <Search size={48} className="text-secondary opacity-50 mb-4 mx-auto" />
          <p className="text-secondary">Tidak ada cerita dengan judul "{search}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <article key={story.id} className="bg-white rounded-[2rem] p-5 border-[3px] border-border-light shadow-[0_8px_0_0_rgba(203,213,225,1)] flex flex-col hover:-translate-y-1 transition-transform">
              <div className="w-full aspect-square bg-[#F8FAFC] rounded-2xl mb-5 overflow-hidden border-2 border-border-light relative">
                {story.panels[0]?.imageUrl ? (
                  <img src={story.panels[0].imageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary opacity-30">
                    <Book size={64} />
                  </div>
                )}
                
                <button 
                  onClick={() => handleDelete(story.id, story.title)}
                  className="absolute top-3 left-3 bg-white/90 hover:bg-danger hover:text-white text-danger transition-colors p-2 rounded-full shadow-sm z-10"
                  title="Hapus cerita"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute top-3 right-3 bg-brand-primary text-white text-xs font-bold px-3 py-1.5 rounded-full flex gap-1.5 items-center shadow-sm">
                  <Sparkles size={12} />
                  AI Story
                </div>
              </div>
              <h3 className="font-heading text-xl text-primary font-bold mb-2 line-clamp-2 leading-tight">
                {story.title}
              </h3>
              <p className="text-secondary text-sm mb-6 grow font-medium">
                Dibuat: {new Date(story.savedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <Link 
                href={`/learn/collection/${story.id}`} 
                className="button-secondary w-full py-3.5 flex justify-center gap-2 font-bold"
              >
                <Play size={18} /> Buka Buku
              </Link>
            </article>
          ))}
        </div>
      )}
      
      {stories.length > 0 && (
        <div className="learning-callout mt-12">
          <div>
            <h2>Ingin cerita baru?</h2>
            <p>Jelajahi tema lain dan buat petualangan seru bersama Purba!</p>
          </div>
          <Link href="/learn/create" className="button-primary px-6 py-3">Buat Cerita Lagi</Link>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-6 max-w-md w-full border-[3px] border-border-light shadow-[0_8px_0_0_rgba(203,213,225,1)]">
            <h3 className="text-2xl font-bold font-heading mb-2 text-primary">Hapus Cerita?</h3>
            <p className="text-secondary mb-8">Apakah kamu yakin ingin menghapus <strong>"{deleteConfirm.title}"</strong> dari rak bukumu? Cerita yang dihapus tidak bisa dikembalikan.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-3.5 bg-surface-soft hover:bg-border-light rounded-xl font-bold text-secondary transition-colors">
                Batal
              </button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-3.5 bg-danger hover:bg-red-600 rounded-xl font-bold text-white shadow-[0_4px_0_0_#991B1B] hover:shadow-[0_2px_0_0_#991B1B] hover:translate-y-0.5 transition-all">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
