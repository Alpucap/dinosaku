import Image from "next/image";
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

                  <div className="mt-4 md:mt-12 z-20">
                    <Link
                      href="/register"
                      className="button-primary px-8 py-4 text-lg w-fit shadow-card flex items-center justify-center rounded-full"
                    >
                      Berpetualang Sekarang
                    </Link>
                  </div>
                </Reveal>
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

          {/* ABOUT US SECTION */}
          <section id="about" className="scroll-mt-24 pt-20 pb-20 bg-surface-soft relative">
            <div className="container-main max-w-4xl mx-auto text-center">
              <Reveal>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Tentang Dinosaku</h2>
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card border-4 border-border-strong text-left md:text-center">
                  <p className="text-secondary text-lg leading-relaxed mb-6">
                    Mengenalkan konsep keuangan pada anak seringkali terasa membosankan dan sulit dipahami. 
                    Berangkat dari keresahan tersebut, <strong>Dinosaku</strong> hadir untuk mengubah cara anak belajar tentang uang!
                  </p>
                  <p className="text-secondary text-lg leading-relaxed">
                    Melalui bantuan asisten AI canggih, kami meracik materi literasi finansial menjadi sebuah komik interaktif yang seru. 
                    Ditemani oleh <strong>Purba</strong> sang dinosaurus hijau yang menggemaskan, anak-anak kini bisa bertualang sambil menyerap ilmu mengelola uang sejak usia dini. 
                    Misi kami adalah mempersiapkan generasi masa depan yang melek finansial, satu cerita dalam satu waktu.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <SectionWave
            above="bg-surface-soft"
            below="var(--color-surface)"
            variant="b"
          />

          {/* SUBSCRIPTION CTA SECTION */}
          <SubscriptionCTA />

          <SectionWave
            above="bg-surface"
            below="var(--color-surface-soft)"
            variant="a"
          />

          {/* CONTACT SECTION */}
          <section id="contact" className="scroll-mt-24 pt-16 pb-24 bg-surface-soft relative">
            <div className="container-main max-w-5xl mx-auto">
              <Reveal className="bg-brand-primary text-white rounded-[3rem] p-10 md:p-16 shadow-modal text-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-accent/30 rounded-full blur-2xl"></div>
                <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 relative z-10">Punya Pertanyaan?</h2>
                <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                  Tim kami selalu siap membantu perjalanan petualangan finansial si kecil. Jangan ragu untuk menghubungi kami jika ada kritik, saran, atau sekadar ingin menyapa Purba!
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 relative z-10">
                  <a href="mailto:halo@dinosaku.com" className="button-accent px-8 py-4 font-bold text-lg rounded-full w-full md:w-auto shadow-card">
                    Email Kami
                  </a>
                  <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="bg-white text-brand-primary hover:bg-gray-100 px-8 py-4 font-bold text-lg rounded-full w-full md:w-auto shadow-card transition-colors border-4 border-transparent">
                    WhatsApp
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

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
