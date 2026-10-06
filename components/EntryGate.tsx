'use client';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { wedding } from '@/content/wedding';
import { EntryContext, ENTERED_EVENT } from './entry/context';
import { Elephant, Palace } from './ornaments/Elephant';

const KEY = 'ps-entered';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
/** gate: waiting at the threshold; opening: doors swing, scene pushes in; leaving: scene dissolves into the page. */
type Phase = 'gate' | 'opening' | 'leaving' | 'done';

const OPEN_MS = 900; // doors swing + zoom before the page starts to show through
const LEAVE_MS = 1000; // scene dissolves

function safeGet() {
  try { return window.sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}
function safeSet() {
  try { window.sessionStorage.setItem(KEY, '1'); } catch { /* storage unavailable */ }
}

/** Deterministic pseudo-random so server and client markup match exactly. */
function seeded(n: number, seed = 7) {
  let s = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(s / 233280);
  }
  return out;
}
const STARS = (() => {
  const r = seeded(120, 11);
  return Array.from({ length: 40 }, (_, i) => ({
    x: (r[i * 3] * 100).toFixed(2),
    y: (r[i * 3 + 1] * 56).toFixed(2),
    s: r[i * 3 + 2] > 0.8 ? 2 : 1,
    d: (r[i * 3 + 2] * 6).toFixed(2),
    t: (3 + r[i * 3 + 1] * 4).toFixed(2),
  }));
})();
const MOTES = (() => {
  const r = seeded(60, 29);
  return Array.from({ length: 16 }, (_, i) => ({
    x: (4 + r[i * 3] * 92).toFixed(2),
    y: (40 + r[i * 3 + 1] * 55).toFixed(2),
    d: (-r[i * 3 + 2] * 14).toFixed(2),
    t: (11 + r[i * 3] * 8).toFixed(2),
    s: r[i * 3 + 1] > 0.6 ? 3 : 2,
  }));
})();

const CSS = `
.psg-star{position:absolute;border-radius:9999px;background:rgb(243 224 162);opacity:.2;animation:psg-twinkle var(--t) ease-in-out var(--d) infinite}
.psg-mote{position:absolute;border-radius:9999px;background:rgb(216 183 106);opacity:0;filter:blur(.4px);animation:psg-drift var(--t) linear var(--d) infinite}
@keyframes psg-twinkle{0%,100%{opacity:.12}50%{opacity:.85}}
@keyframes psg-drift{0%{opacity:0;transform:translate3d(0,0,0)}15%{opacity:.7}85%{opacity:.45}100%{opacity:0;transform:translate3d(14px,-90px,0)}}
.psg-btn{transition:box-shadow 1.2s ease,background-color 1.2s ease,color 1.2s ease,border-color 1.2s ease}
.psg-btn:hover,.psg-btn:focus-visible{background-color:rgb(216 183 106 / .08);box-shadow:0 0 34px rgb(216 183 106 / .32),inset 0 0 18px rgb(216 183 106 / .12);color:rgb(243 224 162)}
@media (prefers-reduced-motion:reduce){.psg-star,.psg-mote{animation:none}}
`;

const EASE = [0.22, 0.61, 0.36, 1] as const;
const nightVar = { ['--el-bg' as string]: 'rgb(27 20 12)' } as CSSProperties;

/** Once-per-visit threshold: a palace gate at night, the golden ambari arrives, the doors open. */
export function EntryGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('gate');
  const [arrived, setArrived] = useState(false);
  const timers = useRef<number[]>([]);
  const entered = phase === 'leaving' || phase === 'done';
  const opening = phase !== 'gate';

  // Skip before paint for returning visitors / reduced motion.
  useIsoLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (safeGet() || reduce) {
      safeSet();
      setPhase('done');
    }
  }, []);

  useEffect(() => {
    if (phase === 'done') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  useEffect(() => {
    if (phase === 'leaving') window.dispatchEvent(new Event(ENTERED_EVENT));
  }, [phase]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const enter = useCallback(() => {
    if (phase !== 'gate') return;
    safeSet();
    setPhase('opening');
    timers.current.push(window.setTimeout(() => setPhase('leaving'), OPEN_MS));
    timers.current.push(window.setTimeout(() => setPhase('done'), OPEN_MS + LEAVE_MS + 80));
  }, [phase]);

  return (
    <EntryContext.Provider value={{ entered }}>
      <div inert={!entered} aria-hidden={!entered ? true : undefined}>
        {children}
      </div>
      {phase !== 'done' && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={wedding.site.title}
          className="bg-night fixed inset-0 z-[100] overflow-hidden text-ivory"
          initial={false}
          animate={{ opacity: phase === 'leaving' ? 0 : 1 }}
          transition={{ duration: LEAVE_MS / 1000, ease: 'easeInOut' }}
          style={{ pointerEvents: entered ? 'none' : 'auto' }}
        >
          <style>{CSS}</style>

          {/* the whole scene pushes in through the gate as it opens */}
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: '50% 84%' }}
            initial={false}
            animate={{ scale: opening ? 1.42 : 1 }}
            transition={{ duration: 1.9, ease: [0.5, 0, 0.2, 1] }}
          >
            {/* stars and drifting gold dust */}
            <div aria-hidden className="absolute inset-0">
              {STARS.map((s, i) => (
                <span
                  key={i}
                  className="psg-star"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, ['--d' as string]: `${s.d}s`, ['--t' as string]: `${s.t}s` }}
                />
              ))}
              {MOTES.map((m, i) => (
                <span
                  key={i}
                  className="psg-mote"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, width: m.s, height: m.s, ['--d' as string]: `${m.d}s`, ['--t' as string]: `${m.t}s` }}
                />
              ))}
              {/* warm horizon behind the palace */}
              <div
                className="absolute inset-x-0 bottom-0 h-[62%]"
                style={{ background: 'radial-gradient(70% 70% at 50% 100%, rgb(216 183 106 / 0.2), transparent 72%)' }}
              />
            </div>

            {/* palace, with the elephant crossing in front of the gateway */}
            <div className="absolute bottom-0 left-1/2 w-[min(300vw,170vh)] -translate-x-1/2 lg:w-[min(100vw,180vh)]">
              <Palace className="block h-auto w-full text-gold/80" lit={arrived} open={opening} />
              <div className="absolute bottom-0 left-1/2 w-[27%] -translate-x-1/2 lg:w-[35%]">
                <div className="translate-y-[5%]">
                  <motion.div
                    initial={{ x: '-95vw' }}
                    animate={{ x: 0 }}
                    transition={{ duration: 4.4, ease: [0.18, 0.7, 0.3, 1], delay: 0.3 }}
                    onAnimationComplete={() => setArrived(true)}
                  >
                    <Elephant className="block h-auto w-full text-gold-light" style={nightVar} animated walking={!arrived} lit={arrived} />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* names, caption and the way in */}
          <motion.div
            className="relative z-10 flex flex-col items-center px-6 pt-[max(7vh,calc(var(--safe-top)+1.5rem))] text-center"
            initial={false}
            animate={{ opacity: opening ? 0 : 1, y: opening ? -14 : 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.h1
              className="font-script foil-text py-2 text-[clamp(3.8rem,17vw,5.6rem)] leading-[1.02] sm:text-[clamp(5rem,9.5vw,10rem)]"
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: EASE, delay: 0.9 }}
            >
              <span className="block px-[0.16em] sm:inline-block">{wedding.couple.groom.short}</span>
              <span className="mx-[0.25em] inline-block text-[0.7em]">&amp;</span>
              <span className="block px-[0.16em] sm:inline-block">{wedding.couple.bride.short}</span>
            </motion.h1>
            <motion.p
              className="mt-2 font-serif text-lg italic text-sandstone sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, ease: 'easeOut', delay: 2.1 }}
            >
              {wedding.entry.caption}
            </motion.p>
            <motion.div
              className="mt-6 sm:mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: EASE, delay: 3 }}
            >
              <button
                type="button"
                onClick={enter}
                disabled={phase !== 'gate'}
                className="psg-btn relative inline-flex min-h-[52px] min-w-[176px] items-center justify-center rounded-full border border-gold-light/70 px-12 py-3 font-serif text-lg tracking-[0.34em] text-gold-light before:pointer-events-none before:absolute before:inset-[3px] before:rounded-full before:border before:border-gold-light/35 before:content-[''] focus-visible:rounded-full focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold-light"
              >
                <span className="pl-[0.34em]">{wedding.entry.prompt}</span>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </EntryContext.Provider>
  );
}
