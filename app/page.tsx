import Link from "next/link";
import Navbar from "@/components/Navbar";
import ParallaxTransition from "@/components/hero-parallax/ParallaxTransition";
import SubscriptionCTA from "@/components/SubscriptionCTA";
import SectionWave from "@/components/SectionWave";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";

const features = [
  {
    title: "Ramah, Seru, Mudah Dipahami",
    mascot: "/mascot/dinosaku-idea.png",
    description:
      "Belajar keuangan melalui cerita dan aktivitas yang menyenangkan serta mudah dipahami anak.",
    tint: "bg-surface-green",
  },
  {
    title: "Belajar Sesuai Kemampuanmu",
    mascot: "/mascot/dino.png",
    description:
      "Materi pembelajaran menyesuaikan kemampuan, kecepatan, dan perkembangan belajar setiap anak.",
    tint: "bg-brand-accent-soft",
  },
  {
    title: "Belajar Kapanpun dan Dimanapun",
    mascot: "/mascot/dino.png",
    description:
      "Akses pembelajaran finansial dengan fleksibel, kapan saja dan di mana saja.",
    tint: "bg-brand-secondary/30",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-app text-primary overflow-x-hidden">
        <main className="flex-1">
          {/* PARALLAX PORTAL TRANSITION (Wraps Hero) */}
          <ParallaxTransition>
            <div className="container-main relative z-10 w-full">
              <div className="flex flex-col items-center justify-center text-center">
                {/* Text & CTA */}
                <Reveal className="max-w-3xl mx-auto flex flex-col items-center">
                  <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-primary">
                    Berpetualang Sambil <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#064E2B] to-[#98CE36]">
                      Belajar Keuangan
                    </span>
                  </h1>

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
                <Link href="/learn" className="button-primary px-8 py-4 w-full sm:w-auto text-lg shadow-card">
                  Baca Koleksi Cerita
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
                <Link href="/learn/create" className="button-secondary px-8 py-4 w-full sm:w-auto text-lg">
                  Buat Cerita AI Baru
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
          </ParallaxTransition>

          {/* FEATURES SECTION */}
          <section
            id="fitur"
            className="scroll-mt-24 pt-12 pb-24 md:pt-16 md:pb-24 bg-surface relative"
          >
            <div className="container-main">
              <div className="max-w-5xl mx-auto flex flex-col gap-20 md:gap-28">
                {features.map((feature, index) => {
                  const mascotFirst = index % 2 === 1;

                  return (
                    <div
                      key={feature.title}
                      className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
                    >
                      <Reveal
                        className={mascotFirst ? "md:order-1" : "md:order-2"}
                        from={mascotFirst ? "left" : "right"}
                      >
                        <Parallax offset={110}>
                          <div
                            className={`mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-full sm:max-w-[300px] md:max-w-[360px] ${
                              mascotFirst
                                ? "md:ml-0 md:mr-auto"
                                : "md:ml-auto md:mr-0"
                            } ${feature.tint}`}
                          >
                            <Parallax offset={-45} className="w-[85%]">
                              <Image
                                src={feature.mascot}
                                alt=""
                                aria-hidden
                                width={1254}
                                height={1254}
                                sizes="(max-width: 768px) 60vw, 320px"
                                className={`w-full h-auto drop-shadow-lg ${mascotFirst ? "" : "scale-x-[-1]"}`}
                              />
                            </Parallax>
                          </div>
                        </Parallax>
                      </Reveal>

                      <Reveal
                        className={`md:max-w-md ${
                          mascotFirst ? "md:order-2 md:ml-auto" : "md:order-1"
                        }`}
                        from={mascotFirst ? "right" : "left"}
                        delay={0.12}
                      >
                        <Parallax offset={-35}>
                          <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary">
                            {feature.title}
                          </h3>
                          <p className="text-secondary text-lg leading-relaxed mt-3">
                            {feature.description}
                          </p>
                        </Parallax>
                      </Reveal>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <SectionWave
            above="bg-surface"
            below="var(--color-surface-soft)"
            variant="a"
          />

          {/* SUBSCRIPTION CTA SECTION */}
          <SubscriptionCTA />

          <SectionWave
            above="bg-surface-soft"
            below="var(--color-surface)"
            variant="b"
          />
        </main>

        {/* FOOTER */}
        <footer id="kontak" className="scroll-mt-24 bg-surface py-12">
          <Reveal className="container-main max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Image
                src="/logo/dinosaku.svg"
                alt="Dinosaku Logo"
                width={140}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div className="flex gap-6 text-sm text-secondary">
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Syarat & Ketentuan
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Hubungi Kami
              </Link>
            </div>
            <p className="text-sm text-muted">
              &copy; {new Date().getFullYear()} Dinosaku. All rights reserved.
            </p>
          </Reveal>
        </footer>
      </div>
    </>
  );
}
