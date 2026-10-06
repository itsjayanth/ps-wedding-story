'use client';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Hairline gold reading-progress bar fixed to the top edge. */
export function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[2px] origin-left"
      style={{ scaleX, background: 'linear-gradient(90deg, #8a6425, #f3e0a2, #b8893a)', boxShadow: '0 0 8px rgb(216 183 106 / 0.6)' }}
    />
  );
}
