'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/content/wedding';
import { useEntry } from './entry/context';
import { Media } from './Media';
import { MultifoilArch } from './ornaments';
import { Motes } from './hero/Motes';
import { DoubleRule } from './hero/Rule';

const HOLD_MS = 6000;
const FADE_S = 2.4;
const EASE = [0.22, 0.61, 0.36, 1] as const;

export function Hero() {
  const { entered } = useEntry();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const slides = wedding.hero_media.slides;
  const [index, setIndex] = useState(0);
  const [videoOk, setVideoOk] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const none = !!reduce;
  const y = useTransform(scrollYProgress, [0, 1], none ? ['0%', '0%'] : ['0%', '12%']);
  // names: scale, drift and fade as the page scrolls away
  const namesY = useTransform(scrollYProgress, [0, 1], none ? [0, 0] : [0, -140]);
  const namesScale = useTransform(scrollYProgress, [0, 0.8], none ? [1, 1] : [1, 0.86]);
  const namesOpacity = useTransform(scrollYProgress, [0, 0.55], none ? [1, 1] : [1, 0]);
  const leftX = useTransform(scrollYProgress, [0, 0.7], none ? [0, 0] : [0, -70]);
  const rightX = useTransform(scrollYProgress, [0, 0.7], none ? [0, 0] : [0, 70]);
  const subY = useTransform(scrollYProgress, [0, 1], none ? [0, 0] : [0, -70]);
  const subOpacity = useTransform(scrollYProgress, [0, 0.45], none ? [1, 1] : [1, 0]);
  // palace arch opens outward
  const archScale = useTransform(scrollYProgress, [0, 1], none ? [1, 1] : [1, 1.7]);
  const arch2Scale = useTransform(scrollYProgress, [0, 1], none ? [1, 1] : [1, 1.3]);
  const archOpacity = useTransform(scrollYProgress, [0, 0.8], none ? [1, 1] : [1, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], none ? [1, 1] : [1, 0.2]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], none ? [1, 1] : [1, 0]);

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
    <section ref={ref} data-section="hero" className="bg-night relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden text-ivory">
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

      {/* rich night wash over the photographs */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 42%, rgb(27 20 12 / 0.55) 0%, rgb(27 20 12 / 0.86) 100%), linear-gradient(180deg, rgb(27 20 12 / 0.7) 0%, rgb(27 20 12 / 0.82) 55%, rgb(27 20 12 / 0.97) 100%)',
        }}
      />
      {/* gold glow behind the names */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          opacity: glowOpacity,
          background:
            'radial-gradient(46% 38% at 50% 44%, rgb(216 183 106 / 0.26), transparent 70%), radial-gradient(70% 30% at 50% 100%, rgb(184 137 58 / 0.22), transparent 75%)',
        }}
      />

      {/* palace arch + lattice frame */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center" style={{ opacity: archOpacity }}>
        <motion.div className="relative h-[96svh] aspect-[200/260] max-w-[110vw] origin-[50%_62%]" style={{ scale: archScale }}>
          <div
            className="jali-bg absolute inset-x-[8%] bottom-0 top-[22%] opacity-[0.12]"
            style={{
              WebkitMaskImage: 'radial-gradient(60% 55% at 50% 55%, #000 20%, transparent 100%)',
              maskImage: 'radial-gradient(60% 55% at 50% 55%, #000 20%, transparent 100%)',
            }}
          />
          <MultifoilArch className="absolute inset-0 h-full w-full text-gold-light opacity-[0.34]" />
        </motion.div>
        <motion.div className="absolute h-[108svh] aspect-[200/260] max-w-[150vw] origin-[50%_62%]" style={{ scale: arch2Scale }}>
          <MultifoilArch className="h-full w-full text-gold-light opacity-[0.14]" />
        </motion.div>
      </motion.div>

      <Motes />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 pb-36 text-center" style={{ paddingTop: 'calc(6rem + var(--safe-top))' }}>
        <motion.div style={{ y: subY, opacity: subOpacity }}>
          <motion.p {...show(1.2)} className="font-serif text-xl italic text-[#F1E6C8] sm:text-2xl">
            {wedding.hero.blessing}
          </motion.p>
        </motion.div>

        <motion.div style={{ y: namesY, scale: namesScale, opacity: namesOpacity }} className="mt-2 w-full">
          <motion.h1 {...show(1.8)} className="font-script font-normal" aria-label={wedding.couple.ampersandNames}>
            <motion.span
              aria-hidden
              style={{ x: leftX }}
              className="foil-text block px-[0.2em] pb-[0.12em] pt-[0.05em] text-[clamp(4.5rem,min(22vw,19svh),13rem)] leading-[1.05] md:-translate-x-[9%]"
            >
              {wedding.couple.groom.short}
            </motion.span>
            <span aria-hidden className="relative z-10 -my-[0.5em] block font-serif text-[clamp(2.5rem,8vw,5.5rem)] font-light italic leading-none text-gold-light">
              &amp;
            </span>
            <motion.span
              aria-hidden
              style={{ x: rightX }}
              className="foil-text block px-[0.2em] pb-[0.12em] pt-[0.05em] text-[clamp(4.5rem,min(22vw,19svh),13rem)] leading-[1.05] md:translate-x-[9%]"
            >
              {wedding.couple.bride.short}
            </motion.span>
          </motion.h1>
        </motion.div>

        <motion.div style={{ y: subY, opacity: subOpacity }} className="mt-6 w-full">
          <motion.div {...show(3)} className="mx-auto w-full max-w-md">
            <DoubleRule />
            <p className="mx-auto mt-6 max-w-[26rem] font-serif text-lg leading-snug text-ivory sm:text-xl">{wedding.hero.invite}</p>
            <p className="mt-3 font-serif text-xl italic text-gold-light">{wedding.hero.dates}</p>
            <DoubleRule className="mt-6" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-safe"
        style={{ opacity: cueOpacity }}
      >
        <motion.div
          className="flex flex-col items-center"
          initial={reduce ? false : { opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ duration: 1.6, delay: reduce ? 0 : 4 }}
        >
          <span className="font-serif text-sm italic text-gold-light/90">{wedding.hero.scroll}</span>
          <span className="relative mb-4 mt-2 block h-12 w-px overflow-hidden bg-gold-light/25">
            <motion.span
              className="absolute inset-x-0 top-0 block h-1/2 bg-gold-light"
              animate={reduce ? undefined : { y: ['-100%', '200%'] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <motion.svg
            viewBox="0 0 16 16"
            className="mb-5 h-2.5 w-2.5 text-gold-light"
            fill="none"
            stroke="currentColor"
            animate={reduce ? undefined : { y: [0, 4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M8 1l7 7-7 7-7-7z" />
          </motion.svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
