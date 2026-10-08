'use client';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface GalleryItem {
  src: string;
  caption?: string;
  credit?: string;
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;
  const cur = open !== null ? items[open] : null;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((it, i) => (
          <button
            key={it.src + i}
            onClick={() => setOpen(i)}
            className={cn('group relative cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-royal-50', i === 0 && items.length > 2 && 'col-span-2 row-span-2')}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={it.caption || 'Historical image'} loading="lazy" className="aspect-square h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            {it.caption && (
              <span className="absolute inset-x-0 bottom-0 line-clamp-2 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 text-left text-[11px] text-white opacity-0 transition group-hover:opacity-100">
                {it.caption}
              </span>
            )}
          </button>
        ))}
      </div>
      {cur && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-royal-950/90 p-4 backdrop-blur" onClick={() => setOpen(null)}>
          <button className="absolute right-4 top-4 cursor-pointer rounded-full bg-white/10 p-2 text-white" aria-label="Close"><X /></button>
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => (e.stopPropagation(), setOpen((open! - 1 + items.length) % items.length))}
                className="absolute left-4 cursor-pointer rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={(e) => (e.stopPropagation(), setOpen((open! + 1) % items.length))}
                className="absolute right-4 cursor-pointer rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cur.src} alt={cur.caption || ''} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
            {(cur.caption || cur.credit) && (
              <figcaption className="mt-3 text-center text-sm text-white/80">
                {cur.caption} {cur.credit && <span className="text-white/50">· {cur.credit}</span>}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
