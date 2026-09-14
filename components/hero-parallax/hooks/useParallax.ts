import { MotionValue, useTransform, useReducedMotion } from 'framer-motion';

export interface ParallaxConfig {
  y?: [number | string, number | string];
  scale?: [number, number];
  opacity?: [number, number];
}

/**
 * A custom hook to generate parallax motion values based on a scroll progress value.
 * Handles user preferences for reduced motion by returning static values (or simplified fades)
 * instead of dynamic transformations.
 * 
 * @param scrollProgress The MotionValue representing scroll progress (0 to 1)
 * @param config The start and end values for y, scale, and opacity
 */
export function useParallax(scrollProgress: MotionValue<number>, config: ParallaxConfig) {
  const prefersReducedMotion = useReducedMotion();

  // If the user prefers reduced motion, we disable parallax translations/scaling
  // We can still allow opacity transitions for a smooth fade effect.
  
  const y = useTransform(
    scrollProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : (config.y || [0, 0])
  );

  const scale = useTransform(
    scrollProgress,
    [0, 1],
    prefersReducedMotion ? [1, 1] : (config.scale || [1, 1])
  );

  const opacity = useTransform(
    scrollProgress,
    [0, 1],
    config.opacity || [1, 1]
  );

  return { y, scale, opacity };
}
