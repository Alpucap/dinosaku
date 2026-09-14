"use client";

import React, { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useParallax } from './hooks/useParallax';

// Layers
import Sky from './layers/Sky';
import Clouds from './layers/Clouds';
import Background from './layers/Background';
import Midground from './layers/Midground';
import Foreground from './layers/Foreground';

interface ParallaxTransitionProps {
  children: React.ReactNode;
}

export default function ParallaxTransition({ children }: ParallaxTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax: bigger Y = slower (stays behind longer)
  const clouds = useParallax(scrollYProgress, { y: [0, 380], scale: [1, 1.02] });
  const background = useParallax(scrollYProgress, { y: [0, 300], scale: [1, 1.03] });
  const midground = useParallax(scrollYProgress, { y: [0, 80], scale: [1, 1.16] });
  const foreground = useParallax(scrollYProgress, { y: [0, -240], scale: [1, 1.6] });

  return (
    <section 
      ref={containerRef} 
      className="relative flex w-full items-center overflow-hidden bg-[#e8f5e9]"
      style={{ minHeight: 'clamp(85vh, 100vw, 130vh)' }}
    >
      {/* 0. Sky */}
      <Sky />

      {/* 1. Clouds */}
      <motion.div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ y: clouds.y, scale: clouds.scale }}
      >
        <Clouds />
      </motion.div>

      {/* 2. Background (Mountains + Distant Trees) */}
      <motion.div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ y: background.y, scale: background.scale, transformOrigin: 'bottom center' }}
      >
        <Background />
      </motion.div>

      {/* 3. Midground (Terrain + Jungle + Ferns + Mascot) */}
      <motion.div 
        className="absolute inset-0 z-[10] pointer-events-none"
        style={{ y: midground.y, scale: midground.scale, transformOrigin: 'bottom center' }}
      >
        <Midground />
      </motion.div>

      {/* 4. Foreground (Extreme Corner Foliage + Vines) */}
      <motion.div 
        className="absolute inset-0 z-[20] pointer-events-none"
        style={{ y: foreground.y, scale: foreground.scale, transformOrigin: 'bottom center' }}
      >
        <Foreground />
      </motion.div>

      {/* Hero text content (HIGHEST z-index so it's always readable) */}
      <div className="relative z-[30] w-full pb-32 md:pb-48 pointer-events-none">
        {/* We enable pointer events just for the children so buttons work */}
        <div className="w-full pointer-events-auto">
          {children}
        </div>
      </div>

      {/* Ground → Features transition */}
      <div className="absolute bottom-[-2px] left-0 right-0 z-[25] pointer-events-none">
        <svg 
          viewBox="0 0 1440 200" 
          preserveAspectRatio="none"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-32 sm:h-40 md:h-56 block"
        >
          {/* Wavy grass top edge */}
          <path 
            d="M0 60 Q120 20 240 40 Q360 60 480 30 Q600 0 720 25 Q840 50 960 20 Q1080 0 1200 30 Q1320 55 1440 35 L1440 200 L0 200 Z" 
            fill="#6abf69"
          />
          {/* Mid tone */}
          <path 
            d="M0 100 Q180 70 360 90 Q540 110 720 80 Q900 50 1080 75 Q1260 100 1440 80 L1440 200 L0 200 Z" 
            fill="#81c784"
          />
          {/* Light green → white blend */}
          <path 
            d="M0 150 Q360 130 720 140 Q1080 150 1440 135 L1440 200 L0 200 Z" 
            fill="#c8e6c9"
          />
          {/* White final fade */}
          <path 
            d="M0 200 Q360 185 720 195 Q1080 200 1440 190 L1440 200 L0 200 Z" 
            fill="#FFFFFF"
          />
        </svg>
      </div>
    </section>
  );
}
