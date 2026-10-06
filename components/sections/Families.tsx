'use client';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { wedding, type Version } from '@/content/wedding';
import { SampleTag } from '@/components/SampleTag';
import { Lotus } from '@/components/ornaments';

type Family = (typeof wedding.families)['bride'] | (typeof wedding.families)['groom'];

const CROWN = 'M0 96V70Q0 50 20 48Q34 46 46 34Q60 14 100 10Q160 8 200 0Q240 8 300 10Q340 14 354 34Q366 46 380 48Q400 50 400 70V96';
const CROWN_MASK = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 96' preserveAspectRatio='none'><path d='${CROWN}Z'/></svg>")`;
const SOLID = 'linear-gradient(#000,#000)';
const cardShape = {
  WebkitMaskImage: `${CROWN_MASK}, ${SOLID}`,
  maskImage: `${CROWN_MASK}, ${SOLID}`,
  WebkitMaskSize: '100% 96px, 100% calc(100% - 95px)',
  maskSize: '100% 96px, 100% calc(100% - 95px)',
  WebkitMaskPosition: 'top, bottom',
  maskPosition: 'top, bottom',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
} as const;

const SECTION_BG = {
  backgroundColor: 'rgb(var(--ivory))',
  backgroundImage: [
    'radial-gradient(55% 45% at 50% 30%, rgb(255 252 242 / 0.95), rgb(248 244 232 / 0) 75%)',
    'radial-gradient(40% 30% at 50% 100%, rgb(216 183 106 / 0.18), transparent 75%)',
    `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' fill='none' stroke='%23B8893A' stroke-opacity='.11' stroke-width='1'><path d='M24 2 46 24 24 46 2 24Z'/><path d='M24 12 36 24 24 36 12 24Z'/><circle cx='24' cy='24' r='2'/></svg>")`,
  ].join(','),
} as const;

/** Double-rule cusped crown frame: an outer and an inner hairline. */
function ArchFrame() {
  const rule = (inset: string, op: string) => (
    <div className={`absolute ${inset} ${op}`}>
      <svg viewBox="0 0 400 96" preserveAspectRatio="none" className="absolute left-0 top-0 h-24 w-full overflow-visible" fill="none" stroke="currentColor" strokeWidth={1}>
        <path vectorEffect="non-scaling-stroke" d={CROWN} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 top-[95px] border-x border-b border-current" />
    </div>
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-gold">
      {rule('inset-0', 'opacity-100')}
      {rule('left-2 right-2 top-3 bottom-2', 'opacity-60')}
    </div>
  );
}

function Diamond() {
  return (
    <svg aria-hidden viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0 text-gold" fill="none" stroke="currentColor">
      <path d="M6 .8l5.2 5.2L6 11.2.8 6z" />
    </svg>
  );
}

function Card({ side, family, version }: { side: 'bride' | 'groom'; family: Family; version: Version }) {
  const full = version === 'family';
  const note = side === 'bride' && 'parentsNote' in family ? family.parentsNote : null;
  return (
    <div
      className="thread-mask paper relative h-full w-full px-7 pb-14 pt-32 text-center text-ink sm:px-10"
      style={{
        ['--mask-bg' as string]: '241 230 200',
        backgroundImage: 'linear-gradient(165deg, rgb(255 251 238 / 0.7), rgb(255 251 238 / 0) 42%, rgb(205 178 120 / 0.22))',
        ...cardShape,
      }}
    >
      <ArchFrame />
      <Lotus className="absolute left-1/2 top-9 h-9 w-14 -translate-x-1/2 text-gold" />
      <p className="font-script text-4xl leading-none text-gold-deep sm:text-[2.6rem]">{family.label}</p>
      <ul className="mt-7 font-serif text-[1.65rem] leading-snug sm:text-3xl">
        {family.parents.map((p, i) => (
          <li key={p}>
            {i > 0 && (
              <span aria-hidden className="my-3 flex items-center justify-center gap-3">
                <span className="h-px w-8 bg-gold/70" />
                <Diamond />
                <span className="h-px w-8 bg-gold/70" />
              </span>
            )}
            {p}
          </li>
        ))}
      </ul>
      {full && note && <p className="mt-2 font-serif text-base italic text-gold-deep">{note}</p>}
      <p className="mt-7 font-serif text-xl italic text-gold-deep">{family.town}</p>
      <p className="mx-auto mt-4 max-w-[26ch] text-[15px] leading-relaxed text-ink/80">
        {family.description}
        <SampleTag />
      </p>
      {full && <p className="mx-auto mt-5 max-w-[30ch] text-sm leading-relaxed text-ink/75">{family.address}</p>}
    </div>
  );
}

/** Heading split at the comma into two lines, each revealed from behind a mask. */
function Heading({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [a, ...rest] = text.split(', ');
  const lines = [a + (rest.length ? ',' : ''), rest.join(', ')].filter(Boolean);
  return (
    <h2 className="mx-auto max-w-4xl text-center text-[clamp(3rem,10.5vw,6.75rem)] font-normal leading-[1.02] tracking-tight text-ink">
      {lines.map((l, i) => (
        <span key={l} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${i === 1 ? 'italic text-gold-deep' : ''}`}
            initial={reduce ? false : { y: '108%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 1.5, delay: i * 0.18, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

function Pair({ children, side, p, wide }: { children: React.ReactNode; side: -1 | 1; p: ReturnType<typeof useSpring>; wide: boolean }) {
  const reduce = useReducedMotion();
  const dx = wide ? 54 : 18;
  const x = useTransform(p, [0, 1], reduce ? [0, 0] : [side * dx, 0]);
  const y = useTransform(p, [0, 1], reduce ? [0, 0] : [wide ? 70 : 40, 0]);
  const rotateZ = useTransform(p, [0, 1], reduce ? [0, 0] : [side * 3.5, 0]);
  const rotateY = useTransform(p, [0, 1], reduce ? [0, 0] : [side * (wide ? -16 : -8), 0]);
  const opacity = useTransform(p, [0, 0.35], reduce ? [1, 1] : [0, 1]);
  return (
    <motion.div style={{ x, y, rotateZ, rotateY, opacity, transformPerspective: 1100 }} className="h-full will-change-transform">
      {children}
    </motion.div>
  );
}

export function Families({ version }: { version: Version }) {
  const f = wedding.families;
  const gridRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start 98%', 'start 30%'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });

  return (
    <section
      data-section="families"
      data-version={version}
      className="overflow-x-clip px-6 pb-28 pt-24 md:px-10 md:pb-40 md:pt-36"
      style={SECTION_BG}
    >
      <div className="relative">
        <Heading text={f.heading} />
      </div>
      <div ref={gridRef} className="relative mx-auto mt-28 grid max-w-5xl gap-[72px] md:mt-36 md:grid-cols-2 md:gap-10 lg:gap-14">
        {(['bride', 'groom'] as const).map((side, i) => (
          <div key={side} className="relative flex">
            {/* anchor for the gold thread: above the card, top-centre (kept outside the animated wrapper) */}
            <div data-thread-from={side} className="absolute -top-14 left-1/2 h-0 w-0" />
            <div className="w-full">
              <Pair side={i === 0 ? -1 : 1} p={p} wide={wide}>
                <Card side={side} family={f[side]} version={version} />
              </Pair>
            </div>
          </div>
        ))}
        {/* the point where the two threads converge into one (desktop) */}
        <div data-thread-join className="absolute -bottom-32 left-1/2 hidden h-0 w-0 md:block" />
      </div>
    </section>
  );
}
