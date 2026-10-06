import { Lotus } from '../../ornaments';

/** Illustrated map card: fine gold roads and contours inside an arched frame. Decorative only. */
export function VenueMap({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative mx-auto w-full max-w-[22rem] overflow-hidden rounded-t-[999px] border border-gold/60 bg-ivory/40 dark:bg-bronze/40"
      style={{ aspectRatio: '4 / 5' }}
    >
      <div className="pointer-events-none absolute inset-[7px] rounded-t-[999px] border border-gold/25" />
      <svg viewBox="0 0 320 400" className="absolute inset-0 h-full w-full text-gold dark:text-gold-light" aria-hidden="true" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {/* contours */}
        <g opacity="0.3">
          <ellipse cx="238" cy="120" rx="96" ry="58" transform="rotate(-18 238 120)" />
          <ellipse cx="238" cy="120" rx="68" ry="38" transform="rotate(-18 238 120)" />
          <ellipse cx="238" cy="120" rx="40" ry="18" transform="rotate(-18 238 120)" />
          <ellipse cx="60" cy="330" rx="110" ry="50" transform="rotate(12 60 330)" />
          <ellipse cx="60" cy="330" rx="76" ry="30" transform="rotate(12 60 330)" />
        </g>
        {/* roads */}
        <g opacity="0.75">
          <path d="M-10 250C70 240 120 270 190 232S290 190 340 206" />
          <path d="M-10 258C70 248 120 278 190 240S290 198 340 214" opacity="0.5" />
          <path d="M150 -10C160 90 130 150 168 232C190 280 176 340 190 410" />
          <path d="M158 -10C168 90 138 150 176 232C198 280 184 340 198 410" opacity="0.5" />
        </g>
        <g opacity="0.4">
          <path d="M-10 120C50 130 90 110 140 140" />
          <path d="M190 232C230 270 280 280 340 300" />
          <path d="M60 408C70 340 100 320 120 262" />
          <path d="M214 -10C220 40 250 70 330 82" />
        </g>
        {/* ring around the pin */}
        <circle cx="168" cy="232" r="30" opacity="0.5" />
        <circle cx="168" cy="232" r="46" opacity="0.25" />
      </svg>
      <div className="absolute left-[52.5%] top-[58%] -translate-x-1/2 -translate-y-1/2">
        <Lotus className="h-9 w-12 text-gold-deep dark:text-gold-light" />
      </div>
    </div>
  );
}
