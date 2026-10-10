'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MediaItem } from '@/lib/media';

type Props = {
  item: MediaItem;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Adds the mirror-light sweep on hover */
  mirror?: boolean;
};

/**
 * Every photograph on the site. Uses next/image (lazy, AVIF/WebP, responsive).
 * If the source is missing or fails, renders a soft branded placeholder that
 * names the shot to replace — so the layout stays intact during content swaps.
 */
export default function Media({ item, className = '', imgClassName = '', sizes = '100vw', priority, mirror }: Props) {
  const [failed, setFailed] = useState(!item.src);

  return (
    <div className={`media overflow-hidden bg-nude ${mirror ? 'mirror' : ''} ${className}`}>
      {failed ? (
        <div className="media-fallback absolute inset-0 flex items-end p-5" role="img" aria-label={item.alt}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-charcoal/50">Image · {item.label}</span>
        </div>
      ) : (
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
