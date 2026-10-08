'use client';
import {
  BookOpen, Castle, CloudLightning, Coins, Compass, Crown, FlaskConical, Landmark, Megaphone, Cpu, Moon, Swords,
} from 'lucide-react';
import { useState } from 'react';
import type { HistoricalEvent } from '@/lib/types';
import { CATEGORY_META, cn } from '@/lib/utils';
import { useWikiSummary } from '@/lib/wiki';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  politics: Landmark, war: Swords, religion: Moon, prophet: Moon, culture: BookOpen, science: FlaskConical, technology: Cpu,
  economy: Coins, movement: Megaphone, disaster: CloudLightning, dynasty: Crown, exploration: Compass,
};

/** Decorative cover used when no photo is available (and always for prophets, out of respect). */
export function PatternCover({ event, className, compact }: { event: Pick<HistoricalEvent, 'category' | 'title' | 'timeline'>; className?: string; compact?: boolean }) {
  const Icon = ICONS[event.category] ?? Castle;
  const color = CATEGORY_META[event.category]?.color ?? '#1f3be0';
  return (
    <div
      className={cn('relative flex h-full w-full items-center justify-center overflow-hidden', className)}
      style={{ background: `linear-gradient(135deg, ${color}1f, #eef3ff 55%, ${color}14)` }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-[0.18]" aria-hidden>
        <defs>
          <pattern id={`p-${event.category}`} width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M22 2l6 14 14 6-14 6-6 14-6-14-14-6 14-6z" fill="none" stroke={color} strokeWidth="1" />
            <circle cx="22" cy="22" r="4" fill="none" stroke={color} strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p-${event.category})`} />
      </svg>
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <div className="rounded-2xl bg-white/80 p-3 shadow-sm" style={{ color }}>
          <Icon className={compact ? 'size-5' : 'size-7'} />
        </div>
        {!compact && <p className="line-clamp-2 max-w-xs font-display text-sm font-semibold text-ink/80">{event.title}</p>}
      </div>
    </div>
  );
}

export function EventImage({
  event, className, compact, priority,
}: {
  event: Pick<HistoricalEvent, 'images' | 'wikiTitle' | 'noImage' | 'category' | 'title' | 'timeline'>;
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const own = event.images?.[0]?.url;
  const wiki = useWikiSummary(event.wikiTitle, !own && !event.noImage);
  const [failed, setFailed] = useState(false);
  const src = own ?? (event.noImage ? undefined : wiki.data?.thumbnail);

  return (
    <div className={cn('relative overflow-hidden bg-royal-50', className)}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={event.images?.[0]?.caption || event.title}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      ) : wiki.isLoading && !event.noImage && !own ? (
        <div className="h-full w-full animate-pulse bg-royal-50" />
      ) : (
        <PatternCover event={event} compact={compact} />
      )}
    </div>
  );
}
