'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/** One calm, orchestrated reveal per section: fade (and a tiny lift) over ~1.6s. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  duration = 1.6,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
