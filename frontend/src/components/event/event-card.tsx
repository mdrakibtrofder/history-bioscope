'use client';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import type { HistoricalEvent } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { EventImage } from './event-image';

export function EventCard({ event, className, index = 0 }: { event: HistoricalEvent; className?: string; index?: number }) {
  const cat = CATEGORY_META[event.category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index, 8) * 0.04 }}
      className={className}
    >
      <Link
        href={`/events/${event.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:border-royal-200 hover:shadow-xl hover:shadow-royal-600/10"
      >
        <div className="relative">
          <EventImage event={event} className="aspect-[16/9]" />
          <div className="absolute left-3 top-3 flex gap-1.5">
            <Badge className="bg-white/90 shadow-sm backdrop-blur" style={{ color: TIMELINE_META[event.timeline].color }}>
              {TIMELINE_META[event.timeline].short}
            </Badge>
            {event.status === 'draft' && <Badge className="bg-amber-100 text-amber-800">Draft</Badge>}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-royal-600">{event.dateLabel}</span>
            {cat && <Badge color={cat.color}>{cat.label}</Badge>}
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-royal-700">{event.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm text-muted">{event.summary}</p>
          <div className={cn('mt-auto flex items-center gap-1.5 pt-3 text-xs text-muted')}>
            <MapPin className="size-3.5 text-royal-400" />
            <span className="truncate">{event.locations.map((l) => l.name).join(' · ') || event.region}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
