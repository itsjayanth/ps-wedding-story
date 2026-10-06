'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding, type Version } from '@/content/wedding';
import { Lotus } from '../ornaments';
import { ArchFrame } from './parts/ArchFrame';
import { BlessingVideo } from './parts/BlessingVideo';
import { MaskedHeading } from './parts/MaskedHeading';
import { PullQuote } from './parts/PullQuote';

export function Blessings({ version }: { version: Version }) {
  const b = wedding.blessings;
  const friends = version === 'friends';
  const reduce = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] });
  const frameY = useTransform(scrollYProgress, [0, 1], [36, -36]);
  const glowY = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.9]);
  return (
    <section
      data-section="blessings"
      data-version={version}
      aria-labelledby="blessings-heading"
      className="relative overflow-hidden py-24 pl-10 pr-6 md:px-10 md:py-44"
      style={{ '--mask-bg': '27 20 12', backgroundColor: 'rgb(27 20 12)', color: 'rgb(248 244 232)' } as React.CSSProperties}
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center text-gold-light" aria-hidden="true">
          <Lotus className="mx-auto h-9 w-9 md:h-12 md:w-12" />
        </div>
        <MaskedHeading
          id="blessings-heading"
          text={b.heading}
          className="mt-4 font-serif text-6xl font-normal italic md:text-9xl"
          wordClassName="foil-text"
        />

        <div ref={frameRef} className="relative mx-auto mt-14 w-full max-w-[22rem] md:mt-24 md:max-w-xl">
          <motion.div
            aria-hidden="true"
            style={reduce ? undefined : { y: glowY, scale: glowScale }}
            className="pointer-events-none absolute -inset-16 -z-0 rounded-full opacity-70 blur-2xl md:-inset-28"
          >
            <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgb(216 183 106 / 0.28), transparent)' }} />
          </motion.div>
          <motion.div style={reduce ? undefined : { y: frameY }} className="relative">
            <ArchFrame aspect="3 / 4.2" className="text-gold-light" fillClassName="bg-bronze">
              <BlessingVideo />
            </ArchFrame>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 flex flex-col gap-10 md:mt-28 md:gap-16">
          {b.elders.map((q, i) => (
            <PullQuote key={q.by} {...q} align={i % 2 === 0 ? 'left' : 'right'} />
          ))}
          {friends &&
            b.friends.map((q, i) => <PullQuote key={q.by} {...q} size="md" align={i % 2 === 0 ? 'right' : 'left'} />)}
        </div>
      </div>
    </section>
  );
}
