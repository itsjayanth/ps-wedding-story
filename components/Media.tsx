'use client';
import Image from 'next/image';
import { useState } from 'react';
import type { MediaRef } from '@/content/wedding';
import { Placeholder } from './Placeholder';

interface Props {
  media: MediaRef;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** CSS aspect ratio applied to the wrapper, e.g. "3 / 4". Omit if parent sizes it. */
  aspect?: string;
}

/** next/image that falls back to <Placeholder/> if the file is missing or fails to load. */
export function Media({ media, sizes, priority, className = '', aspect }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`} style={aspect ? { aspectRatio: aspect } : undefined}>
      <Placeholder caption={media.caption} className="absolute inset-0" />
      {!failed && (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => {
            setFailed(true);
            if (process.env.NODE_ENV === 'development') console.warn(`[media] missing ${media.src}`);
          }}
        />
      )}
    </div>
  );
}
