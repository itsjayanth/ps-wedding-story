'use client';
import { useId, type ReactNode } from 'react';

/** Palace-style pointed (ogee-shouldered) arch in a 0-100 box. Outer = clip + rule, inner = second rule. */
const OUTER = 'M0 100V20C0 11 38 9 50 0C62 9 100 11 100 20V100Z';
const INNER = 'M3 98V21.5C3 14.5 39 12.5 50 4C61 12.5 97 14.5 97 21.5V98Z';

/**
 * Arch-topped frame with a double gold rule. Children are clipped to the arch.
 * Colour the rules with a text colour class (stroke is currentColor).
 * Give it an `aspect` for photo frames, or leave it content-sized for card plates.
 */
export function ArchFrame({
  children,
  className = '',
  fillClassName = '',
  aspect,
  style,
}: {
  children: ReactNode;
  className?: string;
  fillClassName?: string;
  aspect?: string;
  style?: React.CSSProperties;
}) {
  const id = 'arch' + useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <div className={`relative ${className}`} style={{ aspectRatio: aspect, ...style }}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path transform="scale(0.01 0.01)" d={OUTER} />
          </clipPath>
        </defs>
      </svg>
      <div className={`relative h-full w-full ${fillClassName}`} style={{ clipPath: `url(#${id})` }}>
        {children}
      </div>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path d={OUTER} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
        <path d={INNER} strokeWidth={0.8} opacity={0.75} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
