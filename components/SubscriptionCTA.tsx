"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";

function ComicPanel() {
  const [choice, setChoice] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative rounded-2xl rounded-bl-md bg-surface-green p-4">
        <p className="text-body text-primary">
          Uang sakumu tinggal <strong>Rp5.000</strong>. Stikernya lucu banget,
          tapi tabunganmu kurang sedikit lagi. Kamu pilih yang mana?
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Beli stikernya", "Tabung dulu"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setChoice(option)}
            className={`rounded-full border-2 px-5 py-2.5 text-label transition-all duration-200 active:scale-95 ${
              choice === option
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-border-strong bg-surface text-secondary hover:-translate-y-0.5 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {choice && (
          <motion.p
            key={choice}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-small text-secondary"
          >
            {choice === "Tabung dulu"
              ? "Keren! Ceritamu lanjut ke bab menabung."
              : "Boleh kok! Tapi targetmu jadi mundur seminggu."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const missions = [
  "Catat jajanmu hari ini",
  "Sisihkan Rp2.000 ke celengan",
  "Pilih satu barang jadi targetmu",
];

function MissionPanel() {
  const [done, setDone] = useState<number[]>([0]);

  const toggle = (index: number) =>
    setDone((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index],
    );

  const allDone = done.length === missions.length;

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col gap-1.5">
        {missions.map((mission, index) => {
          const checked = done.includes(index);
          return (
            <li key={mission}>
              <button
                type="button"
                onClick={() => toggle(index)}
                className="group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors hover:bg-surface-green"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                    checked
                      ? "border-brand-primary bg-brand-primary"
                      : "border-border-strong bg-surface group-hover:border-brand-accent"
                  }`}
                >
                  <motion.svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-white"
                    initial={false}
                    animate={{ scale: checked ? 1 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  >
                    <path d="m5 12 5 5L20 7" />
                  </motion.svg>
                </span>
                <span
                  className={`text-body transition-colors ${
                    checked ? "text-muted line-through" : "text-primary"
                  }`}
                >
                  {mission}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-brand-accent-soft px-4 py-3">
              <motion.span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-accent text-brand-primary"
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 420,
                  damping: 14,
                  delay: 0.12,
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
              </motion.span>
              <div>
                <p className="text-label text-brand-primary">
                  Semua misi selesai!
                </p>
                <p className="text-small text-secondary">
                  Pialamu hari ini sudah dikantongi.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SavingPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-4 pt-1">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-caption text-muted">Targetmu</p>
          <p className="font-heading text-xl font-bold text-primary">
            Sepatu bola
          </p>
        </div>
        <p className="font-heading text-3xl font-bold text-brand-primary">
          65%
        </p>
      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-brand-accent-soft">
        <motion.div
          className="h-full rounded-full bg-brand-accent"
          initial={{ width: reduceMotion ? "65%" : 0 }}
          animate={{ width: "65%" }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-small">
        <span className="text-secondary">
          Terkumpul <strong className="text-primary">Rp162.500</strong> dari
          Rp250.000
        </span>
        <span className="rounded-full bg-brand-accent-soft px-3 py-1 text-caption font-semibold text-brand-primary">
          +Rp2.000 hari ini
        </span>
      </div>
    </div>
  );
}

const chapters = [
  {
    id: "komik",
    title: "Baca komik, pilih sendiri",
    blurb: "Kamu yang menentukan keputusan uang di ceritanya.",
    bubble: "Kamu yang pilih ceritanya!",
    icon: (
      <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    ),
    panel: <ComicPanel />,
  },
  {
    id: "misi",
    title: "Selesaikan misi harian",
    blurb: "Tugas kecil yang bisa kamu lakukan hari ini juga.",
    bubble: "Centang misimu, yuk!",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </>
    ),
    panel: <MissionPanel />,
  },
  {
    id: "tabungan",
    title: "Kumpulkan target tabungan",
    blurb: "Lihat celenganmu penuh sedikit demi sedikit.",
    bubble: "Tabunganmu makin penuh!",
    icon: (
      <>
        <path d="M4 12a7 7 0 0 1 7-7h3a7 7 0 0 1 7 7v3a2 2 0 0 1-2 2h-1v2h-3v-2h-4v2H8v-2.6A7 7 0 0 1 4 15z" />
        <path d="M4 11H3a2 2 0 0 1 0-4h1" />
        <circle cx="16" cy="11" r="1" />
      </>
    ),
    panel: <SavingPanel />,
  },
];

export default function SubscriptionCTA() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % chapters.length),
      7000,
    );
    return () => window.clearTimeout(timer);
  }, [active, paused, reduceMotion]);

  const current = chapters[active];

  return (
    <section
      id="langganan"
      className="scroll-mt-24 bg-surface py-20 md:py-28"
    >
      <div className="container-main max-w-5xl grid items-center gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <Reveal from="left">
          <h2 className="font-heading text-3xl font-bold leading-[1.15] text-primary md:text-4xl lg:text-[2.75rem]">
            Mulai petualanganmu{" "}
            <span className="relative inline-block">
              hari ini
              <motion.svg
                viewBox="0 0 220 14"
                preserveAspectRatio="none"
                className="absolute -bottom-1.5 left-0 h-3 w-full"
                aria-hidden
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                <motion.path
                  d="M3 9C45 3 90 3 130 6.5S195 11 217 5"
                  fill="none"
                  stroke="var(--color-brand-accent)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: { pathLength: 1, opacity: 1 },
                  }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                />
              </motion.svg>
            </span>
          </h2>

          <p className="mt-6 max-w-lg text-body text-secondary md:text-lg">
            Semua komik, misi, dan tantangan Dinosaku terbuka untukmu. Pilih
            salah satu di bawah ini, kamu bisa langsung mencobanya sekarang.
          </p>

          <div
            role="tablist"
            aria-label="Isi langganan Dinosaku"
            className="mt-8 flex flex-col gap-1"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            {chapters.map((chapter, index) => {
              const isActive = index === active;
              return (
                <button
                  key={chapter.id}
                  type="button"
                  role="tab"
                  id={`chapter-tab-${chapter.id}`}
                  aria-selected={isActive}
                  aria-controls={`chapter-panel-${chapter.id}`}
                  onClick={() => setActive(index)}
                  className="group relative flex items-start gap-4 rounded-2xl px-4 py-3.5 text-left"
                >
                  {isActive && (
                    <motion.span
                      layoutId="chapter-highlight"
                      className="absolute inset-0 rounded-2xl bg-surface-soft"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 34,
                      }}
                    />
                  )}

                  <span
                    className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-200 ${
                      isActive
                        ? "bg-brand-primary text-white"
                        : "bg-brand-accent-soft text-brand-primary group-hover:scale-110"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                      aria-hidden
                    >
                      {chapter.icon}
                    </svg>
                  </span>

                  <span className="relative">
                    <span className="block text-label text-primary">
                      {chapter.title}
                    </span>
                    <span className="block text-small text-secondary">
                      {chapter.blurb}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
            <Link
              href="/subscribe"
              className="button-primary group w-full rounded-full px-8 py-4 text-lg shadow-card transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Coba 1 Bulan Gratis
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <p className="text-small text-muted">Bisa dibatalkan kapan saja.</p>
          </div>
        </Reveal>

        <Reveal
          from="right"
          delay={0.12}
          className="relative mx-auto w-full max-w-md lg:max-w-none lg:pl-12"
        >
          <Parallax offset={75}>
            <div className="rounded-3xl border border-border-light bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-dropdown sm:p-8">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-border-light pb-4">
                <p className="text-label text-primary">{current.title}</p>
                <div className="flex items-center gap-1.5" aria-hidden>
                  {chapters.map((chapter, index) => (
                    <span
                      key={chapter.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === active
                          ? "w-5 bg-brand-accent"
                          : "w-1.5 bg-border-strong"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    id={`chapter-panel-${current.id}`}
                    role="tabpanel"
                    aria-labelledby={`chapter-tab-${current.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    {current.panel}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-end gap-2 border-t border-border-light pt-2">
                <Image
                  src="/mascot/dino.png"
                  alt=""
                  width={1254}
                  height={1254}
                  sizes="150px"
                  aria-hidden
                  className="float-slow -mb-8 w-28 shrink-0 drop-shadow-lg sm:-mb-10 sm:w-32"
                />
                <div className="relative mb-4 flex-1 rounded-2xl rounded-bl-md bg-surface-green px-4 py-2.5">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={current.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="text-small font-semibold text-brand-primary"
                    >
                      {current.bubble}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}
