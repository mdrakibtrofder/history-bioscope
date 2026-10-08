'use client';
import { ArrowDownUp, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { matchesText } from '@/lib/data/logic';
import type { HistoricalEvent } from '@/lib/types';
import { EventCard } from '../event/event-card';
import { EmptyState } from '../ui/misc';

export function EventGrid({ events }: { events: HistoricalEvent[] }) {
  const [q, setQ] = useState('');
  const [desc, setDesc] = useState(false);
  const list = useMemo(() => {
    const l = events.filter((e) => matchesText(e, q));
    return desc ? [...l].reverse() : l;
  }, [events, q, desc]);
  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        <div className="relative min-w-60 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter these events…"
            className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm focus:border-royal-400 focus:outline-none"
          />
        </div>
        <button onClick={() => setDesc((d) => !d)} className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 text-sm font-semibold hover:bg-royal-50">
          <ArrowDownUp className="size-4" /> {desc ? 'Newest first' : 'Oldest first'}
        </button>
      </div>
      {list.length === 0 ? (
        <EmptyState title="No matching events" />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      )}
    </div>
  );
}
