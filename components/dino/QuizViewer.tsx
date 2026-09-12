'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion } from './DinoApp';
import { CheckCircle2, XCircle, Trophy, RefreshCcw, HelpCircle, Star, Sparkles, Map, Send } from 'lucide-react';

export default function QuizViewer({ quiz, onRestart, onContinue }: { quiz: QuizQuestion[], onRestart: () => void, onContinue: (tema: string) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lanjutan, setLanjutan] = useState('');

  const question = quiz[currentIndex];
  const isLast = currentIndex === quiz.length - 1;

  // Helper for resilient matching in case AI adds extra spaces or case differences
  const isOptionCorrect = (opt: string) => {
    return opt.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  };

  const fireConfetti = (options: any) => {
    import('canvas-confetti').then((module) => {
      const confetti = module.default || module;
      confetti(options);
    }).catch(e => console.error("Confetti failed to load:", e));
  };

  const handleSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    
    const correct = isOptionCorrect(option);
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
      fireConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16A34A', '#98CE36', '#94D9AA']
      });
    }
  };

  const handleNext = () => {
    if (isLast) {
      setShowResult(true);
      if (score + (isCorrect ? 1 : 0) === quiz.length) {
        // perfect score confetti
        setTimeout(() => {
          fireConfetti({ particleCount: 200, spread: 100, origin: { y: 0.3 } });
        }, 300);
      }
    } else {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    }
  };

  const handleLanjutCerita = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lanjutan.trim()) return;
    onContinue("Lanjutan: " + lanjutan);
  };

  if (showResult) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface p-8 md:p-12 rounded-[2.5rem] shadow-modal border-4 border-border-strong text-center max-w-2xl mx-auto relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-brand-accent-soft -z-10 rounded-t-[2.5rem]" />
        
        <div className="w-32 h-32 bg-white rounded-full mx-auto border-4 border-warning shadow-lg flex items-center justify-center mb-6 relative z-10">
          <Trophy className="w-16 h-16 text-warning" />
          <div className="absolute -top-2 -right-2 bg-brand-accent text-white w-10 h-10 rounded-full border-4 border-white flex items-center justify-center font-bold">
            <Star size={16} />
          </div>
        </div>
        
        <h2 className="text-4xl font-heading font-bold mb-3 text-brand-primary">Kuis Selesai!</h2>
        <p className="text-xl text-secondary mb-10 font-medium">
          Skor kamu <span className="font-bold text-3xl text-brand-primary mx-2">{score}</span> dari {quiz.length}
        </p>

        <div className="bg-background rounded-3xl p-6 md:p-8 border-4 border-border-strong shadow-inner text-left mb-8">
          <h3 className="text-2xl font-bold font-heading flex items-center gap-3 text-brand-primary mb-3">
            <Map className="text-brand-accent" size={28} /> Mau lanjut ke mana?
          </h3>
          <p className="text-secondary font-medium mb-6">
            Cerita Purba belum berakhir! Ketik ide petualangan selanjutnya berdasarkan apa yang baru saja kamu pelajari.
          </p>
          
          <form onSubmit={handleLanjutCerita} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              value={lanjutan}
              onChange={e => setLanjutan(e.target.value)}
              placeholder="Contoh: Purba membagikan sebagian uang ke teman..." 
              className="grow p-4 rounded-xl border-2 border-border focus:border-brand-accent focus:ring-4 focus:ring-brand-accent-soft outline-none transition-all font-medium text-lg"
            />
            <button 
              type="submit"
              disabled={!lanjutan.trim()}
              className="button-accent px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-card disabled:opacity-50 text-brand-primary whitespace-nowrap"
            >
              Lanjut Cerita <Send size={20} />
            </button>
          </form>
        </div>
        
        <button
          onClick={onRestart}
          className="button-secondary w-full px-8 py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-transform"
        >
          <RefreshCcw size={24} /> Ganti Topik Baru
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-surface p-8 md:p-12 rounded-[2.5rem] shadow-modal border-4 border-border-strong max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 border-b-4 border-border-strong pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-accent-soft flex items-center justify-center text-brand-primary border-2 border-brand-secondary">
            <HelpCircle size={24} />
          </div>
          <span className="text-brand-primary font-bold text-lg font-heading">
            Pertanyaan {currentIndex + 1} / {quiz.length}
          </span>
        </div>
        <span className="text-warning font-bold bg-warning-soft px-5 py-2 rounded-full text-lg font-heading border-2 border-warning/20">
          Skor: {score}
        </span>
      </div>

      <h3 className="text-3xl font-heading font-bold mb-10 text-primary leading-tight text-center md:text-left">
        {question.question}
      </h3>

      <div className="space-y-4 mb-10">
        {question.options.map((opt, i) => {
          let stateClass = 'bg-background hover:bg-surface-soft border-border text-secondary hover:border-brand-secondary hover:text-brand-primary';
          let Icon = null;
          
          if (selectedAnswer !== null) {
            if (isOptionCorrect(opt)) {
              stateClass = 'bg-success-soft border-success text-success shadow-md';
              Icon = CheckCircle2;
            } else if (opt === selectedAnswer && !isCorrect) {
              stateClass = 'bg-danger-soft border-danger text-danger shadow-md';
              Icon = XCircle;
            } else {
              stateClass = 'bg-background border-transparent opacity-40 grayscale';
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              disabled={selectedAnswer !== null}
              className={`w-full text-left p-6 rounded-2xl border-4 transition-all flex items-center justify-between font-bold text-xl outline-none focus-visible:ring-4 focus-visible:ring-brand-accent ${stateClass}`}
            >
              <span>{opt}</span>
              {Icon && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0">
                  <Icon className="w-8 h-8" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedAnswer !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`p-8 rounded-3xl mb-8 flex flex-col gap-3 border-4 shadow-sm ${
              isCorrect ? 'bg-success-soft border-success/30' : 'bg-warning-soft border-warning/30'
            }`}
          >
            <p className="text-2xl font-heading">
              {isCorrect ? (
                <span className="font-bold text-success flex items-center gap-2"><Sparkles size={28}/> Kerja Bagus!</span>
              ) : (
                <span className="font-bold text-warning flex items-center gap-2"><HelpCircle size={28}/> Belum Tepat!</span>
              )}
            </p>
            <p className="text-primary text-lg font-medium leading-relaxed">{question.insight}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedAnswer !== null && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-end pt-6 border-t-4 border-border-strong"
        >
          <button
            onClick={handleNext}
            className="button-primary px-8 py-4 text-xl font-bold rounded-2xl hover:scale-105 transition-transform shadow-card text-white"
          >
            {isLast ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
