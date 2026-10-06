import { wedding } from '@/content/wedding';
import { Reveal } from '../Reveal';
import { VenueMap } from './parts/VenueMap';

const btn =
  'inline-flex min-h-[44px] items-center justify-center border border-gold px-7 py-3 text-[0.95rem] font-normal text-accent transition-colors duration-[900ms] ease-calm hover:bg-gold/10 focus-visible:bg-gold/10';

export function Venue() {
  const { venue } = wedding;
  return (
    <section data-section="venue" aria-labelledby="venue-h" className="px-6 py-24 pb-safe pl-10 sm:py-32 md:px-10">
      <Reveal className="mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-2 md:gap-20">
        <VenueMap label={`Illustrated map of ${venue.full}`} />
        <div className="text-center md:text-left">
          <h2 id="venue-h" className="font-serif text-4xl font-light sm:text-5xl">{venue.heading}</h2>
          <p className="mt-8 font-serif text-2xl font-light sm:text-3xl">{venue.name}</p>
          <p className="mt-2 text-accent">{venue.locality}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center md:justify-start">
            <a href={venue.mapsUrl} target="_blank" rel="noopener noreferrer" className={btn}>Open in Google Maps</a>
            <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={btn}>Get directions</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
