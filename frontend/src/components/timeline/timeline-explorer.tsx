'use client';
import { motion } from 'framer-motion';
import { Clapperboard, Columns3, GalleryHorizontalEnd, LayoutGrid, ListTree } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useEvents, useTimelines } from '@/lib/hooks';
import { useApp, type TimelineMode } from '@/lib/store';
import type { TimelineId } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn } from '@/lib/utils';
import { Select } from '../ui/input';
import { EmptyState, Spinner } from '../ui/misc';
import { CenturyView } from './century-view';
import { EventGrid } from './event-grid';
import { HorizontalTimeline } from './horizontal-timeline';
import { JourneyMode } from './journey-mode';
import { VerticalTimeline } from './vertical-timeline';

const MODES: { id: TimelineMode; label: string; icon: React.ComponentType<{ className?: string }>; hint: string }[] = [
  { id: 'horizontal', label: 'Horizontal', icon: GalleryHorizontalEnd, hint: 'Zoom & drag' },
  { id: 'vertical', label: 'Story', icon: ListTree, hint: 'Scroll narrative' },
  { id: 'century', label: 'Centuries', icon: Columns3, hint: 'Overview' },
  { id: 'events', label: 'Events', icon: LayoutGrid, hint: 'Detailed cards' },
  { id: 'journey', label: 'Journey', icon: Clapperboard, hint: 'Documentary' },
];

const TABS: { id: TimelineId | 'all'; label: string }[] = [
  { id: 'bangladesh', label: 'Bangladesh' },
  { id: 'islamic', label: 'Islamic' },
  { id: 'world', label: 'World' },
  { id: 'all', label: 'All Combined' },
];

export function TimelineExplorer({ id }: { id: TimelineId | 'all' }) {
  const params = useSearchParams();
  const router = useRouter();
  const mode = useApp((s) => s.timelineMode);
  const setMode = useApp((s) => s.setTimelineMode);
  const era = params.get('era') ?? '';
  const category = params.get('category') ?? '';

  useEffect(() => {
    const m = params.get('mode') as TimelineMode | null;
    if (m && MODES.some((x) => x.id === m)) setMode(m);
  }, [params, setMode]);

  const { data: timelines } = useTimelines();
  const { data: events, isLoading } = useEvents({ timeline: id, era: era || undefined, category: category || undefined });
  const tl = timelines?.find((t) => t.id === id);
  const eras = useMemo(() => (id === 'all' ? [...new Set((events ?? []).map((e) => e.era))] : tl?.eras ?? []), [id, tl, events]);

  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    v ? p.set(k, v) : p.delete(k);
    p.delete('mode');
    router.replace(`?${p.toString()}`, { scroll: false });
  };

  const meta = id === 'all' ? null : TIMELINE_META[id];

  return (
    <div>
      <div className="relative overflow-hidden border-b border-line soft-gradient">
        <div className="absolute inset-0 grid-pattern opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {TABS.map((t) => (
              <Link
                key={t.id}
                href={`/timeline/${t.id}`}
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-semibold transition',
                  id === t.id ? 'bg-royal-600 text-white shadow-md shadow-royal-600/25' : 'bg-white text-muted ring-1 ring-line hover:text-royal-700',
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>
          <motion.div key={id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl">
            <h1 className="text-4xl font-semibold md:text-5xl">
              {id === 'all' ? 'All of History' : tl?.name ?? meta?.label}
              {tl?.nameBn && <span className="ml-3 align-middle font-bangla text-xl font-medium text-royal-500 md:text-2xl">{tl.nameBn}</span>}
            </h1>
            <p className="mt-3 text-muted">
              {id === 'all' ? 'Bangladesh, Islamic and World history on a single, connected timeline.' : tl?.description}
            </p>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-1 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-line">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
                    mode === m.id ? 'bg-royal-600 text-white shadow' : 'text-muted hover:bg-royal-50 hover:text-royal-700',
                  )}
                  title={m.hint}
                >
                  <m.icon className="size-4" /> {m.label}
                </button>
              ))}
            </div>
            <Select value={category} onChange={(e) => setParam('category', e.target.value)} className="w-auto min-w-44">
              <option value="">All categories</option>
              {Object.entries(CATEGORY_META).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Select>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <button
              onClick={() => setParam('era', '')}
              className={cn('shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold', !era ? 'bg-royal-100 text-royal-800' : 'bg-white text-muted ring-1 ring-line hover:text-royal-700')}
            >
              All eras
            </button>
            {(id === 'all' ? [] : eras).map((x) => (
              <button
                key={x}
                onClick={() => setParam('era', x)}
                className={cn('shrink-0 cursor-pointer rounded-full px-3 py-1 text-xs font-semibold', era === x ? 'bg-royal-100 text-royal-800' : 'bg-white text-muted ring-1 ring-line hover:text-royal-700')}
              >
                {x}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading || !events ? (
          <Spinner label="Loading timeline…" />
        ) : events.length === 0 ? (
          <EmptyState title="No events match these filters">Try another era or category.</EmptyState>
        ) : mode === 'horizontal' ? (
          <HorizontalTimeline events={events} eras={eras} />
        ) : mode === 'vertical' ? (
          <VerticalTimeline events={events} />
        ) : mode === 'century' ? (
          <CenturyView events={events} />
        ) : mode === 'events' ? (
          <EventGrid events={events} />
        ) : (
          <JourneyMode events={events} />
        )}
      </div>
    </div>
  );
}
