'use client';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { wedding } from '@/content/wedding';
import { EntryContext, ENTERED_EVENT } from './entry/context';
import { Diya } from './ornaments';

const KEY = 'ps-entered';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
type Phase = 'gate' | 'lighting' | 'leaving' | 'done';

function safeGet() {
  try { return window.sessionStorage.getItem(KEY) === '1'; } catch { return false; }
}
function safeSet() {
  try { window.sessionStorage.setItem(KEY, '1'); } catch { /* storage unavailable */ }
}

/** Quiet once-per-visit threshold. The page renders underneath (inert) so there is no flash. */
export function EntryGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>('gate');
  const entered = phase === 'leaving' || phase === 'done';

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

  const enter = useCallback(() => {
    if (phase !== 'gate') return;
    safeSet();
    setPhase('lighting');
    window.setTimeout(() => setPhase('leaving'), 1100);
    window.setTimeout(() => setPhase('done'), 1100 + 1400);
  }, [phase]);

  return (
    <EntryContext.Provider value={{ entered: phase === 'leaving' || phase === 'done' }}>
      <div inert={phase !== 'done' && phase !== 'leaving'} aria-hidden={phase === 'gate' || phase === 'lighting' ? true : undefined}>
        {children}
      </div>
      {phase !== 'done' && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={wedding.site.title}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ivory px-6 text-center text-bronze pt-safe pb-safe"
          initial={false}
          animate={{ opacity: entered ? 0 : 1 }}
          transition={{ duration: 1.4, ease: [0.22, 0.61, 0.36, 1] }}
          style={{ pointerEvents: entered ? 'none' : 'auto' }}
        >
          <div className="relative flex h-40 w-40 items-center justify-center">
            <motion.div
              aria-hidden
              className="absolute left-1/2 top-[22%] h-24 w-24 -translate-x-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, rgb(216 183 106 / 0.55), transparent 68%)' }}
              initial={false}
              animate={{ opacity: phase === 'gate' ? 0 : 1, scale: phase === 'gate' ? 0.6 : 1 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
            <Diya lit={phase !== 'gate'} className="relative h-full w-full text-gold-deep" />
          </div>
          <p className="mt-8 font-serif text-2xl font-light tracking-wide sm:text-3xl">{wedding.entry.caption}</p>
          <p className="mt-2 font-serif text-lg italic text-gold-deep">{wedding.couple.ampersandNames}</p>
          <button
            type="button"
            onClick={enter}
            disabled={phase !== 'gate'}
            className="mt-10 min-h-[44px] min-w-[44px] rounded-full border border-gold-deep/60 px-10 py-3 font-serif text-lg tracking-[0.18em] text-bronze transition-colors duration-700 hover:bg-gold/10 focus-visible:bg-gold/10"
          >
            {wedding.entry.prompt}
          </button>
        </motion.div>
      )}
    </EntryContext.Provider>
  );
}
