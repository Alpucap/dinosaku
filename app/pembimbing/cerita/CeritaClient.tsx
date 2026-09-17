'use client';

import React, { useState, useEffect } from 'react';
import { getTeacherStudentsForAssign, getTeacherEnergy, createAndAssignStory } from './actions';
import { BookOpen, Sparkles, Users, Zap, Check, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function CeritaClient() {
  const router = useRouter();
  const [students, setStudents] = useState<{id: string, fullName: string, username: string}[]>([]);
  const [energy, setEnergy] = useState(0);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const [topic, setTopic] = useState('');
  const [theme, setTheme] = useState('');
  const [character, setCharacter] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [st, en] = await Promise.all([getTeacherStudentsForAssign(), getTeacherEnergy()]);
        setStudents(st);
        setEnergy(en);
      } catch (e) {
        toast.add({ title: "Gagal memuat data", type: 'error' });
      } finally {
        setLoadingInitial(false);
      }
    }
    load();
  }, []);

  const filteredStudents = students.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentStudents = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    if (selectedStudents.includes(id)) {
      setSelectedStudents(selectedStudents.filter(s => s !== id));
    } else {
      setSelectedStudents([...selectedStudents, id]);
    }
  };

  const handleGenerate = async () => {
    if (!topic || !theme) {
      toast.add({ title: "Topik dan Tema harus diisi!", type: 'error' });
      return;
    }
    if (energy < 1) {
      toast.add({ title: "Energi tidak cukup!", type: 'error' });
      return;
    }
    
    setIsGenerating(true);
    try {
      const finalTheme = character ? `${theme} dengan Purba sang Dino yang memakai kostum/berperan sebagai ${character}` : theme;
      const storyId = await createAndAssignStory(topic, finalTheme, []); // Pass empty array so it doesn't assign yet
      
      toast.add({ title: "Cerita berhasil diracik! Silakan preview.", type: 'success' });
      
      // Redirect to preview page with pending students
      if (selectedStudents.length > 0) {
        router.push(`/pembimbing/koleksi/${storyId}?pendingAssign=${selectedStudents.join(',')}`);
      } else {
        router.push(`/pembimbing/koleksi/${storyId}`);
      }
      
    } catch (e: any) {
      toast.add({ title: e.message || "Terjadi kesalahan saat membuat cerita", type: 'error' });
      setIsGenerating(false);
    }
  };

  if (loadingInitial) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary w-8 h-8" /></div>;
  }

  const inputClass = "w-full bg-surface-soft border border-border-strong rounded-lg p-2 text-sm focus:border-brand-primary outline-none transition-colors";
  const labelClass = "block text-[11px] uppercase tracking-wider font-bold text-text-secondary mb-1";
  const chipClass = "text-[11px] bg-surface-soft border border-border text-text-secondary font-bold px-2 py-1 rounded-md hover:bg-brand-primary/10 hover:text-brand-primary hover:border-brand-primary/30 transition-colors";

  return (
    <div className="grid md:grid-cols-5 gap-6 items-start">

      {/* KIRI: Form Cerita */}
      <div className="rounded-xl border border-default bg-surface p-5 flex flex-col gap-4 md:col-span-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-bold text-text-primary text-sm">Buat Cerita Baru</h3>
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-warning bg-warning/10 px-2 py-1 rounded-md">
            <Zap size={12} /> {energy} Energi
          </span>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className={labelClass}>Topik Misi</label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <button type="button" onClick={() => setTopic('Menabung untuk beli mainan')} className={chipClass}>Menabung</button>
              <button type="button" onClick={() => setTopic('Pentingnya berbagi dengan teman')} className={chipClass}>Berbagi</button>
              <button type="button" onClick={() => setTopic('Menghargai barang milik sendiri')} className={chipClass}>Menghargai</button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Cth: Belajar menabung untuk beli sepeda"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className={labelClass}>Tema Cerita</label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <button type="button" onClick={() => setTheme('Luar Angkasa')} className={chipClass}>Luar Angkasa</button>
              <button type="button" onClick={() => setTheme('Hutan Ajaib')} className={chipClass}>Hutan Ajaib</button>
              <button type="button" onClick={() => setTheme('Kerajaan Dinosaurus')} className={chipClass}>Dinosaurus</button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Cth: Petualangan di Hutan Ajaib"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className={labelClass}>Peran Purba (Opsional)</label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              <button type="button" onClick={() => setCharacter('Astronot')} className={chipClass}>Astronot</button>
              <button type="button" onClick={() => setCharacter('Detektif')} className={chipClass}>Detektif</button>
              <button type="button" onClick={() => setCharacter('Ksatria')} className={chipClass}>Ksatria</button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Cth: Astronot, Detektif, Pahlawan Super"
            value={character}
            onChange={(e) => setCharacter(e.target.value)}
            className={inputClass}
          />
        </div>

        <p className="text-[11px] text-text-secondary leading-relaxed bg-surface-soft border border-border-light rounded-lg p-3">
          Kombinasikan topik belajar uang dengan dunia fantasi anak. AI akan meracik cerita lengkap
          dengan ilustrasi dan kuis interaktif secara instan.
        </p>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || energy < 1 || !topic || !theme}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-brand-primary/90 transition-colors text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <><Loader2 className="animate-spin" size={16} /> AI Sedang Meracik...</>
          ) : (
            <><BookOpen size={16} /> Buat Cerita & Preview (1 Energi)</>
          )}
        </button>
        {energy < 1 && (
          <p className="text-center text-xs text-danger font-medium">Energi habis! Beralih ke Premium untuk energi ekstra.</p>
        )}
      </div>

      {/* KANAN: Penugasan */}
      <div className="md:col-span-3 rounded-xl border border-default bg-surface overflow-hidden flex flex-col h-full min-h-[300px]">
        <div className="border-b border-border-light bg-surface-soft px-4 py-3 flex items-center justify-between gap-2">
          <h3 className="font-heading text-sm font-bold text-text-primary">Tugaskan ke Murid</h3>
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            {selectedStudents.length} dipilih
          </span>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-1">
          <p className="text-xs text-text-secondary">
            Pilih murid yang akan menerima tugas membaca cerita ini, atau buat tanpa menugaskan siapa pun.
          </p>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari nama murid..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className={`${inputClass} pl-9`}
              />
            </div>
            <button
              type="button"
              onClick={handleSelectAll}
              className="flex items-center justify-center gap-2 rounded-lg border border-border-strong bg-surface-soft px-3 py-2 text-xs font-bold text-text-secondary hover:bg-surface-hover transition-colors shrink-0"
            >
              <span className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selectedStudents.length === students.length && students.length > 0 ? 'bg-brand-primary border-brand-primary text-white' : 'border-text-muted bg-white'}`}>
                {selectedStudents.length === students.length && students.length > 0 && <Check size={10} strokeWidth={3} />}
              </span>
              Pilih Semua ({students.length})
            </button>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {students.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary text-sm py-8">
                <p className="font-bold">Belum ada murid di kelas ini.</p>
                <p className="text-xs mt-1 text-text-muted">Undang murid terlebih dahulu.</p>
              </div>
            ) : currentStudents.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center text-text-secondary text-sm py-8">
                Murid tidak ditemukan.
              </div>
            ) : (
              currentStudents.map(student => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <button
                    type="button"
                    key={student.id}
                    onClick={() => toggleStudent(student.id)}
                    className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-border-light hover:bg-surface-soft'}`}
                  >
                    <span className="min-w-0">
                      <span className="block font-bold text-sm text-text-primary truncate">{student.fullName}</span>
                      <span className="block text-xs text-text-muted truncate">@{student.username}</span>
                    </span>
                    <span className={`w-5 h-5 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-text-muted'}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border-light pt-3 mt-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-border text-text-secondary disabled:opacity-40 hover:bg-surface-soft transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-bold text-text-secondary">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md border border-border text-text-secondary disabled:opacity-40 hover:bg-surface-soft transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
