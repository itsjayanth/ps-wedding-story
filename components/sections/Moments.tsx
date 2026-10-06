'use client';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wedding, type MediaRef, type Version } from '@/content/wedding';
import { Media } from '../Media';
import { Lotus } from '../ornaments';
import { ArchFrame } from './parts/ArchFrame';
import { MaskedHeading } from './parts/MaskedHeading';

const FOIL = { '--foil': 'linear-gradient(100deg, #7a5620 0%, #b8893a 35%, #d0a755 55%, #a47a2e 100%)' } as React.CSSProperties;

/** Desktop frame heights (vh) and vertical drift: varied so the strip breathes. */
const heights = [60, 50, 66, 54, 62, 48, 64, 52];
const drift = ['0', '6vh', '-4vh', '8vh', '-2vh', '7vh', '-5vh', '4vh'];

function Caption({ text, className = '' }: { text: string; className?: string }) {
  return <p className={`thread-mask mt-4 px-3 py-1 text-center font-serif text-lg italic text-ink/80 dark:text-ivory/80 ${className}`}>{text}</p>;
}

/** Mobile: arch-masked reveal with a gentle inner parallax. */
function MobileMoment({ p, i }: { p: MediaRef; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const right = i % 2 === 1;
  return (
    <motion.figure
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1.3, ease: [0.22, 0.61, 0.36, 1] }}
      className={`w-[80%] ${right ? 'ml-auto' : 'mr-auto'}`}
    >
      <ArchFrame aspect={i % 3 === 0 ? '3 / 4.4' : '3 / 4'} className="text-gold" fillClassName="bg-sandstone">
        <motion.div className="absolute -inset-y-[9%] inset-x-0" style={reduce ? undefined : { y }}>
          <Media media={p} aspect="auto" sizes="80vw" className="h-full w-full" />
        </motion.div>
      </ArchFrame>
      <figcaption>
        <Caption text={p.caption} />
      </figcaption>
    </motion.figure>
  );
}

function DesktopStrip({ photos, heading }: { photos: MediaRef[]; heading: string }) {
  const reduce = useReducedMotion();
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const measure = () => setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);
  const { scrollYProgress } = useScroll({ target: outerRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const x = useTransform(smooth, [0, 1], [0, -dist]);
  const bar = useTransform(smooth, [0, 1], [0, 1]);
  const pinned = !reduce;

  return (
    <div
      ref={outerRef}
      className="relative hidden md:block"
      style={pinned ? { height: `calc(100vh + ${Math.round(dist)}px)` } : undefined}
    >
      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden' : 'overflow-x-auto py-24'}>
        <motion.div ref={trackRef} style={pinned ? { x } : undefined} className="flex w-max items-center gap-20 px-[10vw]">
          <div className="thread-mask flex w-[34vw] max-w-xl shrink-0 flex-col items-start px-2 py-4">
            <Lotus className="h-12 w-12 text-gold" aria-hidden="true" />
            <MaskedHeading
              id="moments-heading-lg"
              text={heading}
              className="!mx-0 mt-4 !px-0 !text-left font-serif text-8xl font-normal italic text-ink dark:text-ivory lg:text-9xl"
              wordClassName="foil-text"
          style={FOIL}
            />
            <div className="gold-rule mt-8 w-40" aria-hidden="true" />
          </div>
          {photos.map((p, i) => (
            <figure key={p.src} className="shrink-0" style={{ transform: `translateY(${drift[i % drift.length]})` }}>
              <ArchFrame aspect="3 / 4.2" className="text-gold" fillClassName="bg-sandstone" style={{ height: `${heights[i % heights.length]}vh` }}>
                <Media media={p} aspect="auto" sizes="40vw" className="h-full w-full" />
              </ArchFrame>
              <figcaption>
                <Caption text={p.caption} />
              </figcaption>
            </figure>
          ))}
        </motion.div>
        {pinned && (
          <div className="absolute inset-x-[10vw] bottom-10 h-px bg-gold/25" aria-hidden="true">
            <motion.div className="h-full origin-left bg-gold" style={{ scaleX: bar }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Moments({ version }: { version: Version }) {
  const m = wedding.moments;
  const photos = m.photos.slice(0, m.counts[version]);
  return (
    <section
      data-section="moments"
      data-version={version}
      aria-labelledby="moments-heading"
      className="relative overflow-x-clip py-24 md:py-32"
    >
      <div className="pl-10 pr-6 md:hidden">
        <div className="text-center text-gold" aria-hidden="true">
          <Lotus className="mx-auto h-9 w-9" />
        </div>
        <MaskedHeading
          id="moments-heading"
          text={m.heading}
          className="mt-4 font-serif text-6xl font-normal italic text-ink dark:text-ivory"
          wordClassName="foil-text"
          style={FOIL}
        />
        <div className="mt-14 flex flex-col gap-14">
          {photos.map((p, i) => (
            <MobileMoment key={p.src} p={p} i={i} />
          ))}
        </div>
      </div>
      <DesktopStrip photos={photos} heading={m.heading} />
    </section>
  );
}
