import { wedding, type Version } from '@/content/wedding';
import { Reveal } from '../Reveal';
import { SampleTag } from '../SampleTag';
import { BlessingVideo } from './parts/BlessingVideo';

function Quote({ quote, by, sample }: { quote: string; by: string; sample?: boolean }) {
  return (
    <figure className="thread-mask px-3 py-2 text-center">
      <blockquote className="font-serif text-2xl font-light italic leading-snug text-ink dark:text-ivory md:text-3xl">
        {quote}
        {sample && <SampleTag />}
      </blockquote>
      <figcaption className="mt-4 font-sans text-sm font-light text-accent">{by}</figcaption>
    </figure>
  );
}

export function Blessings({ version }: { version: Version }) {
  const b = wedding.blessings;
  const friends = version === 'friends';
  return (
    <section
      data-section="blessings"
      data-version={version}
      aria-labelledby="blessings-heading"
      className="relative py-24 pl-10 pr-6 md:px-10 md:py-40"
    >
      <Reveal duration={2.2} className="mx-auto max-w-5xl">
        <h2
          id="blessings-heading"
          className="thread-mask mx-auto w-fit px-4 py-2 text-center font-serif text-4xl font-light text-ink dark:text-ivory md:text-6xl"
        >
          {b.heading}
        </h2>
        <div className="mt-14 md:mt-20">
          <BlessingVideo />
        </div>
        <div className="mx-auto mt-20 flex max-w-2xl flex-col gap-16 md:mt-28 md:gap-24">
          {b.elders.map((q) => (
            <Quote key={q.by} {...q} sample />
          ))}
          {friends && b.friends.map((q) => <Quote key={q.by} {...q} sample />)}
        </div>
      </Reveal>
    </section>
  );
}
