import { wedding } from '@/content/wedding';
import { Reveal } from '../Reveal';

export function Rsvp() {
  const { rsvp } = wedding;
  return (
    <section
      data-section="rsvp"
      aria-labelledby="rsvp-h"
      className="relative overflow-hidden py-32 pl-10 pr-6 sm:py-44 md:px-10"
      style={{ ['--mask-bg' as string]: 'var(--night)', backgroundColor: 'rgb(var(--night))', color: 'rgb(var(--ivory))' }}
    >
      <Reveal className="relative mx-auto max-w-3xl text-center" duration={2}>
        <div className="mx-auto inline-block px-6 py-4 md:[background-color:rgb(var(--mask-bg))]">
          <h2 id="rsvp-h" className="font-script foil-text px-4 py-2 text-[clamp(3.2rem,10.5vw,8rem)] leading-[1.05]">
            {rsvp.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-[34ch] font-serif text-xl italic text-ivory/85 sm:text-2xl">{rsvp.line}</p>
        </div>
        <div className="mt-14">
          <a
            href={rsvp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rsvp-glow group relative z-[1] inline-flex min-h-[56px] rounded-full p-[1.5px] focus-visible:outline-offset-6"
            style={{
              backgroundImage: 'var(--foil)',
              backgroundSize: '300% 100%',
              animation: 'foil-sweep 7s ease-in-out infinite alternate',
              boxShadow: '0 0 36px rgb(216 183 106 / 0.35), 0 0 90px rgb(184 137 58 / 0.22)',
            }}
          >
            <span className="inline-flex min-h-[53px] items-center justify-center rounded-full bg-[rgb(27_20_12)] px-12 py-3.5 font-serif text-lg italic tracking-wide text-gold-light transition-colors duration-[1200ms] ease-calm group-hover:bg-[rgb(40_30_18)] group-focus-visible:bg-[rgb(40_30_18)] sm:text-xl">
              {rsvp.button}
            </span>
          </a>
        </div>
      </Reveal>
      <div aria-hidden="true" className="jali-bg pointer-events-none absolute inset-0 opacity-[0.05]" />
    </section>
  );
}
