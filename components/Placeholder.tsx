/** Elegant frame shown whenever a photo or video is missing, so the page always looks intentional. */
export function Placeholder({ caption, className = '' }: { caption: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={caption}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{
        background:
          'linear-gradient(160deg, rgb(var(--sandstone)) 0%, rgb(var(--surface-alt)) 55%, rgb(var(--sandstone)) 100%)',
      }}
    >
      <div className="absolute inset-3 border border-gold/50 sm:inset-4" />
      <p className="absolute inset-0 flex items-center justify-center px-6 text-center font-serif text-lg italic text-gold-deep dark:text-gold-light">
        {caption}
        {process.env.NODE_ENV === 'development' ? ' (placeholder)' : ''}
      </p>
    </div>
  );
}
