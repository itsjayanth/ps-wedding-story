'use client';
import { useEffect, useState } from 'react';

type Left = { d: number; h: number; m: number; s: number } | 'done' | null;

function compute(target: number): Left {
  const diff = target - Date.now();
  if (diff <= 0) return 'done';
  const t = Math.floor(diff / 1000);
  return { d: Math.floor(t / 86400), h: Math.floor((t % 86400) / 3600), m: Math.floor((t % 3600) / 60), s: t % 60 };
}

const pad = (n: number) => String(n).padStart(2, '0');

export function ClosingCountdown({ target, doneLine }: { target: string; doneLine: string }) {
  const [left, setLeft] = useState<Left>(null);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const t = new Date(target).getTime();
    const sentence = (l: Left) =>
      l && l !== 'done'
        ? `${l.d} days, ${l.h} hours and ${l.m} minutes until the muhurtham.`
        : l === 'done'
          ? doneLine
          : '';
    const first = compute(t);
    setLeft(first);
    setSummary(sentence(first));
    const id = window.setInterval(() => setLeft(compute(t)), 1000);
    const sid = window.setInterval(() => setSummary(sentence(compute(t))), 60000);
    return () => {
      window.clearInterval(id);
      window.clearInterval(sid);
    };
  }, [target, doneLine]);

  if (left === 'done') {
    return <p className="font-serif text-3xl font-light text-gold-light sm:text-4xl">{doneLine}</p>;
  }

  const units: [string, string][] = [
    ['Days', left ? String(left.d) : '—'],
    ['Hours', left ? pad(left.h) : '—'],
    ['Minutes', left ? pad(left.m) : '—'],
    ['Seconds', left ? pad(left.s) : '—'],
  ];

  return (
    <div>
      <p className="sr-only" role="status" aria-live="off">{summary}</p>
      <dl aria-hidden="true" className="grid grid-cols-4 gap-x-3 sm:gap-x-10">
        {units.map(([label, v]) => (
          <div key={label} className="text-center">
            <dd className="foil-text font-serif text-[2.6rem] font-light leading-none tabular-nums [font-variant-numeric:lining-nums_tabular-nums] sm:text-7xl">{v}</dd>
            <dt className="mt-3 text-xs font-light text-gold-light/80 sm:text-sm">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
