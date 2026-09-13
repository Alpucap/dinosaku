'use client';

import React, { useState, useRef } from 'react';
import { Loader2, BookOpen, ImageIcon, Sparkles, Rocket, Zap } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ComicViewer from './ComicViewer';
import QuizViewer from './QuizViewer';
import { takeEnergy, returnEnergy } from '@/lib/progress';
import { useProgress } from '@/lib/use-progress';

export type StoryPanel = {
  text: string;
  imagePrompt: string;
  imageUrl?: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  insight: string;
};

export type StoryData = {
  title: string;
  panels: StoryPanel[];
  quiz: QuizQuestion[];
};

function isStoryData(value: unknown): value is StoryData {
  if (!value || typeof value !== 'object') return false;
  const story = value as StoryData;
  return typeof story.title === 'string' && story.title.trim().length > 0
    && Array.isArray(story.panels) && story.panels.length === 4
    && story.panels.every(panel => panel && typeof panel.text === 'string' && typeof panel.imagePrompt === 'string' && (!panel.imageUrl || typeof panel.imageUrl === 'string'))
    && Array.isArray(story.quiz) && story.quiz.length === 5
    && story.quiz.every(question => question && typeof question.question === 'string' && typeof question.insight === 'string' && typeof question.correctAnswer === 'string'
      && Array.isArray(question.options) && question.options.length === 3 && question.options.every(option => typeof option === 'string' && option.trim())
      && new Set(question.options.map(option => option.trim().toLowerCase())).size === 3
      && question.options.some(option => option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()));
}

export default function DinoApp() {
  const reduceMotion = useReducedMotion();
  const [materi, setMateri] = useState('Menabung (Saving)');
  const [temaMode, setTemaMode] = useState<'preset' | 'custom'>('preset');
  const [presetTema, setPresetTema] = useState('Luar Angkasa');
  const [customTema, setCustomTema] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [mode, setMode] = useState<'form' | 'comic' | 'quiz'>('form');
  const [storyId, setStoryId] = useState('');
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const { energy, ready } = useProgress();

  const materiList = [
    { id: 'Menabung (Saving)', label: 'Menabung', desc: 'Menyisihkan uang untuk masa depan' },
    { id: 'Mendapatkan Uang (Earning)', label: 'Mendapat Uang', desc: 'Cara menghasilkan uang dengan baik' },
    { id: 'Kebutuhan vs Keinginan', label: 'Kebutuhan vs Keinginan', desc: 'Membedakan yang penting dan yang dimau' },
    { id: 'Investasi Sederhana', label: 'Investasi', desc: 'Membuat uang berkembang' },
    { id: 'Membuat Anggaran (Budgeting)', label: 'Anggaran', desc: 'Merencanakan pengeluaran' },
    { id: 'Demo POC (Tanpa API)', label: 'Demo POC', desc: 'Coba tanpa kuota API' }
  ];

  const temaList = [
    'Luar Angkasa',
    'Kebun Binatang',
    'Bawah Laut',
    'Hutan Ajaib',
    'Kota Robot'
  ];

  const activeTema = temaMode === 'preset' ? presetTema : customTema;
  const isFormValid = materi !== '' && activeTema.trim() !== '';

  const executeGeneration = async (targetMateri: string, targetTema: string) => {
    if (busy.current) return;
    busy.current = true;
    setError('');
    setLoading(true);
    setMode('form');
    setStoryData(null);
    let reservation: string | undefined;
    try {
      if (targetMateri === 'Demo POC (Tanpa API)') {
        await new Promise(r => setTimeout(r, 1500)); 
        setStoryData({
          title: `Petualangan Purba di ${targetTema}`,
          panels: [
            { text: `Purba sedang menjelajahi ${targetTema} yang sangat indah. Di sana, ia melihat mainan yang sangat bagus!`, imagePrompt: '[MOCK]', imageUrl: '/mascot/dino.png' },
            { text: "Namun, Purba ingat pelajaran tentang menabung. Ia memutuskan untuk tidak langsung membeli.", imagePrompt: '[MOCK]', imageUrl: '/mascot/dino.png' },
            { text: "Purba bekerja keras membersihkan tempat itu setiap hari dan menyimpan koinnya.", imagePrompt: '[MOCK]', imageUrl: '/mascot/dino.png' },
            { text: "Akhirnya tabungannya penuh! Purba bangga bisa membeli mainannya dengan hasil keringat sendiri.", imagePrompt: '[MOCK]', imageUrl: '/mascot/dino.png' }
          ],
          quiz: [
            {
              question: "Apa yang dilakukan Purba saat melihat mainan?",
              options: ["Langsung membeli", "Menangis", "Memutuskan untuk menabung"],
              correctAnswer: "Memutuskan untuk menabung",
              insight: "Menahan diri dan menabung melatih kesabaran kita!"
            },
            {
              question: "Dari mana Purba mendapatkan uang?",
              options: ["Bekerja keras", "Minta teman", "Menemukan di jalan"],
              correctAnswer: "Bekerja keras",
              insight: "Bekerja keras adalah cara yang baik dan jujur untuk mendapatkan uang."
            }
          ]
        });
        setStoryId('demo-saving');
        setMode('comic');
        setLoading(false);
        return;
      }

      reservation = await takeEnergy();
      const res = await fetch('/api/generate/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materi: targetMateri, tema: targetTema }),
        signal: AbortSignal.timeout(90_000),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(res.status === 429 ? 'Layanan cerita sedang mencapai batas pemakaian. Coba lagi nanti atau gunakan demo.' : 'Cerita belum bisa dibuat. Energi dikembalikan; coba mode demo atau ulangi nanti.');
      if (isStoryData(data?.story)) {
        setStoryId(`ai-${reservation}`);
        setStoryData(data.story);
        setMode('comic');
      } else {
        throw new Error('Isi cerita belum lengkap. Coba lagi, ya!');
      }
    } catch (err) {
      if (reservation) await returnEnergy(reservation);
      setError(err instanceof Error && err.name !== 'TimeoutError' && err.name !== 'TypeError' ? err.message : 'Koneksi terputus atau waktu tunggu habis. Energi dikembalikan. Silakan coba lagi.');
    } finally {
      busy.current = false;
      setLoading(false);
    }
  };

  const handleSaveToLocal = async () => {
    if (!storyData) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: storyData, images: generatedImages })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Tersimpan di local! Buka lib/data/generated-stories.json');
      } else {
        alert('Gagal: ' + data.error);
      }
    } catch (e) {
      alert('Error saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = () => {
    if (!isFormValid) return;
    executeGeneration(materi, activeTema);
  };

  return (
    <div className="generator-page min-h-full text-primary py-8 px-4 lg:px-10 font-sans selection:bg-brand-accent-soft selection:text-brand-primary">
      <div className="max-w-7xl mx-auto">
        {mode === 'form' && (
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-10 bg-surface p-8 md:p-10 rounded-[2.5rem] shadow-modal border-4 border-border-strong relative overflow-hidden"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-soft rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-success-soft rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 opacity-50" />
            
            <div className="relative shrink-0">
              <motion.div 
                animate={{ y: reduceMotion ? 0 : [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-brand-accent-soft overflow-hidden flex items-center justify-center border-4 border-surface-green shadow-lg relative z-10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/mascot/dino.png" alt="Purba Mascot" className="w-24 h-24 md:w-28 md:h-28 object-cover object-top rounded-full relative z-10" />
              </motion.div>
            </div>

            <div className="text-center md:text-left z-10 flex flex-col items-center md:items-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                className="bg-white text-brand-primary font-bold px-5 py-2 rounded-2xl rounded-bl-none md:rounded-tl-none md:rounded-bl-2xl shadow-card border-2 border-border-strong text-sm md:text-base z-20 w-max mb-4 font-heading"
              >
                Halo, aku Purba! 👋
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-brand-primary mb-4 flex items-center justify-center md:justify-start gap-3">
                Petualangan Dinosaku <Sparkles className="text-brand-accent" size={32} />
              </h1>
              <p className="text-secondary text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                Belajar kelola uang saku lewat cerita komik AI interaktif bersama <span className="font-bold text-brand-primary">Purba si Dinosaurus</span>! Pilih materi dan tema kesukaanmu.
              </p>
            </div>
          </motion.header>
        )}

        {mode === 'form' && <div className="energy-banner"><Zap size={25} aria-hidden="true" /><div className="flex-1"><strong>{energy} dari 3 energi tersisa hari ini</strong><p>Satu cerita AI memakai satu energi. Terisi lagi besok; demo dan koleksi cerita selalu gratis.</p></div><span className="energy-cells" aria-hidden="true">{[0, 1, 2].map(index => <i key={index} className={index < energy ? 'filled' : ''} />)}</span></div>}
        {error && <p role="alert" className="mb-6 rounded-xl border border-danger bg-danger-soft p-4 text-primary">{error}</p>}

        <AnimatePresence mode="wait">
          {mode === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <section className="bg-surface p-8 md:p-10 rounded-[2rem] shadow-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-brand-accent-soft rounded-xl text-brand-primary">
                    <BookOpen size={24} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary">
                    1. Pilih Materi Belajar
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {materiList.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMateri(m.id)}
                      aria-pressed={materi === m.id}
                      className={`p-5 rounded-2xl border-2 transition-all text-left flex flex-col gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                        materi === m.id
                          ? 'border-brand-primary bg-surface-green shadow-soft'
                          : 'border-border bg-background hover:border-brand-secondary hover:bg-surface-soft'
                      }`}
                    >
                      <span className={`font-bold text-lg ${materi === m.id ? 'text-brand-primary' : 'text-primary'}`}>
                        {m.label}
                      </span>
                      <span className={`text-sm ${materi === m.id ? 'text-brand-primary/80' : 'text-secondary'}`}>
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="bg-surface p-8 md:p-10 rounded-[2rem] shadow-card border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-brand-accent-soft rounded-xl text-brand-primary">
                    <ImageIcon size={24} />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-primary">
                    2. Tentukan Tema Cerita
                  </h2>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {temaList.map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        setTemaMode('preset');
                        setPresetTema(t);
                      }}
                      aria-pressed={temaMode === 'preset' && presetTema === t}
                      className={`px-5 py-3 rounded-xl border-2 font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                        temaMode === 'preset' && presetTema === t
                          ? 'border-brand-primary bg-surface-green text-brand-primary shadow-sm'
                          : 'border-border bg-background text-secondary hover:border-brand-secondary hover:bg-surface-soft'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTemaMode('custom');
                    }}
                    aria-pressed={temaMode === 'custom'}
                    className={`px-5 py-3 rounded-xl border-2 font-medium transition-all flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                      temaMode === 'custom'
                        ? 'border-brand-primary bg-surface-green text-brand-primary shadow-sm'
                        : 'border-border bg-background text-secondary hover:border-brand-secondary hover:bg-surface-soft'
                    }`}
                  >
                    <Sparkles size={18} /> Tema Lainnya
                  </button>
                </div>

                <AnimatePresence>
                  {temaMode === 'custom' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 pb-4">
                        <label htmlFor="custom-tema" className="block text-sm font-medium text-secondary mb-2">
                          Ketik tema kesukaanmu (contoh: Dinosaurus, Super hero, Memasak):
                        </label>
                        <input
                          id="custom-tema"
                          type="text"
                          placeholder="Masukkan tema..."
                          value={customTema}
                          maxLength={200}
                          onChange={(e) => setCustomTema(e.target.value)}
                          className="w-full max-w-md px-4 py-3 rounded-xl border-2 border-border bg-background focus:border-brand-primary focus:ring-4 focus:ring-brand-accent-soft transition-all outline-none text-primary"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <div className="flex justify-center pt-8 pb-4">
                <button
                  onClick={handleGenerate}
                  disabled={!ready || loading || !isFormValid || (energy === 0 && materi !== 'Demo POC (Tanpa API)')}
                  aria-busy={loading}
                  className={`relative group w-full md:w-auto px-12 py-5 text-2xl font-black font-heading rounded-full transition-all flex items-center justify-center gap-4 text-white overflow-hidden
                    ${isFormValid && !loading
                      ? 'bg-brand-primary border-4 border-white shadow-[0_8px_0_0_#064E2B] hover:shadow-[0_4px_0_0_#064E2B] hover:translate-y-1 active:shadow-none active:translate-y-2' 
                      : 'bg-gray-400 border-4 border-white shadow-[0_8px_0_0_#9ca3af] opacity-80 cursor-not-allowed'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={28} /> 
                      <span>Merakit Cerita...</span>
                    </>
                  ) : (
                    <>
                      <Rocket size={28} className={isFormValid ? "animate-pulse" : ""} /> 
                      <span>{energy === 0 && materi !== 'Demo POC (Tanpa API)' ? 'Energi habis hari ini' : 'Mulai Petualangan!'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {mode === 'comic' && storyData && (
            <motion.div
              key="comic"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <ComicViewer title={storyData.title} panels={storyData.panels} onComplete={(images) => { setGeneratedImages(images); setMode('quiz'); }} />
            </motion.div>
          )}

          {mode === 'quiz' && storyData && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <QuizViewer 
                storyId={storyId}
                quiz={storyData.quiz} 
                onRestart={() => setMode('form')} 
                onContinue={(lanjutan) => {
                  setTemaMode('custom');
                  setCustomTema(lanjutan);
                  executeGeneration(materi, lanjutan);
                }}
              />
              {process.env.NODE_ENV === 'development' && Object.keys(generatedImages).length > 0 && (
                <div className="mt-8 flex justify-center">
                  <button 
                    onClick={handleSaveToLocal}
                    disabled={isSaving}
                    className="button-secondary px-6 py-3 font-bold border-2 border-primary text-primary hover:bg-primary/10 flex gap-2 items-center"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : '💾'} {isSaving ? 'Menyimpan...' : 'Simpan ke Peta Petualangan (Dev Mode)'}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
