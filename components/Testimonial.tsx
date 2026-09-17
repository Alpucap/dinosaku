'use client';
import { Star } from 'lucide-react';
import Reveal from './Reveal';

const testimonials = [
  {
    name: "Bunda Riri",
    role: "Ibu anak usia 7 tahun",
    content: "Dulu anak saya susah banget disuruh baca. Sejak pakai Dinosaku, dia malah nagih minta dibikinin komik baru tiap hari. Sistem tabungan impiannya sukses bikin dia rajin ngerjain misi!",
    avatar: "R"
  },
  {
    name: "Pak Dimas",
    role: "Guru SD Kelas 2",
    content: "Fitur 'Paket Kelas' benar-benar mengubah cara saya mengajar. Saya bisa membagikan cerita edukatif yang disesuaikan dengan kurikulum minggu ini dengan 2 klik. Dasbor analitik kelasnya juara!",
    avatar: "D"
  },
  {
    name: "Mama Kenzo",
    role: "Ibu 2 anak",
    content: "Awalnya ragu karena takut gambar AI-nya aneh. Ternyata sangat aman dan memukau! Ceritanya mendidik dan yang terpenting: layar anak benar-benar bebas dari iklan maupun tombol beli tidak sengaja.",
    avatar: "M"
  },
  {
    name: "Bu Sarah",
    role: "Guru TK",
    content: "Anak-anak sangat suka visual dari Purba. Sebagai guru, saya sangat terbantu membuat materi pengenalan angka dan huruf lewat cerita petualangan yang interaktif.",
    avatar: "S"
  },
  {
    name: "Ayah Budi",
    role: "Ayah 1 anak",
    content: "Paling suka fitur analitiknya. Saya jadi tahu minat baca anak saya ke arah mana, dan bisa mengatur batas waktu harian agar tidak berlebihan menatap layar.",
    avatar: "B"
  }
];

// Gandakan array agar animasinya bisa loop tanpa batas
const duplicatedTestimonials = [...testimonials, ...testimonials];

export default function Testimonial() {
  return (
    <section className="bg-surface pt-10 pb-16 relative overflow-hidden">
      <div className="container-main max-w-6xl mx-auto relative px-4 md:px-8">
        <Reveal className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">Kata Mereka Tentang Dinosaku</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">Telah menemani para orang tua dan guru dalam membangun kebiasaan literasi dan kemandirian finansial anak.</p>
        </Reveal>
      </div>

      {/* Marquee Container */}
      <div className="relative flex overflow-hidden group w-full py-4">
        {/* Latar gradasi untuk memudarkan pinggiran (opsional tapi bagus) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-6 animate-infinite-scroll group-hover:[animation-play-state:paused] w-max px-4">
          {duplicatedTestimonials.map((testi, i) => (
            <div key={i} className="w-[300px] md:w-[380px] shrink-0">
              <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgb(0,0,0,0.06)] border border-border-light h-full flex flex-col transition-transform hover:-translate-y-1 duration-300">
                <div className="flex text-amber-400 mb-6 gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={20} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="text-secondary leading-relaxed mb-8 flex-1 text-[0.95rem]">
                  "{testi.content}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold text-xl font-heading shrink-0">
                    {testi.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-primary">{testi.name}</p>
                    <p className="text-sm text-muted">{testi.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes infinite-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); } /* -50% dari total panjang, -12px setengah gap */
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 35s linear infinite;
        }
      `}} />
    </section>
  );
}
