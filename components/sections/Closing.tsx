'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding, type Version } from '@/content/wedding';
import { Media } from '../Media';
import { Reveal } from '../Reveal';
import { Lotus } from '../ornaments';
import { ClosingCountdown } from './parts/ClosingCountdown';
import { ClosingProcession } from './parts/ClosingProcession';
import { MaskLines } from './parts/MaskLine';

export function Closing({ version }: { version: Version }) {
  const { closing, couple, celebrations } = wedding;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const photoY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section
      ref={ref}
      data-section="closing"
      data-version={version}
      aria-labelledby="closing-h"
      className="relative isolate overflow-hidden bg-night text-gold-light"
    >
      <motion.div className="absolute -inset-y-[10%] inset-x-0 -z-30" style={reduce ? undefined : { y: photoY, scale: photoScale }}>
        <Media media={closing.photo} sizes="100vw" className="h-full w-full [&_*]:!text-transparent" />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{ background: 'linear-gradient(180deg, rgb(27 20 12 / 0.94) 0%, rgb(27 20 12 / 0.72) 40%, rgb(27 20 12 / 0.82) 75%, rgb(27 20 12 / 0.98) 100%)' }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(55%_38%_at_50%_30%,rgb(216_183_106/0.22),transparent_70%),radial-gradient(60%_30%_at_50%_100%,rgb(184_137_58/0.25),transparent_70%)]" />
      <div aria-hidden="true" className="jali-bg absolute inset-0 -z-10 opacity-[0.05]" />

      <div className="mx-auto flex max-w-5xl flex-col items-center pb-72 pl-10 pr-6 pt-24 text-center sm:pb-96 sm:pt-32">
        <div data-thread-end className="mx-auto h-6 w-0" />

        <Reveal className="mt-10 w-full max-w-3xl" duration={2}>
          <ClosingCountdown
            target={closing.countdownTarget}
            doneLine={closing.doneLine}
            labels={closing.countdownLabels}
            sentence={closing.countdownSentence}
          />
        </Reveal>

        <h2 id="closing-h" className="mt-28 font-serif text-[clamp(2.6rem,8vw,6.8rem)] font-normal italic leading-[1.02] tracking-tight text-ivory sm:mt-40">
          <MaskLines lines={splitLine(closing.line)} />
        </h2>

        <Reveal className="flex flex-col items-center" duration={2}>
          <Lotus className="mt-14 h-9 w-14 text-gold-light/70" />
          <p className="foil-text mt-8 px-4 py-2 font-script text-[clamp(3.4rem,11vw,8rem)] leading-[1.1]">{couple.ampersandNames}</p>
          <p className="mt-8 font-serif text-lg italic text-gold-light/90 sm:text-xl">{closing.farewell}</p>
          <p className="mt-6 max-w-[40ch] text-base text-ivory/85">{closing.wishes}</p>
          {version === 'family' && (
            <div className="mt-12 border-t border-gold-light/30 pt-8">
              <p className="font-serif text-xl italic text-gold-light">{celebrations.awaiting.label}</p>
              <ul className="mt-3 space-y-1 text-base text-ivory/85">
                {celebrations.awaiting.names.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
      <ClosingProcession progress={scrollYProgress} />
    </section>
  );
}

/** Break a sentence into 2-3 balanced lines for the masked reveal. */
function splitLine(s: string): string[] {
  const w = s.split(' ');
  if (w.length < 4) return [s];
  const n = w.length > 6 ? 3 : 2;
  const per = Math.ceil(w.length / n);
  const out: string[] = [];
  for (let i = 0; i < w.length; i += per) out.push(w.slice(i, i + per).join(' '));
  return out;
}
