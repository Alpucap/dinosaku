'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useAnimate, useReducedMotion, type Variants } from 'framer-motion';
import { Play } from 'lucide-react';

const PURBA_LINES = [
  'Kita belajar bersama, yuk!',
  'Hehe, geli! Ayo mulai misinya!',
  'Tahu nggak? Menabung itu keren!',
  'Setiap misi bikin kamu makin pintar!',
  'Aku siap berpetualang. Kamu?',
];

const copyVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const copyItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 18 } },
};

interface AdventureWelcomeProps {
  name: string;
  ctaHref: string;
  ctaLabel: string;
}

export default function AdventureWelcome({ name, ctaHref, ctaLabel }: AdventureWelcomeProps) {
  const reduceMotion = useReducedMotion();
  const [lineIndex, setLineIndex] = useState(0);
  const [hopScope, animate] = useAnimate();

  const handlePurbaTap = () => {
    setLineIndex((index) => (index + 1) % PURBA_LINES.length);
    if (reduceMotion || !hopScope.current) return;
    animate(
      hopScope.current,
      { y: [0, -36, 0], scaleY: [1, 0.88, 1.06, 1], rotate: [0, -8, 6, 0] },
      { duration: 0.6, ease: 'easeOut' },
    );
  };

  return (
    <motion.header
      className="adventure-welcome"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <motion.div
        className="welcome-copy"
        variants={copyVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
      >
        <motion.p className="eyebrow" variants={copyItem}>
          Halo, {name}!
        </motion.p>
        <motion.h1 variants={copyItem}>
          Petualangan kecil.
          <br />
          <span>Bekal untuk masa depan.</span>
        </motion.h1>
        <motion.p variants={copyItem}>
          Temani Purba menjelajah, belajar mengelola uang, dan mengisi buku pencapaianmu.
        </motion.p>
        <motion.div variants={copyItem} className="w-fit">
          <motion.div whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link href={ctaHref} className="button-primary mt-5 px-6 py-3">
              {ctaLabel}
              <Play size={17} aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="welcome-mascot">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: reduceMotion ? 0 : 0.75 }}
          className="welcome-mascot-bubble relative z-[2]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={lineIndex}
              className="mascot-speech"
              style={{ rotate: 3 }}
              initial={{ opacity: 0, scale: 0.8, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -4 }}
              transition={{ duration: 0.18 }}
              aria-live="polite"
            >
              {PURBA_LINES[lineIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="welcome-mascot-figure"
          initial={reduceMotion ? false : { opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 13, delay: reduceMotion ? 0 : 0.35 }}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          >
            <motion.button
              ref={hopScope}
              type="button"
              onClick={handlePurbaTap}
              whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              className="block w-full cursor-pointer"
              aria-label="Ketuk Purba untuk mendengar pesannya"
              title="Ketuk Purba!"
            >
              <Image src="/mascot/dino.png" alt="Purba, teman petualanganmu" width={230} height={230} priority />
            </motion.button>
          </motion.div>
        </motion.div>

        <span className="mascot-ground" aria-hidden="true" />
      </div>
    </motion.header>
  );
}
