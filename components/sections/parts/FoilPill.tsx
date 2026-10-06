import type { ReactNode } from 'react';

/** Ornate thin-gold double-border pill link with a slow foil sweep on hover/focus. */
export function FoilPill({ href, children, dark = false }: { href: string; children: ReactNode; dark?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex min-h-[48px] items-center justify-center rounded-full border border-gold/70 p-[3px] focus-visible:outline-offset-4"
    >
      <span
        className={`relative inline-flex min-h-[40px] w-full items-center justify-center overflow-hidden rounded-full border border-gold/35 px-8 py-2.5 text-[0.95rem] font-normal tracking-wide ${dark ? 'text-gold-light' : 'text-gold-deep dark:text-gold-light'}`}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-gold-light/45 to-transparent opacity-0 transition-[transform,opacity] duration-[1400ms] ease-calm group-hover:translate-x-[320%] group-hover:opacity-100 group-focus-visible:translate-x-[320%] group-focus-visible:opacity-100"
        />
        <span className="relative">{children}</span>
      </span>
    </a>
  );
}
