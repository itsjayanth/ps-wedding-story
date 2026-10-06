import { Lotus } from './ornaments';

/** Elegant frame shown whenever a photo or video is missing, so the page always looks intentional. */
export function Placeholder({ caption, className = '' }: { caption: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={caption}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(80% 60% at 50% 38%, rgb(246 236 208) 0%, rgb(230 217 188) 55%, rgb(214 196 154) 100%)',
      }}
    >
      <div className="jali-bg absolute inset-0 opacity-[0.07]" />
      <div className="absolute inset-3 border border-gold/50 sm:inset-4" />
      <div className="absolute inset-[18px] border border-gold/25 sm:inset-[22px]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <Lotus className="h-9 w-14 text-gold/70" />
        <p className="font-serif text-base italic text-gold-deep sm:text-lg">
          {caption}
          {process.env.NODE_ENV === 'development' ? ' (placeholder)' : ''}
        </p>
      </div>
    </div>
  );
}
