'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryPanel } from './DinoApp';
import { Gesture } from '@/components/dino/HandController';
import { ArrowRight, Loader2, Sparkles, RefreshCw, ImageOff, Zap, Star, Pencil, Volume2 } from 'lucide-react';

export default function ComicViewer({ title, panels, onComplete }: { title: string, panels: StoryPanel[], onComplete: (images: Record<number, string>) => void }) {
  const [images, setImages] = useState<Record<number, string>>({});
  const [loadingIndexes, setLoadingIndexes] = useState<Record<number, boolean>>({});

  const totalImages = panels.length;
  // An image is considered "finished processing" if it's in the images dictionary (even if failed '')
  const loadedCount = Object.keys(images).length;
  const isFullyLoaded = loadedCount === totalImages;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      
      // Coba cari suara bahasa Indonesia jika ada
      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) utterance.voice = idVoice;
      else utterance.lang = 'id-ID';
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onerror = (e) => {
        console.error("Speech error:", e);
        alert("Gagal memutar suara. Pastikan browser/OS kamu mendukung Text-to-Speech.");
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Browser kamu tidak mendukung fitur suara.");
    }
  };

  const generateImageForPanel = async (prompt: string, index: number) => {
    setLoadingIndexes(prev => ({ ...prev, [index]: true }));
    try {
      await new Promise(r => setTimeout(r, index * 600)); // Stagger the API calls
      const res = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImages(prev => ({ ...prev, [index]: data.imageUrl }));
      } else {
        setImages(prev => ({ ...prev, [index]: '' })); 
      }
    } catch (err) {
      console.error('Failed to generate image for panel', index, err);
      setImages(prev => ({ ...prev, [index]: '' }));
    } finally {
      setLoadingIndexes(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleGesture = useCallback((gesture: Gesture) => {
    if (gesture === 'Thumb_Up' && isFullyLoaded) {
      onComplete(images);
    }
  }, [isFullyLoaded, images, onComplete]);

  useEffect(() => {
    const handle = (e: any) => handleGesture(e.detail);
    window.addEventListener('dino-gesture', handle);
    return () => window.removeEventListener('dino-gesture', handle);
  }, [handleGesture]);

  const hasStartedLoading = React.useRef(false);

  useEffect(() => {
    if (hasStartedLoading.current) return;
    hasStartedLoading.current = true;
    
    panels.forEach((panel, i) => {
      if (panel.imageUrl) {
         const img = new window.Image();
         img.src = panel.imageUrl;
         img.onload = () => setImages(prev => ({ ...prev, [i]: panel.imageUrl! }));
         img.onerror = () => setImages(prev => ({ ...prev, [i]: panel.imageUrl! })); // fallback agar tidak stuck
      } else if (panel.imagePrompt.startsWith('[MOCK]')) {
         const url = 'https://placehold.co/600x600/EAF7ED/064E2B?text=MOCK+IMAGE';
         const img = new window.Image();
         img.src = url;
         img.onload = () => setImages(prev => ({ ...prev, [i]: url }));
         img.onerror = () => setImages(prev => ({ ...prev, [i]: url }));
      } else {
         generateImageForPanel(panel.imagePrompt, i);
      }
    });
  }, [panels, hasStartedLoading]);

  // Removed Stickers

  if (!isFullyLoaded) {
    const progressPercent = Math.round((loadedCount / totalImages) * 100) || 10;
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-12 md:p-20 rounded-[2.5rem] shadow-modal border-4 border-border-strong text-center flex flex-col items-center justify-center min-h-[50vh] relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-soft rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-success-soft rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2 opacity-50" />
        
        <motion.div 
           animate={{ 
             rotate: [-10, 10, -10],
             x: [-10, 10, -10],
             y: [0, -15, 0]
           }} 
           transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
           className="mb-8"
        >
          <div className="w-24 h-24 bg-brand-accent rounded-full flex items-center justify-center border-4 border-brand-primary shadow-card">
             <Pencil className="w-12 h-12 text-brand-primary" />
          </div>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-primary mb-4">
          Purba Sedang Menggambar... 🎨
        </h2>
        <p className="text-secondary text-lg md:text-xl mb-12 max-w-lg font-medium">
          Tunggu sebentar ya, warna dan jalan ceritanya sedang disiapkan khusus untukmu!
        </p>
        
        <div className="w-full max-w-md bg-surface-soft rounded-full h-8 border-4 border-border-strong overflow-hidden relative shadow-inner">
           <motion.div 
              className="bg-brand-accent h-full relative"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "easeInOut", duration: 0.5 }}
           >
              <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
           </motion.div>
        </div>
        <p className="mt-6 font-bold text-brand-primary text-xl font-heading">
          {loadedCount} dari {totalImages} Panel Selesai
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-surface p-6 md:p-10 rounded-[2.5rem] shadow-modal border-4 border-border-strong relative">
      <div className="absolute -top-6 -right-6 text-brand-accent transform rotate-12 opacity-50">
        <Sparkles size={80} />
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6 border-b-4 border-border-strong pb-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-4 text-brand-primary">
          <div className="w-16 h-16 rounded-full bg-surface-green flex items-center justify-center text-brand-primary border-4 border-brand-secondary shadow-sm">
            <Sparkles size={32} />
          </div>
          <span className="leading-tight">{title || "Waktunya Cerita"}</span>
        </h2>
        <button
          onClick={() => onComplete(images)}
          className="button-primary px-8 py-4 w-full md:w-auto text-xl font-bold flex items-center justify-center gap-3 shadow-card hover:scale-105 transition-transform text-white"
        >
          Lanjut ke Kuis! <ArrowRight size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10">
        <AnimatePresence>
          {panels.map((panel, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, rotate: i % 2 === 0 ? -4 : 4, y: 50 }}
              animate={{ opacity: 1, scale: 1, rotate: i % 2 === 0 ? -2 : 2, y: 0 }}
              transition={{ delay: i * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white rounded-[2rem] p-4 md:p-5 border-[4px] border-primary shadow-[8px_8px_0_0_#022c22] hover:shadow-[12px_12px_0_0_#022c22] hover:-translate-y-2 transition-all flex flex-col group relative"
            >
              {/* Panel Number Badge */}
              <div className="absolute -top-5 -left-5 w-12 h-12 bg-brand-accent text-primary font-black font-heading text-2xl flex items-center justify-center rounded-full border-[4px] border-primary shadow-[4px_4px_0_0_#022c22] z-30 transform -rotate-12 group-hover:rotate-0 transition-transform">
                {i + 1}
              </div>

              {/* Image Container */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden border-[4px] border-primary relative z-10 bg-surface-soft shadow-inner">
                {images[i] ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img 
                    src={images[i]} 
                    alt={`Panel ${i + 1}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center justify-center h-full w-full bg-surface-soft">
                     <ImageOff className="text-danger w-12 h-12 mb-4 opacity-50" />
                     <p className="text-danger font-bold mb-4 font-heading text-lg">Gagal memuat gambar</p>
                     <button 
                       onClick={() => generateImageForPanel(panel.imagePrompt, i)}
                       className="px-4 py-2 bg-white rounded-lg border-2 border-border text-primary font-medium hover:border-primary flex items-center gap-2 shadow-[2px_2px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 transition-all"
                     >
                       <RefreshCw size={16} /> Coba Lagi
                     </button>
                  </div>
                )}
              </div>
              
              {/* Comic Narrator Caption Box Style */}
              <div className="mt-[-2rem] relative z-20 mx-2 md:mx-6">
                <div className="bg-[#FFF9C4] border-[4px] border-primary rounded-2xl p-5 md:p-6 shadow-[4px_4px_0_0_#022c22] flex flex-col items-center text-center relative group-hover:translate-y-[-4px] transition-transform duration-300">
                  <button 
                    onClick={() => speakText(panel.text)}
                    className="absolute -top-4 -right-4 w-11 h-11 bg-brand-primary text-white rounded-full border-[3px] border-primary flex items-center justify-center hover:bg-brand-secondary transition-colors shadow-[2px_2px_0_0_#022c22] z-30"
                    aria-label="Bacakan cerita"
                    title="Bacakan cerita"
                  >
                    <Volume2 size={20} />
                  </button>
                  <p className="text-primary font-black text-lg md:text-xl leading-snug font-heading tracking-wide uppercase">
                    {panel.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
          
    </div>
  );
}
