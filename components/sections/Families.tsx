import { wedding, type Version } from '@/content/wedding';
import { SampleTag } from '@/components/SampleTag';

type Family = (typeof wedding.families)['bride'] | (typeof wedding.families)['groom'];

/** Thin cusped (multifoil) arch crown; sides and base are drawn with 1px borders below it. */
function ArchFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-gold dark:text-gold-light">
      <svg
        viewBox="0 0 400 96"
        preserveAspectRatio="none"
        className="absolute left-0 top-0 h-24 w-full overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          vectorEffect="non-scaling-stroke"
          d="M0 96V70Q0 50 20 48Q34 46 46 34Q60 14 100 10Q160 8 200 0Q240 8 300 10Q340 14 354 34Q366 46 380 48Q400 50 400 70V96"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 top-[95px] border-x border-b border-current" />
    </div>
  );
}

function Card({
  side,
  family,
  version,
}: {
  side: 'bride' | 'groom';
  family: Family;
  version: Version;
}) {
  const full = version === 'family';
  const note = side === 'bride' && 'parentsNote' in family ? family.parentsNote : null;
  return (
    <div className="relative flex">
      {/* anchor for the gold thread: above the card, top-centre */}
      <div data-thread-from={side} className="absolute -top-14 left-1/2 h-0 w-0" />
      <div className="thread-mask relative w-full px-6 pb-12 pt-32 text-center sm:px-10">
        <ArchFrame />
        <p className="text-accent font-serif text-lg italic">{family.label}</p>
        <ul className="mt-6 space-y-1 font-serif text-2xl leading-snug sm:text-3xl">
          {family.parents.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        {full && note && <p className="text-accent mt-2 text-sm italic">{note}</p>}
        <span aria-hidden="true" className="mx-auto mt-6 block h-px w-10 bg-gold dark:bg-gold-light" />
        <p className="measure mx-auto mt-6 text-[15px] leading-relaxed opacity-80">
          {family.description}
          <SampleTag />
        </p>
        <p className="mt-5 text-sm leading-relaxed opacity-80">{full ? family.address : family.town}</p>
      </div>
    </div>
  );
}

export function Families({ version }: { version: Version }) {
  const f = wedding.families;
  return (
    <section
      data-section="families"
      data-version={version}
      className="px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28"
    >
      <h2 className="mx-auto max-w-2xl text-center text-3xl leading-tight sm:text-4xl md:text-5xl">{f.heading}</h2>
      <div className="relative mx-auto mt-28 grid max-w-5xl gap-[72px] md:mt-32 md:grid-cols-2 md:gap-10 lg:gap-16">
        <Card side="bride" family={f.bride} version={version} />
        <Card side="groom" family={f.groom} version={version} />
        {/* the point where the two threads converge into one (desktop) */}
        <div data-thread-join className="absolute -bottom-32 left-1/2 hidden h-0 w-0 md:block" />
      </div>
    </section>
  );
}
