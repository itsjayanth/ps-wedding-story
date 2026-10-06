/** Thin double gold rule with a small diamond at its centre. */
export function DoubleRule({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`relative mx-auto flex w-full max-w-[22rem] items-center justify-center ${className}`}>
      <div className="flex-1">
        <div className="h-px bg-gradient-to-r from-transparent to-gold-light/80" />
        <div className="mt-[3px] h-px bg-gradient-to-r from-transparent to-gold-light/40" />
      </div>
      <svg viewBox="0 0 16 16" className="mx-3 h-3 w-3 shrink-0 text-gold-light" fill="none" stroke="currentColor" strokeWidth={1}>
        <path d="M8 1l7 7-7 7-7-7z" />
        <path d="M8 5l3 3-3 3-3-3z" fill="currentColor" />
      </svg>
      <div className="flex-1">
        <div className="h-px bg-gradient-to-l from-transparent to-gold-light/80" />
        <div className="mt-[3px] h-px bg-gradient-to-l from-transparent to-gold-light/40" />
      </div>
    </div>
  );
}
