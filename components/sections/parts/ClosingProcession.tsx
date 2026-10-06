'use client';
import { motion, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { Elephant } from '../../ornaments/Elephant';

/** A small, elegant farewell procession: the elephant walks across the foot of the section with scroll. */
export function ClosingProcession({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const left = useTransform(progress, [0.35, 1], ['-34%', '72%']);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden sm:h-44">
      <div className="absolute inset-x-0 bottom-3 h-px bg-gradient-to-r from-transparent via-gold-light/50 to-transparent sm:bottom-5" />
      <motion.div className="absolute bottom-3 w-[11.5rem] text-gold-light sm:bottom-5 sm:w-[19rem]" style={reduce ? { left: '50%', x: '-50%' } : { left }}>
        <Elephant className="block h-auto w-full" animated={!reduce} lit />
      </motion.div>
    </div>
  );
}
