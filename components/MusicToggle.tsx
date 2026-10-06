'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { wedding } from '@/content/wedding';
import { useEntry } from './entry/context';

const FADE_MS = 1500;
const TARGET = 0.6;

/** Off by default. Starts only after an explicit tap; fades in and out. Hides itself if the file is missing. */
export function MusicToggle() {
  const { entered } = useEntry();
  const [on, setOn] = useState(false);
  const [available, setAvailable] = useState(true);
  const audio = useRef<HTMLAudioElement | null>(null);
  const timer = useRef<number | null>(null);

  const hide = useCallback(() => {
    setAvailable(false);
    setOn(false);
    if (process.env.NODE_ENV === 'development') console.warn(`[music] missing ${wedding.music.src}; toggle hidden`);
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(wedding.music.src, { method: 'HEAD' })
      .then((r) => { if (!cancelled && !r.ok) hide(); })
      .catch(() => { if (!cancelled) hide(); });
    return () => { cancelled = true; };
  }, [hide]);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
    audio.current?.pause();
  }, []);

  const ramp = (a: HTMLAudioElement, to: number, done?: () => void) => {
    if (timer.current) window.clearInterval(timer.current);
    const from = a.volume;
    const start = performance.now();
    timer.current = window.setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / FADE_MS);
      a.volume = Math.max(0, Math.min(1, from + (to - from) * t));
      if (t >= 1) {
        if (timer.current) window.clearInterval(timer.current);
        done?.();
      }
    }, 50);
  };

  const toggle = () => {
    if (!on) {
      if (!audio.current) {
        const a = new Audio(wedding.music.src);
        a.loop = true;
        a.volume = 0;
        a.addEventListener('error', hide);
        audio.current = a;
      }
      const a = audio.current;
      a.play().then(() => ramp(a, TARGET)).catch(() => setOn(false));
      setOn(true);
    } else {
      setOn(false);
      const a = audio.current;
      if (a) ramp(a, 0, () => a.pause());
    }
  };

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={`${wedding.music.label}: ${on ? 'on' : 'off'}`}
      className="fixed z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold-light/70 bg-bronze/45 text-gold-light backdrop-blur-md transition-opacity duration-[1400ms]"
      style={{
        top: 'calc(var(--safe-top) + 14px)',
        right: 'max(14px, env(safe-area-inset-right, 0px))',
        opacity: entered ? 1 : 0,
      }}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 9.5h3l4-3.5v12l-4-3.5H4z" />
        {on ? (
          <>
            <path d="M14.5 9.2a4 4 0 0 1 0 5.6" />
            <path d="M17 6.8a7.2 7.2 0 0 1 0 10.4" />
          </>
        ) : (
          <path d="M15 9.5l5 5M20 9.5l-5 5" />
        )}
      </svg>
    </button>
  );
}
