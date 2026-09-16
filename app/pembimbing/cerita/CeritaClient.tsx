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
      await createAndAssignStory(topic, finalTheme, selectedStudents);
      toast.add({ title: "Cerita berhasil dibuat & ditugaskan!", type: 'success' });
      setTopic('');
      setTheme('');
      setSelectedStudents([]);
      const newEnergy = await getTeacherEnergy();
      setEnergy(newEnergy);
      router.refresh();
    } catch (e: any) {
      toast.add({ title: e.message || "Terjadi kesalahan saat membuat cerita", type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loadingInitial) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary w-8 h-8" /></div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* KIRI: Form Cerita */}
      <div className="lg:col-span-7">
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-border shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading text-brand-primary flex items-center gap-2">
              <Sparkles className="text-brand-accent" /> Buat Cerita Baru
            </h2>
            <div className="bg-warning-soft text-warning px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2 border border-warning/20">
              <Zap size={16} className="fill-warning" /> {energy} Energi
            </div>
          </div>

                    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-4 flex gap-3 items-start mb-6">
            <div className="bg-white text-brand-primary p-2 rounded-lg shrink-0 shadow-sm">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-primary">💡 Tips AI</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Kombinasikan topik belajar uang dengan dunia fantasi anak. AI akan meracik cerita petualangan lengkap dengan ilustrasi dan kuis interaktif secara instan!
              </p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-text-secondary">Topik Cerita</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTopic('Menabung untuk beli mainan')} className="text-xs bg-brand-primary/10 text-brand-primary font-bold px-3 py-1.5 rounded-md hover:bg-brand-primary/20 transition-colors">Menabung</button>
                  <button onClick={() => setTopic('Pentingnya berbagi dengan teman')} className="text-xs bg-info/10 text-info font-bold px-3 py-1.5 rounded-md hover:bg-info/20 transition-colors">Berbagi</button>
                  <button onClick={() => setTopic('Menghargai barang milik sendiri')} className="text-xs bg-brand-accent/10 text-brand-accent font-bold px-3 py-1.5 rounded-md hover:bg-brand-accent/20 transition-colors">Menghargai</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Belajar menabung untuk beli sepeda"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-text-secondary">Tema / Latar (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setTheme('Luar Angkasa')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Luar Angkasa</button>
                  <button onClick={() => setTheme('Hutan Ajaib')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Hutan Ajaib</button>
                  <button onClick={() => setTheme('Kerajaan Dinosaurus')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Dinosaurus</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Luar Angkasa, Hutan Ajaib"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <label className="block text-sm font-bold text-text-secondary">Peran / Kostum Purba (Opsional)</label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setCharacter('Astronot')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Astronot</button>
                  <button onClick={() => setCharacter('Detektif')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Detektif</button>
                  <button onClick={() => setCharacter('Ksatria')} className="text-xs bg-surface-soft border border-border text-text-secondary font-bold px-3 py-1.5 rounded-md hover:bg-surface-hover transition-colors">Ksatria</button>
                </div>
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Astronot, Detektif, Pahlawan Super"
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors font-medium text-text-primary"
              />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border mt-auto">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || energy < 1 || !topic || !theme}
              className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={20} /> AI Sedang Meracik Cerita...</>
              ) : (
                <><BookOpen size={20} /> Buat & Tugaskan (1 Energi)</>
              )}
            </button>
            {energy < 1 && (
              <p className="text-center text-sm text-danger mt-3 font-medium">Energi habis! Beralih ke Premium untuk energi ekstra.</p>
            )}
          </div>
        </div>
      </div>

      {/* KANAN: Penugasan */}
      <div className="lg:col-span-5">
        <div className="bg-surface rounded-3xl p-6 md:p-8 border border-border shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading text-brand-primary flex items-center gap-2">
              <Users className="text-info" /> Tugaskan ke Murid
            </h2>
          </div>

          <p className="text-sm text-text-secondary font-medium mb-4">Pilih murid yang akan menerima tugas membaca cerita ini. Anda juga bisa membuatnya tanpa menugaskan siapa pun.</p>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Cari nama murid..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-surface-soft border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-surface-soft rounded-xl border border-border mb-4">
            <span className="text-sm font-bold text-text-primary">Pilih Semua Murid ({students.length})</span>
            <button 
              onClick={handleSelectAll}
              className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${selectedStudents.length === students.length && students.length > 0 ? 'bg-brand-primary border-brand-primary text-white' : 'border-text-muted bg-white'}`}
            >
              {selectedStudents.length === students.length && students.length > 0 && <Check size={14} strokeWidth={3} />}
            </button>
          </div>

          <div className="space-y-2 flex-1">
            {students.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p className="font-bold text-sm">Belum ada murid di kelas ini.</p>
                <p className="text-xs mt-1">Undang murid terlebih dahulu.</p>
              </div>
            ) : currentStudents.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                <p className="font-bold text-sm">Murid tidak ditemukan.</p>
              </div>
            ) : (
              currentStudents.map(student => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <div 
                    key={student.id} 
                    onClick={() => toggleStudent(student.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-text-muted/30 bg-white'}`}
                  >
                    <div>
                      <p className="font-bold text-sm text-text-primary">{student.fullName}</p>
                      <p className="text-xs text-text-muted">@{student.username}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-text-muted'}`}>
                      {isSelected && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
            <p className="text-xs font-bold text-text-muted">
              {selectedStudents.length} dipilih
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1 rounded-md border border-border text-text-secondary disabled:opacity-50 hover:bg-surface-soft"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-text-secondary">
                  {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 rounded-md border border-border text-text-secondary disabled:opacity-50 hover:bg-surface-soft"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
