import { wedding, type Version } from '@/content/wedding';
import { Media } from '../Media';
import { Reveal } from '../Reveal';
import { Lotus } from '../ornaments';
import { ClosingCountdown } from './parts/ClosingCountdown';

export function Closing({ version }: { version: Version }) {
  const { closing, couple, celebrations } = wedding;
  return (
    <section
      data-section="closing"
      data-version={version}
      aria-labelledby="closing-h"
      className="relative isolate overflow-hidden bg-bronze text-gold-light"
    >
      <Media media={closing.photo} sizes="100vw" className="absolute inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(180deg, rgb(42 31 20 / 0.92) 0%, rgb(42 31 20 / 0.78) 45%, rgb(42 31 20 / 0.94) 100%)' }}
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center py-24 pl-10 pr-6 pb-safe text-center sm:py-32">
        <div data-thread-end className="mx-auto h-6 w-0" />
        <div className="mt-10">
          <ClosingCountdown target={closing.countdownTarget} doneLine="Today is the day. Thank you for being with us." />
        </div>
        <Reveal className="flex flex-col items-center">
          <h2 id="closing-h" className="mt-24 max-w-[22ch] font-serif text-4xl font-light leading-tight text-ivory sm:text-6xl">
            {closing.line}
          </h2>
          <Lotus className="mt-12 h-8 w-12 text-gold-light/60" />
          <p className="mt-10 font-serif text-3xl font-light text-ivory sm:text-4xl">{couple.ampersandNames}</p>
          <p lang="kn" className="kn mt-3 text-lg text-gold-light">{couple.kannada}</p>
          <p className="mt-12 max-w-[40ch] text-base">{closing.wishes}</p>
          {version === 'family' && (
            <div className="mt-10">
              <p className="font-serif text-xl italic text-gold-light">{celebrations.awaiting.label}:</p>
              <ul className="mt-3 space-y-1 text-base">
                {celebrations.awaiting.names.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
