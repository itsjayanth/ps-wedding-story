import { wedding } from '@/content/wedding';
import { Reveal } from '../Reveal';

export function Rsvp() {
  const { rsvp } = wedding;
  return (
    <section
      data-section="rsvp"
      aria-labelledby="rsvp-h"
      className="bg-surface-alt py-24 pl-10 pr-6 sm:py-32 md:px-10"
      style={{ ['--mask-bg' as string]: 'var(--surface-alt)' }}
    >
      <Reveal className="mx-auto max-w-xl text-center">
        <div className="thread-mask mx-auto inline-block px-6 py-4">
          <h2 id="rsvp-h" className="font-serif text-4xl font-light sm:text-5xl">
            {rsvp.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-[34ch] text-lg">{rsvp.line}</p>
        </div>
        <div className="mt-10">
          <a
            href={rsvp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-[1] inline-flex min-h-[48px] items-center justify-center bg-bronze px-10 py-3.5 text-base font-normal text-gold-light ring-1 ring-gold transition-colors duration-[1200ms] ease-calm hover:bg-[rgb(52_39_26)] focus-visible:bg-[rgb(52_39_26)]"
          >
            {rsvp.button}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
