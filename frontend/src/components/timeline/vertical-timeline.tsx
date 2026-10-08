'use client';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { HistoricalEvent } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn } from '@/lib/utils';
import { EventImage } from '../event/event-image';
import { Badge } from '../ui/badge';

/** Story mode – a scrolling, alternating vertical narrative grouped by era. */
export function VerticalTimeline({ events }: { events: HistoricalEvent[] }) {
  const groups: { era: string; items: HistoricalEvent[] }[] = [];
  for (const e of events) {
    const last = groups[groups.length - 1];
    if (last && last.era === e.era) last.items.push(e);
    else groups.push({ era: e.era, items: [e] });
  }
  let n = 0;
  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="absolute bottom-0 left-5 top-0 w-[3px] rounded bg-gradient-to-b from-royal-500 via-sky2-400 to-royal-200 md:left-1/2 md:-translate-x-1/2" />
      {groups.map((g, gi) => (
        <section key={`${g.era}-${gi}`} className="relative pb-6">
          <div className="sticky top-20 z-10 mb-8 flex md:justify-center">
            <span className="ml-0 rounded-full bg-royal-600 px-5 py-2 font-display text-sm font-semibold text-white shadow-lg shadow-royal-600/30 md:ml-0">
              {g.era}
            </span>
          </div>
          {g.items.map((e) => {
            const left = n++ % 2 === 0;
            const color = TIMELINE_META[e.timeline].color;
            return (
              <div key={e.id} className={cn('relative mb-10 flex pl-14 md:pl-0', left ? 'md:justify-start' : 'md:justify-end')}>
                <div className="absolute left-5 top-6 z-[1] -translate-x-1/2 md:left-1/2">
                  <span className="block size-4 rounded-full border-[3px] border-white shadow-md" style={{ background: color }} />
                </div>
                <motion.article
                  initial={{ opacity: 0, x: left ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className={cn('group w-full md:w-[calc(50%-2.5rem)]')}
                >
                  <Link href={`/events/${e.id}`} className="block overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:shadow-xl hover:shadow-royal-600/10">
                    <EventImage event={e} className="aspect-[2/1]" />
                    <div className="p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-display text-base font-bold" style={{ color }}>{e.dateLabel}</span>
                        <Badge color={CATEGORY_META[e.category]?.color}>{CATEGORY_META[e.category]?.label}</Badge>
                      </div>
                      <h3 className="mt-1 font-display text-xl font-semibold group-hover:text-royal-700">{e.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{e.summary}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ink/80">{e.description}</p>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted">
                        <span className="flex items-center gap-1 truncate"><MapPin className="size-3.5 text-royal-400" /> {e.locations[0]?.name}</span>
                        <span className="flex items-center gap-1 font-semibold text-royal-600">Read <ArrowRight className="size-3.5" /></span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
