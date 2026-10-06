'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/content/wedding';
import { useEntry } from './entry/context';
import { Media } from './Media';

const HOLD_MS = 6000;
const FADE_S = 2.4;
const EASE = [0.22, 0.61, 0.36, 1] as const;
const FOIL = 'linear-gradient(100deg, #c9a04e 0%, #ecd597 40%, #d8b76a 62%, #f1e0ad 100%)';

export function Hero() {
  const { entered } = useEntry();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const slides = wedding.hero_media.slides;
  const [index, setIndex] = useState(0);
  const [videoOk, setVideoOk] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['0%', '12%']);

  useEffect(() => {
    if (!entered || reduce || slides.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [entered, reduce, slides.length]);

  // Optional video: deferred until idle, skipped for reduced motion / Save-Data.
  useEffect(() => {
    if (!entered || reduce) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (h: number) => void };
    let h: number;
    const go = () => setVideoOk(true);
    if (w.requestIdleCallback) h = w.requestIdleCallback(go, { timeout: 3000 });
    else h = window.setTimeout(go, 1500);
    return () => (w.cancelIdleCallback ? w.cancelIdleCallback(h) : window.clearTimeout(h));
  }, [entered, reduce]);

  const show = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: entered ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.6, delay: reduce ? 0 : delay, ease: EASE },
  } as const);

  return (
    <section ref={ref} data-section="hero" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-bronze text-ivory">
      <motion.div className="absolute -inset-y-[7%] inset-x-0 -z-30" style={{ y }}>
        {slides.map((s, i) => (
          <motion.div
            key={s.src}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : FADE_S, ease: 'easeInOut' }}
          >
            <Media media={s} sizes="100vw" priority={i === 0} className="h-full w-full [&_p]:hidden" />
          </motion.div>
        ))}
        {videoOk && (
          <video
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[2400ms]"
            style={{ opacity: videoPlaying ? 1 : 0 }}
            src={wedding.hero_media.video.src}
            poster={wedding.hero_media.video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            onPlaying={() => setVideoPlaying(true)}
            onError={() => setVideoOk(false)}
          />
        )}
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ background: 'linear-gradient(180deg, rgb(42 31 20 / 0.82) 0%, rgb(42 31 20 / 0.74) 45%, rgb(42 31 20 / 0.9) 100%)' }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center pt-safe pb-safe">
        <motion.p {...show(1.2)} className="mt-6 font-serif text-lg text-ivory sm:text-xl">
          {wedding.hero.blessing}
        </motion.p>

        <motion.h1 {...show(1.8)} className="mt-6 font-serif font-light leading-[0.95] tracking-tight" aria-label={wedding.couple.ampersandNames}>
          <span aria-hidden className="foil-text block text-[clamp(3.5rem,16vw,8.5rem)]" style={{ backgroundImage: FOIL }}>
            {wedding.couple.groom.short}
          </span>
          <span aria-hidden className="block py-1 font-serif text-3xl italic text-gold-light sm:text-4xl">&amp;</span>
          <span aria-hidden className="foil-text block text-[clamp(3.5rem,16vw,8.5rem)]" style={{ backgroundImage: FOIL }}>
            {wedding.couple.bride.short}
          </span>
        </motion.h1>

        <motion.p {...show(3)} className="mt-8 max-w-[26rem] font-serif text-lg leading-snug text-ivory sm:text-xl">
          {wedding.hero.invite}
        </motion.p>
        <motion.p {...show(3.4)} className="mt-4 font-serif text-lg italic text-gold-light">
          {wedding.hero.dates}
        </motion.p>
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-safe"
        initial={reduce ? false : { opacity: 0 }}
        animate={entered ? { opacity: 1 } : undefined}
        transition={{ duration: 1.6, delay: reduce ? 0 : 4 }}
      >
        <span className="relative mb-6 block h-14 w-px overflow-hidden bg-gold-light/25">
          <motion.span
            className="absolute inset-x-0 top-0 block h-1/2 bg-gold-light"
            animate={reduce ? undefined : { y: ['-100%', '200%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
