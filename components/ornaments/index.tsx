/**
 * Thin gold line-art SVG ornaments. Contract (do not change signatures):
 * every ornament accepts { className?: string } and uses stroke="currentColor", 1px
 * non-scaling stroke, fill none. Colour them with text-gold / text-gold-light classes.
 */
import type { SVGProps } from 'react';

export type OrnamentProps = { className?: string } & Omit<SVGProps<SVGSVGElement>, 'className'>;

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' } as const;

/** Mysore-palace style cusped (multifoil) arch outline. Stretches to its box (preserveAspectRatio none off). */
export function MultifoilArch({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 260" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M10 256V120C10 60 60 10 100 4c40 6 90 56 90 116v136z" />
    </svg>
  );
}
export function Gopuram({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M20 112h80M28 112V92h64v20M36 92V74h48v18M44 74V58h32v16M52 58V44h16v14M60 44V30M56 112v-12h8v12" />
    </svg>
  );
}
export function Lotus({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M60 70C48 56 48 32 60 12c12 20 12 44 0 58zM60 70C40 66 26 52 22 34c20 2 34 14 38 36zM60 70c20-4 34-18 38-36-20 2-34 14-38 36z" />
    </svg>
  );
}
export function Kalasha({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 80 120" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M30 40h20M26 46c-8 14-8 38 4 50h20c12-12 12-36 4-50zM32 96h16v8H32zM40 40V28M34 22c0-8 12-8 12 0s-12 8-12 0z" />
    </svg>
  );
}
/** Fine lattice strip, tiles horizontally. */
export function Jali({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 16" preserveAspectRatio="none" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M0 8h240M0 1h240M0 15h240" />
    </svg>
  );
}
export function Kolam({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M10 20c10-14 20-14 30 0s20 14 30 0 20-14 30 0" />
    </svg>
  );
}
/** Brass diya with an optional lit flame. */
export function Diya({ className, lit = false, ...p }: OrnamentProps & { lit?: boolean }) {
  return (
    <svg viewBox="0 0 100 80" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M10 44c10 22 70 22 80 0z" />
      {lit && <path {...base} d="M50 40c-8-8-8-18 0-28 8 10 8 20 0 28z" />}
    </svg>
  );
}
export function Diamond({ className, ...p }: OrnamentProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...p}>
      <path {...base} d="M12 2l10 10-10 10L2 12z" />
    </svg>
  );
}
export function Gandaberunda({ className, ...p }: OrnamentProps) {
  return Lotus({ className, ...p });
}
