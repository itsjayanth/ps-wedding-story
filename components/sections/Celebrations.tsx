'use client';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wedding, type Version } from '@/content/wedding';
import { Elephant } from '../ornaments/Elephant';
import { Kolam, Lotus, MultifoilArch } from '../ornaments';
import { SampleTag } from '../SampleTag';
import { ArchFrame } from './parts/ArchFrame';
import { MaskedHeading } from './parts/MaskedHeading';

/** Darker foil so the gradient stays legible on champagne paper. */
const FOIL_ON_LIGHT =
  'linear-gradient(100deg, #6b4a17 0%, #a87a2e 28%, #cfa24f 45%, #8f6522 62%, #b8893a 80%, #6b4a17 100%)';
const foilStyle = { '--foil': FOIL_ON_LIGHT } as React.CSSProperties;

type EventItem = (typeof wedding.celebrations.events)[number];

function Plate({ e, index }: { e: EventItem; index: number }) {
  const reduce = useReducedMotion();
  const [num, month, year] = e.date.split(' ');
  return (
    <motion.article
      aria-labelledby={`ev-${e.id}`}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 1.4, delay: index * 0.1, ease: [0.22, 0.61, 0.36, 1] }}
      className="mx-auto w-full max-w-sm"
    >
      <ArchFrame className="text-gold" fillClassName="bg-ivory">
        <div className="relative px-8 pb-12 pt-24 text-center md:pb-14 md:pt-32">
          <div className="absolute inset-0 jali-bg opacity-[0.06]" aria-hidden="true" />
          <Lotus className="relative mx-auto h-8 w-8 text-gold-deep" aria-hidden="true" />
          <h3 id={`ev-${e.id}`} className="relative mt-3 font-serif text-3xl font-normal italic text-ink md:text-4xl">
            {e.title}
          </h3>
          <p
            className="foil-text relative mt-4 font-serif text-[6.5rem] font-normal leading-[0.95] md:text-[8.5rem]"
            style={foilStyle}
            aria-label={e.date}
          >
            <span aria-hidden="true">{num}</span>
          </p>
          <p className="relative font-serif text-lg tracking-wide text-ink md:text-xl" aria-hidden="true">
            {month} {year}
          </p>
          <p className="font-script relative mt-3 text-4xl text-gold-deep md:text-5xl">{e.day}</p>
          <div className="gold-rule mx-auto my-5 w-24" aria-hidden="true" />
          <p className="relative font-sans text-base font-normal text-ink">{e.time}</p>
          <p className="relative mx-auto mt-4 max-w-[26ch] font-serif text-lg italic leading-snug text-ink/80">
            {e.meaning}
            <SampleTag />
          </p>
        </div>
      </ArchFrame>
    </motion.article>
  );
}

/** The scroll-linked royal procession: the ambari elephant walks the palace arcade as the section scrolls. */
function Stage({ progress, reduce }: { progress: ReturnType<typeof useSpring>; reduce: boolean | null }) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const widthPct = narrow ? 66 : 42;
  const maxX = ((100 - widthPct) / widthPct) * 100; // percent of own width
  const x = useTransform(progress, [0, 1], ['0%', `${maxX}%`]);
  const bob = useTransform(progress, (v) => Math.sin(v * Math.PI * 14) * 2.5);
  const arches = [0, 1, 2, 3, 4, 5, 6];
  return (
    <div className="relative mx-auto h-[210px] w-full max-w-5xl md:h-[400px]" aria-hidden="true">
      <div className="absolute inset-x-0 bottom-6 top-0 flex justify-between gap-1 text-gold opacity-40 md:bottom-8 md:gap-3">
        {arches.map((i) => (
          <div key={i} className={i > 3 ? 'hidden flex-1 md:block' : 'flex-1'}>
            <MultifoilArch className="h-full w-full" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-6 md:bottom-8">
        <div className="gold-rule" />
        <div className="gold-rule mt-1 opacity-60" />
      </div>
      <motion.div
        className="absolute bottom-[1.25rem] left-0 text-gold-deep md:bottom-[1.6rem]"
        style={{ width: `${widthPct}%`, x: reduce ? `${maxX / 2}%` : x, y: reduce ? 0 : bob }}
      >
        <div
          className="absolute inset-x-[8%] bottom-0 top-[6%] -z-0 rounded-[40%] blur-xl"
          style={{ background: 'rgb(241 230 200 / 0.9)' }}
        />
        <Elephant className="relative h-auto w-full" animated lit />
      </motion.div>
    </div>
  );
}

export function Celebrations({ version }: { version: Version }) {
  const c = wedding.celebrations;
  const family = version === 'family';
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 85%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.5 });
  const [reception, muhurtham] = c.events;

  return (
    <section
      data-section="celebrations"
      data-version={version}
      aria-labelledby="celebrations-heading"
      className="bg-champagne relative overflow-hidden py-24 pl-10 pr-6 md:px-10 md:py-44"
      style={{ '--mask-bg': '241 230 200' } as React.CSSProperties}
    >
      <div className="jali-bg pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl text-ink">
        <div className="text-center text-gold-deep" aria-hidden="true">
          <Kolam className="mx-auto h-10 w-10 md:h-12 md:w-12" />
        </div>
        <MaskedHeading
          id="celebrations-heading"
          text={c.heading}
          className="mt-4 font-serif text-5xl font-normal italic md:text-8xl"
          wordClassName="foil-text"
          style={foilStyle}
        />

        <div ref={wrapRef} className="mt-10 grid gap-y-8 md:mt-16 md:grid-cols-2 md:gap-x-14 md:gap-y-4">
          <div className="order-2 md:order-1 md:col-span-2">
            <Stage progress={progress} reduce={reduce} />
          </div>
          <div className="order-1 md:order-2">
            <Plate e={reception} index={0} />
          </div>
          <div className="order-3 md:order-3">
            <Plate e={muhurtham} index={1} />
          </div>
        </div>

        <figure className="thread-mask relative mx-auto mt-24 max-w-[40ch] px-4 py-4 text-center md:mt-36 md:max-w-[46ch]">
          <div className="flex items-center justify-center gap-5 text-gold-deep" aria-hidden="true">
            <Kolam className="h-7 w-7" />
            <Lotus className="h-10 w-10" />
            <Kolam className="h-7 w-7" />
          </div>
          <span aria-hidden="true" className="foil-text mt-2 block font-serif text-8xl leading-[0.6] md:text-9xl" style={foilStyle}>“</span>
          <blockquote className="mt-4 font-serif text-2xl font-normal italic leading-[1.35] text-ink md:text-4xl">
            {c.printedLine}
          </blockquote>
          <div className="gold-rule mx-auto mt-8 w-32" aria-hidden="true" />
        </figure>

        {family && (
          <div className="thread-mask mx-auto mt-20 max-w-[50ch] px-4 py-4 text-center md:mt-28">
            <p className="font-serif text-xl font-normal leading-relaxed text-ink md:text-2xl">{c.formalInvitation}</p>
            <p className="font-script mt-10 text-5xl text-gold-deep md:text-6xl">{c.awaiting.label}</p>
            <ul className="mt-4 space-y-1 font-serif text-lg italic text-ink md:text-xl">
              {c.awaiting.names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
