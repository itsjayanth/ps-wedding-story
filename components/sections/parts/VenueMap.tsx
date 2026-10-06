'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/** Arch, contours, rivers, roads: all drawn from a viewBox 0 0 320 420. */
const ARCH_OUT = 'M10 410V170C10 80 80 14 160 8C240 14 310 80 310 170V410Z';
const ARCH_IN = 'M20 400V172C20 88 86 26 160 20C234 26 300 88 300 172V400Z';

export function VenueMap({ label, name, caption }: { label: string; name: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'center 70%'] });
  const draw = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const draw2 = useTransform(scrollYProgress, [0.1, 1], [0, 1]);
  const fade = useTransform(scrollYProgress, [0.35, 0.9], [0, 1]);
  const lift = useTransform(scrollYProgress, [0, 1], [26, 0]);
  const pl = (v: typeof draw) => (reduce ? { pathLength: 1 } : { pathLength: v });

  return (
    <motion.div ref={ref} style={reduce ? undefined : { y: lift }} role="img" aria-label={label} className="relative mx-auto w-full max-w-[24rem]">
      <div aria-hidden="true" className="pointer-events-none absolute -inset-6 -z-10 rounded-t-[999px] bg-[radial-gradient(closest-side,rgb(216_183_106/0.35),transparent)] blur-2xl" />
      <svg viewBox="0 0 320 420" className="block h-auto w-full text-gold-deep dark:text-gold-light" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
        <defs>
          <clipPath id="vm-clip"><path d={ARCH_IN} /></clipPath>
          <linearGradient id="vm-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1E6C8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E6D9BC" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <path d={ARCH_IN} fill="url(#vm-wash)" stroke="none" />
        <motion.path d={ARCH_OUT} strokeWidth="1.6" style={pl(draw)} vectorEffect="non-scaling-stroke" />
        <motion.path d={ARCH_IN} strokeWidth="1" opacity="0.7" style={pl(draw2)} vectorEffect="non-scaling-stroke" />
        <motion.g clipPath="url(#vm-clip)" style={reduce ? undefined : { opacity: fade }}>
          {/* contours */}
          <g opacity="0.3">
            {[[96, 58], [78, 46], [60, 34], [42, 22], [24, 11]].map(([rx, ry]) => (
              <ellipse key={rx} cx="244" cy="120" rx={rx} ry={ry} transform="rotate(-18 244 120)" />
            ))}
            {[[120, 56], [96, 42], [72, 28], [48, 15]].map(([rx, ry]) => (
              <ellipse key={rx} cx="40" cy="330" rx={rx} ry={ry} transform="rotate(12 40 330)" />
            ))}
          </g>
          {/* river (double line) */}
          <g opacity="0.55">
            <path d="M-10 70C50 96 70 140 130 150S240 190 330 176" />
            <path d="M-10 78C50 104 70 148 130 158S240 198 330 184" />
          </g>
          {/* roads */}
          <g opacity="0.8">
            <path d="M-10 262C70 250 120 282 190 244S290 202 340 218" />
            <path d="M-10 270C70 258 120 290 190 252S290 210 340 226" opacity="0.5" />
            <path d="M150 -10C160 90 130 160 168 244C190 292 176 350 190 430" />
            <path d="M158 -10C168 90 138 160 176 244C198 292 184 350 198 430" opacity="0.5" />
          </g>
          <g opacity="0.4">
            <path d="M-10 150C30 160 70 140 112 168" />
            <path d="M190 244C230 282 280 292 340 312" />
            <path d="M60 430C70 360 100 336 120 274" />
            <path d="M214 -10C220 40 250 70 330 82" />
            <path d="M-10 330C40 320 80 350 130 340" strokeDasharray="2 4" />
            <path d="M200 300C230 330 260 360 330 380" strokeDasharray="2 4" />
          </g>
          {/* fine grid of lanes */}
          <g opacity="0.16">
            {[60, 100, 140, 180].map((y) => <path key={y} d={`M-10 ${y + 190}H340`} />)}
            {[40, 90, 240, 280].map((x) => <path key={x} d={`M${x} 200V430`} />)}
          </g>
          <circle cx="168" cy="244" r="30" opacity="0.5" />
          <circle cx="168" cy="244" r="48" opacity="0.28" strokeDasharray="1 4" />
          <circle cx="168" cy="244" r="68" opacity="0.14" />
        </motion.g>
        {/* compass flourish */}
        <g transform="translate(268 332)" opacity="0.9">
          <circle r="20" opacity="0.5" />
          <circle r="15" opacity="0.3" />
          <path d="M0 -26L5 0L0 26L-5 0Z" />
          <path d="M-26 0L0 -5L26 0L0 5Z" opacity="0.55" />
          <path d="M0 -26L0 0" strokeWidth="1.6" />
          <path d="M-11 -11L11 11M11 -11L-11 11" opacity="0.3" />
          <text y="-30" textAnchor="middle" fontSize="9" fill="currentColor" stroke="none" fontFamily="var(--font-display), serif" fontStyle="italic">N</text>
        </g>
      </svg>
      {/* glowing lotus pin */}
      <div className="absolute left-[52.5%] top-[58.2%] -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
        {!reduce && (
          <>
            <motion.span className="absolute left-1/2 top-1/2 block h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold" animate={{ scale: [0.6, 1.9], opacity: [0.7, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeOut' }} />
            <motion.span className="absolute left-1/2 top-1/2 block h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold" animate={{ scale: [0.6, 1.9], opacity: [0.7, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: 'easeOut', delay: 1.8 }} />
          </>
        )}
        <motion.span
          className="absolute left-1/2 top-1/2 block h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(216_183_106/0.75),transparent)]"
          animate={reduce ? undefined : { opacity: [0.55, 1, 0.55], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <svg viewBox="0 0 48 36" className="relative h-10 w-[3.4rem] text-gold-deep dark:text-gold-light" fill="rgb(248 244 232 / 0.85)" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
          <path d="M24 33C16 28 14 16 24 4C34 16 32 28 24 33Z" />
          <path d="M24 33C12 32 5 24 4 14C14 14 21 22 24 33Z" />
          <path d="M24 33C36 32 43 24 44 14C34 14 27 22 24 33Z" />
          <path d="M24 33C10 35 2 30 0 24C9 22 18 26 24 33Z" fill="none" opacity="0.7" />
          <path d="M24 33C38 35 46 30 48 24C39 22 30 26 24 33Z" fill="none" opacity="0.7" />
        </svg>
      </div>
      {/* name plate */}
      <div className="absolute inset-x-0 bottom-[6.5%] text-center">
        <p className="font-script whitespace-nowrap text-[1.7rem] leading-none text-gold-deep dark:text-gold-light sm:text-[2rem]">{name}</p>
        <p className="mt-1 font-serif text-xs italic tracking-[0.3em] text-gold-deep/80 dark:text-gold-light/80">{caption}</p>
      </div>
    </motion.div>
  );
}
