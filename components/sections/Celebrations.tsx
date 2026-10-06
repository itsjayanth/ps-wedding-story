import { wedding, type Version } from '@/content/wedding';
import { Gopuram, Kolam } from '../ornaments';
import { Reveal } from '../Reveal';
import { SampleTag } from '../SampleTag';

export function Celebrations({ version }: { version: Version }) {
  const c = wedding.celebrations;
  const family = version === 'family';
  return (
    <section
      data-section="celebrations"
      data-version={version}
      aria-labelledby="celebrations-heading"
      className="relative bg-surface-alt py-24 pl-10 pr-6 md:px-10 md:py-40"
      style={{ '--mask-bg': 'var(--surface-alt)' } as React.CSSProperties}
    >
      <Reveal duration={2.2} className="mx-auto max-w-5xl text-center">
        <h2
          id="celebrations-heading"
          className="thread-mask mx-auto w-fit px-4 py-2 font-serif text-4xl font-light text-ink dark:text-ivory md:text-6xl"
        >
          {c.heading}
        </h2>

        <div className="mt-16 grid gap-20 md:mt-24 md:grid-cols-2 md:gap-x-24 md:gap-y-0">
          {c.events.map((e) => (
            <article key={e.id} aria-labelledby={`ev-${e.id}`} className="thread-mask mx-auto w-full max-w-sm px-3 py-4">
              <p className="kn text-4xl font-normal leading-snug text-accent md:text-5xl">{e.kannada}</p>
              <h3 id={`ev-${e.id}`} className="mt-3 font-serif text-2xl font-light text-ink dark:text-ivory md:text-3xl">
                {e.title}
              </h3>
              <p className="mt-6 font-sans text-base font-light text-ink dark:text-ivory">
                {e.day}, {e.date}
              </p>
              <p className="mt-1 font-sans text-base font-light text-ink dark:text-ivory">{e.time}</p>
              <p className="mx-auto mt-6 max-w-[30ch] font-serif text-lg font-light italic text-ink/80 dark:text-ivory/80">
                {e.meaning}
                <SampleTag />
              </p>
            </article>
          ))}
        </div>

        <div className="thread-mask mx-auto my-16 flex w-fit items-end justify-center gap-6 px-4 py-2 text-gold dark:text-gold-light md:my-24" aria-hidden="true">
          <Kolam className="h-8 w-8" />
          <Gopuram className="h-14 w-14" />
          <Kolam className="h-8 w-8" />
        </div>

        <figure className="thread-mask mx-auto max-w-[44ch] px-3 py-2">
          <blockquote className="font-serif text-xl font-light italic leading-relaxed text-ink dark:text-ivory md:text-2xl">
            {c.printedLine}
          </blockquote>
        </figure>

        {family && (
          <div className="thread-mask mx-auto mt-16 max-w-[52ch] px-3 py-3 md:mt-24">
            <p className="font-sans text-base font-light leading-relaxed text-ink dark:text-ivory">{c.formalInvitation}</p>
            <p className="mt-8 font-serif text-xl font-light italic text-accent">{c.awaiting.label}:</p>
            <ul className="mt-3 space-y-1 font-sans text-base font-light text-ink dark:text-ivory">
              {c.awaiting.names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </Reveal>
    </section>
  );
}
