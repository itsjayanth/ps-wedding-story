'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { SampleTag } from '../../SampleTag';

/** Large Bodoni italic pull-quote with an oversized Pinyon quotation mark; fades and lifts as it crosses the viewport. */
export function PullQuote({
  quote,
  by,
  align = 'center',
  size = 'lg',
}: {
  quote: string;
  by: string;
  align?: 'left' | 'center' | 'right';
  size?: 'lg' | 'md';
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'end 5%'] });
  const opacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [0, 1, 1, 0.2]);
  const y = useTransform(scrollYProgress, [0, 0.3, 1], [48, 0, -24]);
  const markY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const alignCls =
    align === 'left' ? 'md:mr-auto md:text-left' : align === 'right' ? 'md:ml-auto md:text-right' : 'mx-auto text-center';
  const text = size === 'lg' ? 'text-3xl md:text-5xl leading-[1.18]' : 'text-2xl md:text-3xl leading-snug';
  return (
    <motion.figure
      ref={ref}
      style={reduce ? undefined : { opacity, y }}
      className={`thread-mask relative max-w-3xl px-4 pb-4 pt-20 md:pt-28 ${alignCls}`}
    >
      <motion.span
        aria-hidden="true"
        style={reduce ? undefined : { y: markY }}
        className={`foil-text pointer-events-none absolute -top-2 select-none font-serif text-[9rem] leading-none md:-top-6 md:text-[13rem] ${
          align === 'center' ? 'left-1/2 -translate-x-1/2' : align === 'left' ? 'left-2' : 'right-2'
        }`}
      >
        “
      </motion.span>
      <blockquote className={`relative font-serif font-normal italic text-ivory ${text}`}>
        {quote}
        <SampleTag />
      </blockquote>
      <figcaption className={`mt-6 flex items-center gap-4 ${align === 'left' ? 'md:justify-start' : align === 'right' ? 'md:justify-end' : ''} justify-center font-sans text-sm font-light text-gold-light md:text-base`}>
        <span aria-hidden="true" className="gold-rule h-px w-10" />
        {by}
        <span aria-hidden="true" className="gold-rule h-px w-10" />
      </figcaption>
    </motion.figure>
  );
}
