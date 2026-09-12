import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-app text-primary overflow-x-hidden">

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10 bg-surface-soft opacity-50" />
          <div 
            className="absolute top-20 left-10 w-64 h-64 bg-brand-secondary rounded-full mix-blend-multiply filter blur-3xl opacity-30" 
            style={{ animation: 'floatShape 8s ease-in-out infinite' }}
          />
          <div 
            className="absolute top-40 right-20 w-72 h-72 bg-brand-accent rounded-full mix-blend-multiply filter blur-3xl opacity-30" 
            style={{ animation: 'floatShape 10s ease-in-out infinite reverse' }}
          />

          <div className="container-main grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8 text-center lg:text-left z-10">
              
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-primary">
                Berpetualang Sambil <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#064E2B] to-[#98CE36]">
                  Belajar Keuangan
                </span>
              </h1>
              

              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/register" className="button-primary px-8 py-4 w-full sm:w-auto text-lg shadow-card">
                  Berpetualang Sekarang 
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <Link href="/learn" className="button-secondary px-8 py-4 w-full sm:w-auto text-lg">
                  Main Game Cerita AI
                </Link>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-muted mt-4">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-surface bg-border-light shadow-sm" />
                  ))}
                </div>
                <p>Telah digunakan oleh 10.000+ pengguna</p>
              </div>
            </div>
            
            <div className="relative flex justify-center items-center z-10 mt-10 lg:mt-0">
              <div className="relative w-full max-w-[450px] aspect-square">
                {/* Pulse rings */}
                <div className="absolute inset-0 bg-brand-accent-soft rounded-full" style={{ animation: 'pulseRing 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
                <div className="absolute inset-4 bg-surface-green rounded-full shadow-soft" style={{ animation: 'pulseRing 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1s' }} />
                
                {/* Mascot Video */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <video 
                    src="/mascot/dinosaku-hero.webm" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full max-w-[450px] object-contain drop-shadow-2xl z-10 gpu-layer"
                  />
                  {/* Shadow under mascot */}
                  <div 
                    className="w-56 h-6 bg-black/20 rounded-[100%] filter blur-md mt-4"
                    style={{ animation: 'mascotShadow 4s ease-in-out infinite' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 bg-surface relative border-y border-default">
          <div className="container-main">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4">
                Fitur Unggulan Dinosaku
              </h2>
              <p className="text-secondary text-lg">
                Semua yang kamu butuhkan untuk mengelola keuangan dengan mudah, aman, dan menyenangkan.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card card-hover p-8 flex flex-col items-start gap-4 bg-background">
                <div className="w-14 h-14 rounded-2xl bg-success-soft flex items-center justify-center text-success mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">Catat Pengeluaran</h3>
                <p className="text-secondary leading-relaxed">
                  Catat setiap pemasukan dan pengeluaranmu dengan mudah. Ketahui kemana saja uangmu pergi setiap bulannya.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="card card-hover p-8 flex flex-col items-start gap-4 bg-background">
                <div className="w-14 h-14 rounded-2xl bg-info-soft flex items-center justify-center text-info mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">Target Tabungan</h3>
                <p className="text-secondary leading-relaxed">
                  Buat target tabungan untuk barang impianmu. Dinosaku akan membantumu melacak progres hingga tercapai!
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="card card-hover p-8 flex flex-col items-start gap-4 bg-background">
                <div className="w-14 h-14 rounded-2xl bg-warning-soft flex items-center justify-center text-warning mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 className="font-heading text-xl font-bold text-primary">Aman & Terlindungi</h3>
                <p className="text-secondary leading-relaxed">
                  Data keuanganmu dienkripsi dan disimpan dengan aman. Hanya kamu yang memiliki akses penuh ke catatanmu.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#064E2B]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl" />
          
          <div className="container-main relative z-10 text-center flex flex-col items-center">
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Menjadi Pahlawan Finansialmu?
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-10">
              Bergabung dengan ribuan teman lainnya yang sudah mulai mengelola uang saku mereka dengan lebih pintar bersama Dinosaku.
            </p>
            <Link href="/register" className="button-accent px-10 py-5 text-lg shadow-modal rounded-xl">
              Buat Akun Gratis Sekarang
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-surface py-12">
        <div className="container-main flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-heading font-bold text-xl text-primary">
              Dinosaku
            </span>
          </div>
          <div className="flex gap-6 text-sm text-secondary">
            <Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Hubungi Kami</Link>
          </div>
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Dinosaku. All rights reserved.
          </p>
        </div>
      </footer>
      </div>
    </>
  );
}
