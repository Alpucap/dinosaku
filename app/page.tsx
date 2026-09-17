import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ParallaxTransition from "@/components/hero-parallax/ParallaxTransition";
import SubscriptionCTA from "@/components/SubscriptionCTA";
import SectionWave from "@/components/SectionWave";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import { getSessionUser } from "@/lib/auth/session";
import { getDashboardPath } from "@/lib/constants/roles";
import { BookOpen, LineChart, Mail, MessageCircle, Trophy, UserPlus } from "lucide-react";

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

const steps = [
  {
    icon: UserPlus,
    title: "Daftar & Bergabung",
    description:
      "Buat akun sebagai anak, orang tua, atau guru. Murid bisa langsung masuk ke kelas cukup dengan kode kelas.",
    tint: "bg-brand-primary/10 text-brand-primary",
  },
  {
    icon: BookOpen,
    title: "Berpetualang Lewat Cerita",
    description:
      "Anak membaca komik interaktif bersama Purba tentang menabung, berbagi, dan mengelola uang.",
    tint: "bg-info/10 text-info",
  },
  {
    icon: Trophy,
    title: "Kuis, Poin & Lencana",
    description:
      "Setiap cerita ditutup dengan kuis seru. Poin, lencana, dan papan peringkat bikin anak makin semangat.",
    tint: "bg-warning/10 text-warning",
  },
  {
    icon: LineChart,
    title: "Praktik & Pantau",
    description:
      "Anak berlatih mencatat uang jajan dan menabung untuk impiannya, orang tua dan guru memantau progresnya.",
    tint: "bg-brand-accent/15 text-brand-accent",
  },
];

export default async function Home() {
  const user = await getSessionUser();
  const adventureHref = user ? getDashboardPath(user.role) : "/register";

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
                  <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight text-primary">
                    Berpetualang Sambil <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#064E2B] to-[#98CE36]">
                      Belajar Keuangan
                    </span>
                  </h1>

                  <div className="mt-8 md:mt-12 z-20">
                    <Link
                      href={adventureHref}
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

          <section id="how-it-works" className="scroll-mt-24 py-16 md:py-20 bg-surface-soft relative">
            <div className="container-main max-w-6xl mx-auto">
              <Reveal className="text-center max-w-2xl mx-auto">
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary">
                  Cara Kerja Dinosaku
                </h2>
                <p className="mt-4 text-secondary text-base md:text-lg leading-relaxed">
                  Empat langkah sederhana untuk mulai belajar keuangan dengan cara yang seru.
                </p>
              </Reveal>

              <div role="list" className="mt-10 md:mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {steps.map((step, index) => (
                  <Reveal key={step.title} delay={index * 0.08} className="h-full">
                    <div role="listitem" className="relative h-full rounded-2xl border border-border bg-surface p-6 shadow-card">
                      <span className="absolute right-5 top-5 font-heading text-4xl font-bold text-border-strong">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${step.tint}`}>
                        <step.icon size={24} aria-hidden />
                      </span>
                      <h3 className="mt-5 font-heading text-xl font-bold text-primary">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-secondary">{step.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
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
            below="var(--color-surface-green)"
            variant="a"
          />
        </main>

        <footer id="contact" className="scroll-mt-24 bg-surface-green">
          <Reveal className="container-main max-w-5xl mx-auto py-14 md:py-16">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <Image
                  src="/logo/dinosaku.svg"
                  alt="Dinosaku Logo"
                  width={140}
                  height={40}
                  className="h-9 w-auto object-contain"
                />
                <p className="mt-4 text-sm leading-relaxed text-secondary max-w-xs">
                  Belajar literasi keuangan lewat cerita interaktif bersama Purba, sahabat dinosaurus
                  si kecil.
                </p>
              </div>

              <div className="md:col-span-5">
                <h2 className="font-heading text-lg font-bold text-primary">Punya Pertanyaan?</h2>
                <p className="mt-3 text-sm leading-relaxed text-secondary">
                  Tim kami siap membantu perjalanan petualangan finansial si kecil. Hubungi kami untuk
                  kritik, saran, atau sekadar menyapa Purba.
                </p>
                <ul className="mt-4 space-y-2.5 text-sm">
                  <li>
                    <a
                      href="mailto:halo@dinosaku.com"
                      className="inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"
                    >
                      <Mail size={16} aria-hidden /> halo@dinosaku.com
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/6281234567890"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-semibold text-brand-primary hover:underline"
                    >
                      <MessageCircle size={16} aria-hidden /> WhatsApp +62 812-3456-7890
                    </a>
                  </li>
                </ul>
              </div>

              <div className="md:col-span-3">
                <h2 className="font-heading text-lg font-bold text-primary">Informasi</h2>
                <ul className="mt-3 space-y-2.5 text-sm text-secondary">
                  <li>
                    <Link href="#how-it-works" className="hover:text-primary transition-colors">
                      Cara Kerja
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-primary transition-colors">
                      Kebijakan Privasi
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-primary transition-colors">
                      Syarat & Ketentuan
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 border-t border-border-strong/60 pt-6 text-sm text-muted">
              &copy; {new Date().getFullYear()} Dinosaku. All rights reserved.
            </div>
          </Reveal>
        </footer>
      </div>
    </>
  );
}
