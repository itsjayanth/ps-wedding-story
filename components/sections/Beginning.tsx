'use client';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding, type MediaRef } from '@/content/wedding';
import { Media } from '../Media';

const EASE = [0.22, 0.61, 0.36, 1] as const;
const ARCH_FROM = 'inset(26% 14% 0% 14% round 999px 999px 0px 0px)';
const ARCH_TO = 'inset(0% 0% 0% 0% round 999px 999px 0px 0px)';

/** A portrait that opens inside an arch as it scrolls in: clip grows, photo settles from 1.2 to 1, parallax drift. */
function ArchPortrait({ media, speed, className }: { media: MediaRef; speed: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const open = useTransform(scrollYProgress, [0.02, 0.42], [0, 1], { clamp: true });
  const clipPath = useTransform(open, [0, 1], reduce ? [ARCH_TO, ARCH_TO] : [ARCH_FROM, ARCH_TO]);
  const scale = useTransform(open, [0, 1], reduce ? [1, 1] : [1.2, 1]);
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [speed, -speed]);
  const y = useSpring(drift, { stiffness: 80, damping: 24, mass: 0.5 });
  const frame = useTransform(open, [0.3, 1], reduce ? [1, 1] : [0, 1]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      <div className="relative">
        {/* hairline arch offset behind the portrait */}
        <motion.div
          aria-hidden
          style={{ opacity: frame }}
          className="absolute -inset-x-3 -bottom-0 -top-3 rounded-t-[999px] border border-b-0 border-gold/70"
        />
        <motion.div style={{ clipPath, WebkitClipPath: clipPath }} className="relative">
          <motion.div style={{ scale }} className="origin-center">
            <Media media={media} aspect="3 / 4" sizes="(min-width: 768px) 40vw, 75vw" className="w-full" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** One sentence per line, each lifted from behind its own mask. */
function Lines({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const lines = text.match(/[^.]+\./g)?.map((l) => l.trim()) ?? [text];
  return (
    <p
      id="beginning-line"
      className="thread-mask mx-auto max-w-[24ch] px-3 py-2 text-center font-serif text-[2.1rem] font-normal italic leading-[1.18] text-ink sm:text-5xl md:max-w-[32ch] md:text-6xl lg:text-7xl"
    >
      {lines.map((l, i) => (
        <span key={l} className="block overflow-hidden pb-[0.14em]">
          <motion.span
            className={`block ${i === 1 ? 'text-gold-deep' : ''}`}
            initial={reduce ? false : { y: '110%' }}
            whileInView={{ y: '0%' }}
            viewport={{ once: true, margin: '-12% 0px' }}
            transition={{ duration: 1.6, delay: i * 0.3, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </p>
  );
}

export function Beginning() {
  const [a, b] = wedding.beginning.portraits;
  return (
    <section
      data-section="beginning"
      aria-labelledby="beginning-line"
      className="overflow-x-clip py-28 pl-10 pr-6 md:px-10 md:py-44"
      style={{
        ['--mask-bg' as string]: '241 230 200',
        backgroundColor: 'rgb(var(--champagne))',
      }}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-12 gap-y-20 md:gap-y-0">
          <div className="col-span-9 col-start-1 md:col-span-5 md:col-start-2">
            <ArchPortrait media={a} speed={26} />
          </div>
          <div className="col-span-9 col-start-4 md:col-span-5 md:col-start-7 md:row-start-1 md:mt-40">
            <ArchPortrait media={b} speed={-34} />
          </div>
          <div className="col-span-12 md:row-start-2 md:mt-36">
            <Lines text={wedding.beginning.line} />
          </div>
        </div>
      </div>
    </section>
  );
}
