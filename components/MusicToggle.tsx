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
      className="group fixed z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold-light/80 bg-[rgb(27_20_12/0.55)] p-[3px] text-gold-light shadow-[0_0_24px_rgb(216_183_106/0.25)] backdrop-blur-md transition-[opacity,box-shadow] duration-[1400ms] hover:shadow-[0_0_32px_rgb(216_183_106/0.45)]"
      style={{
        top: 'calc(var(--safe-top) + 14px)',
        right: 'max(14px, env(safe-area-inset-right, 0px))',
        opacity: entered ? 1 : 0,
      }}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full border border-gold-light/30">
        {on ? (
          <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="music-bar w-[2px] rounded-full bg-gold-light" style={{ animationDelay: `${i * 0.18}s`, height: '100%' }} />
            ))}
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19c-4-2.6-5-8-0-13 5 5 4 10.4 0 13Z" />
            <path d="M12 19c-5.500-.5-8-4-8.500-8 4.500 0 7.800 3 8.500 8Z" opacity="0.8" />
            <path d="M12 19c5.500-.5 8-4 8.500-8-4.500 0-7.800 3-8.500 8Z" opacity="0.8" />
          </svg>
        )}
      </span>
      <style>{`@keyframes music-bar{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}.music-bar{transform-origin:bottom;animation:music-bar 1.1s ease-in-out infinite}@media (prefers-reduced-motion:reduce){.music-bar{animation:none;transform:scaleY(.7)}}`}</style>
    </button>
  );
}
