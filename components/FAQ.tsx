'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    q: "Apakah AI-nya aman? Bagaimana jika AI menampilkan gambar atau cerita yang tidak pantas?",
    a: "Keamanan anak adalah prioritas utama kami. Sistem AI Dinosaku tidak menerima perintah langsung dari anak. Semua pembuatan cerita dikendalikan oleh Guru/Orang Tua melalui 'sistem prompt internal' kami yang sangat ketat untuk memblokir unsur kekerasan, kata kasar, maupun konten dewasa."
  },
  {
    q: "Apakah ini akan membuat anak saya kecanduan main gadget?",
    a: "Dinosaku didesain dengan konsep 'Micro-Learning'. Satu misi cerita komik hanya memakan waktu 5-10 menit untuk diselesaikan. Selain itu, orang tua dapat mengatur kuota mingguan dan menjadikan gadget sebagai alat produktif pembangun kebiasaan literasi, bukan sekadar hiburan kosong."
  },
  {
    q: "Apakah ada risiko anak menekan tombol beli (In-App Purchases) secara tidak sengaja?",
    a: "Tidak ada. Semua aktivitas transaksi, langganan, dan pembelian Energi AI terkunci secara eksklusif di dalam Dasbor Pembimbing yang dikelola langsung oleh Anda. Layar anak 100% bersih dari iklan (Ad-Free) dan tombol pembelian."
  },
  {
    q: "Anak saya malas membaca buku teks. Apakah komik ini benar-benar efektif?",
    a: "Tentu! Metode gamifikasi (seperti mengumpulkan koin dan lencana) dipadukan dengan format komik bergambar terbukti sangat ampuh memancing minat baca anak yang visual atau mudah bosan. Anak tidak merasa sedang 'belajar', melainkan sedang 'bertualang'."
  },
  {
    q: "Bagaimana sistem tabungan impiannya bekerja? Apakah memotong uang betulan?",
    a: "Sistem tabungan di Dinosaku sepenuhnya menggunakan 'poin/uang virtual' sebagai alat simulasi (bukan uang sungguhan). Anak termotivasi mengerjakan soal demi mengumpulkan koin, dan orang tua akan memberikan hadiah fisik/aslinya di dunia nyata ketika target tabungan virtual tersebut tercapai."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-24 pt-20 pb-20 bg-surface-soft relative">
      <div className="container-main max-w-3xl mx-auto">
        <Reveal className="text-center mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">Pertanyaan Seputar Dinosaku</h2>
          <p className="text-secondary text-lg">Jawaban dari pertanyaan yang sering diajukan oleh orang tua dan guru.</p>
        </Reveal>

        <Reveal className="space-y-4" delay={0.1}>
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-border-strong overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="font-bold text-primary text-[1.05rem]">{faq.q}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-brand-primary shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 pt-1 text-secondary leading-relaxed border-t border-border-light mt-1">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
