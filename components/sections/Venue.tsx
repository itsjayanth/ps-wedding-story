import { wedding } from '@/content/wedding';
import { Reveal } from '../Reveal';
import { VenueMap } from './parts/VenueMap';
import { MaskLines } from './parts/MaskLine';
import { FoilPill } from './parts/FoilPill';

export function Venue() {
  const { venue } = wedding;
  return (
    <section data-section="venue" aria-labelledby="venue-h" className="paper overflow-hidden px-6 py-28 pb-safe pl-10 sm:py-40 md:px-10">
      <div aria-hidden="true" className="jali-bg pointer-events-none absolute inset-0 -z-10 opacity-[0.05]" />
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-[1.05fr_1fr] md:gap-24">
        <VenueMap label={`Illustrated map of ${venue.full}`} name={venue.name} caption={venue.mapCaption} />
        <div className="text-center md:text-left">
          <h2 id="venue-h" className="font-serif text-[clamp(3.4rem,9vw,7rem)] font-normal leading-[0.95] tracking-tight">
            <MaskLines lines={venue.heading.split(' ').map((w, i, arr) => (i === 0 && arr.length > 1 ? <span key={w} className="italic text-accent">{w}</span> : <span key={w}>{w}</span>))} />
          </h2>
          <Reveal delay={0.4}>
            <div className="mx-auto mt-8 flex max-w-[16rem] items-center gap-3 md:mx-0" aria-hidden="true">
              <span className="gold-rule h-px flex-1" />
              <span className="h-1.5 w-1.5 rotate-45 border border-gold" />
              <span className="gold-rule h-px flex-1" />
            </div>
            <p className="mt-8 font-serif text-2xl italic text-accent sm:text-3xl">{venue.locality}</p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
              <FoilPill href={venue.mapsUrl}>Open in Google Maps</FoilPill>
              <FoilPill href={venue.directionsUrl}>Get directions</FoilPill>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
