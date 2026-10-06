'use client';
import { useReducedMotion } from 'framer-motion';

/** Deterministic pseudo-random so server and client markup match. */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const MOTES = Array.from({ length: 30 }, (_, i) => ({
  left: Math.round(rnd(i, 1) * 1000) / 10,
  size: Math.round((1.5 + rnd(i, 2) * 2.5) * 10) / 10,
  dur: Math.round(16 + rnd(i, 3) * 18),
  delay: -Math.round(rnd(i, 4) * 34),
  dx: Math.round((rnd(i, 5) - 0.5) * 120),
  glow: Math.round(4 + rnd(i, 6) * 8),
}));

const css = `@keyframes ps-mote{0%{transform:translate3d(0,0,0);opacity:0}14%{opacity:.85}80%{opacity:.55}100%{transform:translate3d(var(--dx),-105svh,0);opacity:0}}`;

/** Slow drifting gold dust. Hidden entirely for reduced motion. */
export function Motes() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <style>{css}</style>
      {MOTES.map((m, i) => (
        <span
          key={i}
          className="absolute bottom-[-4svh] block rounded-full bg-gold-light"
          style={
            {
              left: `${m.left}%`,
              width: m.size,
              height: m.size,
              boxShadow: `0 0 ${m.glow}px ${m.glow / 3}px rgb(216 183 106 / 0.55)`,
              animation: `ps-mote ${m.dur}s linear ${m.delay}s infinite`,
              '--dx': `${m.dx}px`,
              opacity: 0,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
