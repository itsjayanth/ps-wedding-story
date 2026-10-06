'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

/** Masked line reveal: each child line rises out of an overflow-hidden slot. Static under reduced motion. */
export function MaskLines({
  lines,
  className = '',
  lineClassName = '',
  as: Tag = 'span',
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  as?: ElementType;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <Tag className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={reduce ? false : { y: '108%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.5, delay: delay + i * 0.16, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
