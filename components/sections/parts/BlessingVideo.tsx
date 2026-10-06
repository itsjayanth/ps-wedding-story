'use client';
import { useEffect, useRef, useState } from 'react';
import { wedding } from '@/content/wedding';
import { Media } from '../../Media';
import { Placeholder } from '../../Placeholder';

const v = wedding.blessings.video;

/** Poster-first engagement film. Video is only mounted after the viewer asks for it. */
export function BlessingVideo() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    let live = true;
    fetch(v.src, { method: 'HEAD' })
      .then((r) => live && setAvailable(r.ok && (r.headers.get('content-type') ?? '').startsWith('video')))
      .catch(() => live && setAvailable(false));
    return () => {
      live = false;
    };
  }, [near]);

  const poster = { src: v.poster, alt: 'A still from the engagement film', caption: v.caption };
  const canPlay = available === true;

  return (
    <div ref={ref} className="relative aspect-video w-full overflow-hidden bg-sandstone">
      {!near ? (
        <Placeholder caption={v.caption} className="absolute inset-0" />
      ) : playing && canPlay ? (
        <video
          src={v.src}
          poster={v.poster}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          muted
          playsInline
          autoPlay
          preload="metadata"
          onError={() => {
            setPlaying(false);
            setAvailable(false);
          }}
        />
      ) : (
        <>
          <Media media={poster} sizes="(min-width: 1024px) 960px, 100vw" className="absolute inset-0" />
          <button
            type="button"
            disabled={!canPlay}
            onClick={() => setPlaying(true)}
            aria-label={canPlay ? 'Play the engagement film' : 'The engagement film is not available yet'}
            className="absolute inset-0 flex items-center justify-center transition-colors duration-[1200ms] ease-calm enabled:hover:bg-bronze/10 disabled:cursor-default"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full border border-gold-light/80 bg-bronze/30 backdrop-blur-sm transition-opacity duration-[1200ms] md:h-20 md:w-20 ${
                canPlay ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-5 w-5 fill-none stroke-gold-light" strokeWidth="1" aria-hidden="true">
                <path d="M7 4.5v15l12-7.5z" />
              </svg>
            </span>
          </button>
        </>
      )}
    </div>
  );
}
