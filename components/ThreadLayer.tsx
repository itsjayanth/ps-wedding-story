'use client';
/**
 * ThreadLayer: wraps Families -> Closing and draws ONE absolutely positioned SVG, the gold thread.
 *
 * CONVENTION FOR OTHER SECTIONS
 *  - The thread runs at the page centre on md+ and along the LEFT edge (x = 11px) below md.
 *    Keep >= 24px (px-6) side padding on mobile so content never touches it.
 *  - The SVG sits at z-index 0. Anything that should hide the thread (text blocks crossing the
 *    centre line, cards, captions) gets the class `thread-mask`. It paints --mask-bg behind the
 *    block, and ThreadLayer makes it `position: relative; z-index: 1` automatically.
 *      * On the default page background nothing else is needed.
 *      * In a section with an alt background, set the var on the section:
 *        style={{ ['--mask-bg' as string]: 'var(--surface-alt)' }}  (an RGB triplet, e.g. 230 217 188)
 *    Keep masked blocks tight (the text's own width, `inline-block`/`mx-auto w-fit` + padding), so the
 *    patch is not visible against gradients or photos. Media (images/video) hides the thread by itself
 *    if wrapped in `relative z-[1]`.
 *  - Section backgrounds must NOT be positioned with a z-index (they would cover the thread).
 *  - Closing places `<div data-thread-end />` just above the countdown; the thread ends there in a diamond.
 *  - Families exposes data-thread-from="bride|groom" and data-thread-join anchors (keep them outside
 *    transformed/animated wrappers so measurements are exact).
 * If measurement fails, nothing is rendered. Reduced motion: the thread is fully drawn.
 */
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { measure, type ThreadGeometry } from './thread/geometry';

const css = `.thread-mask:where(:not(.absolute):not(.fixed):not(.sticky)){position:relative}.thread-mask{z-index:1}`;
const strokeStyle = { stroke: 'rgb(var(--line))', strokeOpacity: 0.85, fill: 'none', strokeWidth: 1 } as const;

export function ThreadLayer({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<ThreadGeometry | null>(null);
  const reduce = useReducedMotion();
  const progress = useMotionValue(reduce ? 1 : 0);
  const { scrollY } = useScroll();
  const pageTop = useRef(0);
  const geoRef = useRef<ThreadGeometry | null>(null);

  const update = useCallback(() => {
    const g = geoRef.current;
    if (!g) return;
    if (reduce) return progress.set(1);
    const len = g.trunk.y1 - g.trunk.y0;
    const head = window.scrollY + window.innerHeight * 0.7 - pageTop.current - g.trunk.y0;
    progress.set(Math.max(0, Math.min(1, head / len)));
  }, [progress, reduce]);

  useMotionValueEvent(scrollY, 'change', update);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const run = () => {
      raf = 0;
      try {
        const g = measure(el);
        pageTop.current = el.getBoundingClientRect().top + window.scrollY;
        geoRef.current = g;
        setGeo((prev) => (prev && g && JSON.stringify(prev) === JSON.stringify(g) ? prev : g));
        update();
      } catch {
        geoRef.current = null;
        setGeo(null);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(run);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    window.addEventListener('resize', schedule);
    el.addEventListener('load', schedule, true); // images / media (capture)
    document.fonts?.ready.then(schedule).catch(() => {});
    const t1 = window.setTimeout(schedule, 700);
    const t2 = window.setTimeout(schedule, 2400);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', schedule);
      el.removeEventListener('load', schedule, true);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [update]);

  const len = geo ? geo.trunk.y1 - geo.trunk.y0 : 0;
  const offset = useTransform(progress, (v) => len * (1 - v));
  const diamondOpacity = useTransform(progress, [0.97, 1], [0, 1]);

  return (
    <div ref={ref} className="relative">
      <style>{css}</style>
      {geo && (
        <svg
          aria-hidden="true"
          focusable="false"
          width={geo.width}
          height={geo.height}
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          className="pointer-events-none absolute left-0 top-0 z-0"
        >
          {geo.branches.map((d, i) => (
            <path key={i} d={d} style={strokeStyle} vectorEffect="non-scaling-stroke" />
          ))}
          <Trunk geo={geo} len={len} offset={offset} diamondOpacity={diamondOpacity} />
        </svg>
      )}
      {geo && geo.overlayFrom !== null && (
        <svg
          aria-hidden="true"
          focusable="false"
          width={geo.width}
          height={geo.height}
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          className="pointer-events-none absolute left-0 top-0 z-[2]"
          style={{ clipPath: `inset(${geo.overlayFrom}px 0 0 0)` }}
        >
          <Trunk geo={geo} len={len} offset={offset} diamondOpacity={diamondOpacity} />
        </svg>
      )}
      {children}
    </div>
  );
}

type MV = ReturnType<typeof useMotionValue<number>>;
function Trunk({ geo, len, offset, diamondOpacity }: { geo: ThreadGeometry; len: number; offset: MV; diamondOpacity: MV }) {
  return (
    <>
          <motion.path
            d={`M${geo.trunk.x} ${geo.trunk.y0} V${geo.trunk.y1}`}
            style={{ ...strokeStyle, strokeDasharray: len, strokeDashoffset: offset }}
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={`M${geo.trunk.x} ${geo.trunk.y1 - 7} l7 7 l-7 7 l-7 -7 z`}
            style={{ ...strokeStyle, opacity: diamondOpacity }}
            vectorEffect="non-scaling-stroke"
          />
    </>
  );
}
