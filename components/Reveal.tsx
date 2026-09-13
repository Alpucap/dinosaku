"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const offsets = {
  bottom: { x: 0, y: 28 },
  left: { x: -40, y: 0 },
  right: { x: 40, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  from?: keyof typeof offsets;
  delay?: number;
  className?: string;
};

export default function Reveal({
  children,
  from = "bottom",
  delay = 0,
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset = reduceMotion ? { x: 0, y: 0 } : offsets[from];

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
