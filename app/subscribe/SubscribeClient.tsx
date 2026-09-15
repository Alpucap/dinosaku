'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, ShieldCheck, Zap, Users, GraduationCap, Building2 } from 'lucide-react';

export default function SubscribeClient() {
  const [planType, setPlanType] = useState<'b2c' | 'b2b'>('b2c');

  return (
    <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="font-heading text-4xl font-bold text-text-primary mb-4">
          Investasi Terbaik untuk <span className="text-brand-primary">Masa Depan Finansial</span>
        </h1>
        <p className="text-text-secondary text-lg">
          Akses tak terbatas ke cerita AI edukatif, kuis pintar, dan dasbor analitik. Pilih paket yang paling sesuai untuk Anda.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-surface-soft p-1 rounded-full inline-flex relative shadow-inner">
          <button
            onClick={() => setPlanType('b2c')}
            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${planType === 'b2c' ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Keluarga & Orang Tua
          </button>
          <button
            onClick={() => setPlanType('b2b')}
            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${planType === 'b2b' ? 'text-white' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Guru & Sekolah
          </button>
          
          <div 
            className={`absolute top-1 bottom-1 w-[50%] bg-brand-primary rounded-full transition-transform duration-300 ease-out shadow-sm`}
            style={{ transform: planType === 'b2b' ? 'translateX(98%)' : 'translateX(0)' }}
          />
        </div>
      </div>

      {planType === 'b2c' ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border border-border-strong rounded-3xl p-8 bg-white flex flex-col">
            <div className="mb-8">
              <h3 className="font-bold text-text-secondary text-xl mb-2">Paket Penjelajah</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-text-primary">Gratis</span>
              </div>
              <p className="text-sm text-text-secondary mt-3">Cocok untuk mencoba petualangan awal Dinosaku.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Akses 2 Misi Petualangan Pertama</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Dasbor Pembimbing (Dasar)</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">1 Profil Anak</span></li>
              <li className="flex items-start gap-3 opacity-50"><X className="text-error shrink-0" size={20} /> <span className="text-text-secondary">Generate Cerita AI Tak Terbatas</span></li>
              <li className="flex items-start gap-3 opacity-50"><X className="text-error shrink-0" size={20} /> <span className="text-text-secondary">Fitur Target Tabungan & Penugasan</span></li>
            </ul>
            
            <Link href="/register" className="w-full py-4 rounded-xl border-2 border-border-strong font-bold text-center text-text-primary hover:bg-surface-soft transition-colors">
              Mulai Gratis
            </Link>
          </div>

          <div className="border-2 border-brand-primary rounded-3xl p-8 bg-white flex flex-col relative shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Zap size={14} /> Paling Populer
            </div>
            <div className="mb-8">
              <h3 className="font-bold text-brand-primary text-xl mb-2">Keluarga Premium</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-text-primary">Rp 149.000</span>
                <span className="text-text-secondary font-semibold">/ bulan</span>
              </div>
              <p className="text-sm text-text-secondary mt-3">Investasi ideal untuk mengasah literasi finansial anak sejak dini.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary font-bold">30 Koin Petualangan AI / Bulan</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Ortu bisa atur jatah koin harian anak</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Fitur Target Tabungan & Penugasan Lengkap</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Laporan Belajar AI Mingguan</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Hingga 3 Profil Anak</span></li>
            </ul>
            
            <button className="w-full py-4 rounded-xl bg-brand-primary text-white font-bold text-center hover:bg-brand-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2">
              Langganan Sekarang <ArrowRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="border border-border-strong rounded-3xl p-8 bg-white flex flex-col">
            <div className="mb-8">
              <h3 className="font-bold text-text-secondary text-xl mb-2 flex items-center gap-2"><GraduationCap size={24} /> Paket Kelas</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-text-primary">Rp 990.000</span>
                <span className="text-text-secondary font-semibold">/ bulan</span>
              </div>
              <p className="text-sm text-text-secondary mt-3">Sempurna untuk guru yang ingin memantau literasi satu kelas.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary font-bold">250 Koin AI (Sistem Jatah per Murid)</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Lisensi Premium hingga 30 Murid</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Dasbor Guru (Analitik Kelas Lengkap)</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Beri Tugas (Misi Khusus) Serentak</span></li>
            </ul>
            
            <button className="w-full py-4 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-center hover:bg-brand-primary/10 transition-colors">
              Mulai Kelas
            </button>
          </div>

          <div className="border-2 border-brand-accent rounded-3xl p-8 bg-white flex flex-col relative shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-accent text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck size={14} /> Institusi
            </div>
            <div className="mb-8">
              <h3 className="font-bold text-brand-accent text-xl mb-2 flex items-center gap-2"><Building2 size={24} /> Paket Sekolah</h3>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-text-primary">Hubungi Kami</span>
              </div>
              <p className="text-sm text-text-secondary mt-3">Lisensi tak terbatas untuk seluruh murid dalam satu sekolah.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary font-bold">Lisensi Premium Tak Terbatas</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Dukungan Implementasi Langsung</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Integrasi Kurikulum & Topik Kustom</span></li>
              <li className="flex items-start gap-3"><Check className="text-success shrink-0" size={20} /> <span className="text-text-primary">Manajemen Banyak Guru (Super Admin)</span></li>
            </ul>
            
            <button className="w-full py-4 rounded-xl bg-brand-accent text-white font-bold text-center hover:bg-brand-accent/90 transition-colors shadow-sm flex items-center justify-center gap-2">
              Hubungi Tim Penjualan
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
