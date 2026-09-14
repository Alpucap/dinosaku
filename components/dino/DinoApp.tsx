'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Loader2, BookOpen, ImageIcon, Mic, MicOff, Sparkles, Rocket, Zap, PiggyBank, Coins, Scale, TrendingUp, Wallet, Palette, Wand2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ComicViewer from './ComicViewer';
import HandController from './HandController';
import QuizViewer from './QuizViewer';
import { takeEnergy, returnEnergy } from '@/lib/progress';
import { useProgress } from '@/lib/use-progress';
import { useSpeech } from '@/lib/use-speech';

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
  themeLabel?: string;
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
  const { isListening, transcript, startListening, stopListening, supported, setTranscript } = useSpeech();
  useEffect(() => {
    if (transcript && materi === 'custom') setCustomMateri(transcript);
  }, [transcript]);

  const [materi, setMateri] = useState('');
  const [customMateri, setCustomMateri] = useState('');
  const [temaMode, setTemaMode] = useState<'preset' | 'custom'>('preset');
  const [presetTema, setPresetTema] = useState('Luar Angkasa');
  const [customTema, setCustomTema] = useState('');
  const [assignmentId, setAssignmentId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [storyData, setStoryData] = useState<StoryData | null>(null);
  const [mode, setMode] = useState<'form' | 'comic' | 'quiz'>('form');
  const [storyId, setStoryId] = useState('');
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const { energy, ready } = useProgress();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const aId = params.get('assignmentId');
      const topic = params.get('topic');
      const theme = params.get('theme');
      if (aId && topic && theme && !busy.current) {
        setAssignmentId(aId);
        setMateri('custom');
        setCustomMateri(topic);
        setTemaMode('preset');
        setPresetTema(theme);
        // Biarkan user yang klik 'Buat Cerita' agar mereka siap, tapi setidaknya form sudah otomatis terisi.
      }
    }
  }, []);

  
  const materiList = [
    { id: 'Menabung (Saving)', label: 'Menabung', desc: 'Menyisihkan uang untuk masa depan', icon: <PiggyBank size={24} /> },
    { id: 'Mendapatkan Uang (Earning)', label: 'Mendapat Uang', desc: 'Cara menghasilkan uang dengan baik', icon: <Coins size={24} /> },
    { id: 'Kebutuhan vs Keinginan', label: 'Kebutuhan vs Keinginan', desc: 'Membedakan yang penting dan yang dimau', icon: <Scale size={24} /> },
    { id: 'Investasi Sederhana', label: 'Investasi', desc: 'Membuat uang berkembang', icon: <TrendingUp size={24} /> },
    { id: 'Membuat Anggaran (Budgeting)', label: 'Anggaran', desc: 'Merencanakan pengeluaran', icon: <Wallet size={24} /> },
  ];

  const temaList = [
    { id: 'Luar Angkasa', label: 'Luar Angkasa', emoji: '🚀' },
    { id: 'Kebun Binatang', label: 'Kebun Binatang', emoji: '🦁' },
    { id: 'Bawah Laut', label: 'Bawah Laut', emoji: '🌊' },
    { id: 'Hutan Ajaib', label: 'Hutan Ajaib', emoji: '🌲' },
    { id: 'Kota Robot', label: 'Kota Robot', emoji: '🤖' }
  ];

  

  const activeMateri = materi === 'custom' ? customMateri : materi;
  const activeTema = temaMode === 'preset' ? presetTema : customTema;
  const isFormValid = activeMateri.trim() !== '' && activeTema.trim() !== '';

  const executeGeneration = async (targetMateri: string, targetTema: string) => {
    if (busy.current) return;
    busy.current = true;
    setError('');
    setLoading(true);
    setMode('form');
    setStoryData(null);
    let reservation: string | undefined;
    try {
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
        body: JSON.stringify({ 
          story: {
            ...storyData,
            theme: activeTema,
            topic: activeMateri
          }, 
          images: generatedImages,
          assignmentId: assignmentId || undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Berhasil disimpan ke Peta Petualangan (Database & Firebase)! Silakan buka halaman Petualangan.');
      } else {
        alert('Gagal: ' + data.error);
      }
    } catch (e) {
      alert('Error saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToCollection = async () => {
    if (!storyData) return;
    setIsSaving(true);
    try {
      const { saveStoryToCollection } = await import('@/lib/collection');
      await saveStoryToCollection(storyData, generatedImages);
      alert('Cerita berhasil disimpan ke Koleksiku!');
    } catch (e) {
      alert('Gagal menyimpan cerita.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerate = () => {
    if (!isFormValid) return;
    executeGeneration(activeMateri, activeTema);
  };

  return (
    <div className="generator-page min-h-full text-primary py-8 px-4 lg:px-10 font-sans selection:bg-brand-accent-soft selection:text-brand-primary">
      {(mode === 'comic' || mode === 'quiz') && <HandController mode={mode} />}
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
                      className={`p-5 rounded-3xl border-[3px] transition-all text-left flex flex-col gap-3 group outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 ${
                        materi === m.id
                          ? 'border-brand-primary bg-surface-green shadow-[0_6px_0_0_#064e2b] translate-y-[-4px]'
                          : 'border-border bg-white shadow-[0_4px_0_0_rgba(203,213,225,1)] hover:border-brand-secondary hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_rgba(203,213,225,1)]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${materi === m.id ? 'bg-brand-primary text-white' : 'bg-surface-soft text-brand-primary group-hover:bg-brand-accent-soft'}`}>
                        {m.icon}
                      </div>
                      <div>
                        <span className={`block font-bold text-lg mb-1 ${materi === m.id ? 'text-brand-primary' : 'text-primary'}`}>
                          {m.label}
                        </span>
                        <span className={`block text-sm leading-snug ${materi === m.id ? 'text-brand-primary/80' : 'text-secondary'}`}>
                          {m.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setMateri('custom')}
                    aria-pressed={materi === 'custom'}
                    className={`p-5 rounded-3xl border-[3px] transition-all text-left flex flex-col gap-3 group outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 ${
                      materi === 'custom'
                        ? 'border-brand-primary bg-surface-green shadow-[0_6px_0_0_#064e2b] translate-y-[-4px]'
                        : 'border-border bg-white shadow-[0_4px_0_0_rgba(203,213,225,1)] hover:border-brand-secondary hover:translate-y-[-2px] hover:shadow-[0_6px_0_0_rgba(203,213,225,1)]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${materi === 'custom' ? 'bg-brand-primary text-white' : 'bg-surface-soft text-brand-primary group-hover:bg-brand-accent-soft'}`}>
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <span className={`block font-bold text-lg mb-1 ${materi === 'custom' ? 'text-brand-primary' : 'text-primary'}`}>
                        Topik Lainnya
                      </span>
                      <span className={`block text-sm leading-snug ${materi === 'custom' ? 'text-brand-primary/80' : 'text-secondary'}`}>
                        Ketik materi finansial pilihanmu
                      </span>
                    </div>
                  </button>
                </div>

                <AnimatePresence>
                  {materi === 'custom' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden col-span-full"
                    >
                      <div className="pt-4">
                        <label htmlFor="custom-materi" className="block text-sm font-medium text-secondary mb-2">
                          Ketik topik finansial yang ingin dipelajari (misal: "Pajak", "Asuransi", "Utang"):
                        </label>
                        <div className="flex gap-2 max-w-md">
                          <input
                            id="custom-materi"
                            type="text"
                            placeholder="Masukkan topik..."
                            value={customMateri}
                            maxLength={200}
                            onChange={(e) => { setCustomMateri(e.target.value); setTranscript(e.target.value); }}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-primary focus:!outline-none focus:ring-0 transition-all text-primary"
                          />
                          {supported && (
                            <button
                              type="button"
                              onClick={isListening ? stopListening : startListening}
                              className={`p-3 rounded-xl border-2 transition-all shrink-0 ${isListening ? 'bg-danger text-white border-danger animate-pulse' : 'bg-surface-soft border-border text-secondary hover:text-brand-primary hover:border-brand-primary'}`}
                              title="Bicara dengan Purba"
                            >
                              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>
                          )}
                        </div></div>
                    </motion.div>
                  )}
                </AnimatePresence>
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

                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                  {temaList.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTemaMode('preset');
                        setPresetTema(t.id);
                      }}
                      aria-pressed={temaMode === 'preset' && presetTema === t.id}
                      className={`px-4 py-4 rounded-2xl border-[3px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 ${
                        temaMode === 'preset' && presetTema === t.id
                          ? 'border-brand-primary bg-surface-green text-brand-primary shadow-[0_4px_0_0_#064e2b] translate-y-[-2px]'
                          : 'border-border bg-white text-secondary shadow-[0_2px_0_0_rgba(203,213,225,1)] hover:border-brand-secondary hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_rgba(203,213,225,1)]'
                      }`}
                    >
                      <span className="text-3xl">{t.emoji}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setTemaMode('custom');
                    }}
                    aria-pressed={temaMode === 'custom'}
                    className={`px-4 py-4 rounded-2xl border-[3px] font-bold text-lg transition-all flex flex-col items-center justify-center gap-2 outline-none focus-visible:ring-4 focus-visible:ring-brand-accent/50 ${
                      temaMode === 'custom'
                        ? 'border-brand-primary bg-surface-green text-brand-primary shadow-[0_4px_0_0_#064e2b] translate-y-[-2px]'
                        : 'border-border bg-white text-secondary shadow-[0_2px_0_0_rgba(203,213,225,1)] hover:border-brand-secondary hover:translate-y-[-2px] hover:shadow-[0_4px_0_0_rgba(203,213,225,1)]'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${temaMode === 'custom' ? 'bg-brand-primary text-white' : 'bg-surface-soft text-secondary'}`}>
                      <Palette size={20} />
                    </div>
                    <span>Tema Lain</span>
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
                        <div className="flex gap-2 max-w-md">
                          <input
                            id="custom-tema"
                            type="text"
                            placeholder="Masukkan tema..."
                            value={customTema}
                            maxLength={200}
                            onChange={(e) => setCustomTema(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-brand-primary focus:!outline-none focus:ring-0 transition-all text-primary"
                          />
                        </div>
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
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={handleSaveToCollection}
                  disabled={isSaving}
                  className="button-primary px-6 py-3 font-bold flex gap-2 items-center"
                >
                  {isSaving ? <Loader2 className="animate-spin" /> : '📚'} {isSaving ? 'Menyimpan...' : 'Simpan ke Koleksiku'}
                </button>
                {process.env.NODE_ENV === 'development' && Object.keys(generatedImages).length > 0 && (
                  <button 
                    onClick={handleSaveToLocal}
                    disabled={isSaving}
                    className="button-secondary px-6 py-3 font-bold border-2 border-primary text-primary hover:bg-primary/10 flex gap-2 items-center"
                  >
                    {isSaving ? <Loader2 className="animate-spin" /> : '💾'} {isSaving ? 'Menyimpan...' : 'Simpan ke Peta Petualangan (Dev Mode)'}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
