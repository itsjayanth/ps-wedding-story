'use client';
import { useEffect, useState } from 'react';

type Left = { d: number; h: number; m: number; s: number } | 'done' | null;
type Labels = { days: string; hours: string; minutes: string; seconds: string };

function compute(target: number): Left {
  const diff = target - Date.now();
  if (diff <= 0) return 'done';
  const t = Math.floor(diff / 1000);
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ClosingCountdown({ target, doneLine, labels, sentence }: { target: string; doneLine: string; labels: Labels; sentence: string }) {
  const [left, setLeft] = useState<Left>(null);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const t = new Date(target).getTime();
    const say = (l: Left) =>
      l && l !== 'done' ? `${l.d} days, ${l.h} hours and ${l.m} minutes ${sentence}` : l === 'done' ? doneLine : '';
    const first = compute(t);
    setLeft(first);
    setSummary(say(first));
    const id = window.setInterval(() => setLeft(compute(t)), 1000);
    const sid = window.setInterval(() => setSummary(say(compute(t))), 60000);
    return () => {
      window.clearInterval(id);
      window.clearInterval(sid);
    };
  }, [target, doneLine, sentence]);

  if (left === 'done') {
    return <p className="foil-text font-serif text-4xl italic sm:text-6xl">{doneLine}</p>;
  }

  const units: [string, string][] = [
    [labels.days, left ? String(left.d) : '—'],
    [labels.hours, left ? pad(left.h) : '—'],
    [labels.minutes, left ? pad(left.m) : '—'],
    [labels.seconds, left ? pad(left.s) : '—'],
  ];

  return (
    <div>
      <p className="sr-only" role="status" aria-live="off">{summary}</p>
      <dl aria-hidden="true" className="grid grid-cols-4 gap-2.5 sm:gap-6">
        {units.map(([label, v]) => (
          <div key={label} className="relative rounded-t-[999px] border border-gold-light/55 p-[3px]">
            <div className="rounded-t-[999px] border border-gold-light/25 bg-ivory/[0.05] px-1 pb-4 pt-8 text-center shadow-[inset_0_1px_0_rgb(248_244_232/0.12),0_18px_50px_rgb(0_0_0/0.35)] backdrop-blur-md sm:px-3 sm:pb-6 sm:pt-12">
              <dd className="foil-text font-serif text-[2.1rem] font-normal leading-none [font-variant-numeric:lining-nums_tabular-nums] sm:text-[5.5rem]">{v}</dd>
              <span className="mx-auto mt-3 block h-px w-6 bg-gold-light/50 sm:mt-5 sm:w-10" />
              <dt className="mt-2 font-serif text-[0.7rem] italic text-gold-light/85 sm:mt-3 sm:text-base">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
