import { wedding, type Version } from '@/content/wedding';
import { Media } from '../Media';
import { Reveal } from '../Reveal';

/** Per-photo layout: mobile (2 columns) and desktop (12 columns) spans, aspect, and stagger. */
const layout = [
  { c: 'col-span-2 md:col-span-7', a: '4 / 3' },
  { c: 'col-span-1 md:col-span-5 md:mt-24', a: '3 / 4' },
  { c: 'col-span-1 mt-10 md:mt-0 md:col-span-4', a: '3 / 4' },
  { c: 'col-span-2 md:col-span-8 md:mt-16', a: '4 / 3' },
  { c: 'col-span-1 md:col-span-5 md:col-start-2', a: '3 / 4' },
  { c: 'col-span-1 mt-10 md:mt-24 md:col-span-6', a: '4 / 3' },
  { c: 'col-span-2 md:col-span-7 md:col-start-1', a: '4 / 3' },
  { c: 'col-span-2 md:col-span-4 md:col-start-9 md:-mt-10', a: '3 / 4' },
];

export function Moments({ version }: { version: Version }) {
  const m = wedding.moments;
  const count = m.counts[version];
  const photos = m.photos.slice(0, count);
  return (
    <section
      data-section="moments"
      data-version={version}
      aria-labelledby="moments-heading"
      className="relative py-24 pl-10 pr-6 md:px-10 md:py-40"
    >
      <Reveal duration={2.4} className="mx-auto max-w-6xl">
        <h2
          id="moments-heading"
          className="thread-mask mx-auto w-fit px-4 py-2 text-center font-serif text-4xl font-light text-ink dark:text-ivory md:text-6xl"
        >
          {m.heading}
        </h2>
        <div className="mt-14 grid grid-cols-2 items-start gap-x-4 gap-y-6 md:mt-24 md:grid-cols-12 md:gap-x-10 md:gap-y-16">
          {photos.map((p, i) => (
            <div key={p.src} className={layout[i % layout.length].c}>
              <Media
                media={p}
                aspect={layout[i % layout.length].a}
                sizes="(min-width: 768px) 55vw, 90vw"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
