'use client';
import { ArrowRight, BookOpen, CalendarClock, Search, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSearch } from '@/lib/hooks';
import { useApp } from '@/lib/store';
import { ENTITY_META, TIMELINE_META } from '@/lib/utils';
import { Dialog, DialogContent } from '../ui/dialog';

export function GlobalSearch() {
  const open = useApp((s) => s.searchOpen);
  const setOpen = useApp((s) => s.setSearchOpen);
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 200);
    return () => clearTimeout(t);
  }, [q]);

  const { data, isFetching } = useSearch({ q: debounced }, debounced.length > 1);
  const go = (href: string) => {
    setOpen(false);
    setQ('');
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent title="Search History Bioscope" description="Events, people, places, empires, battles, dates and stories" className="max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-royal-400" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && q.trim() && go(`/search?q=${encodeURIComponent(q.trim())}`)}
            placeholder="Try “Plassey”, “Abbasid”, “1971”, “Salahuddin”, “Silk Road”…"
            className="h-12 w-full rounded-2xl border border-line bg-royal-50/40 pl-11 pr-4 text-base focus:border-royal-400 focus:outline-none focus:ring-4 focus:ring-royal-100"
          />
        </div>
        <div className="mt-4 max-h-[55vh] space-y-4 overflow-y-auto scrollbar-thin">
          {debounced.length < 2 && (
            <div className="flex flex-wrap gap-2">
              {['Pala Empire', 'Language Movement', 'Hijrah', 'Ottoman', 'World War II', 'Dhaka', 'Ibn Battuta', 'AI'].map((s) => (
                <button key={s} onClick={() => setQ(s)} className="cursor-pointer rounded-full bg-royal-50 px-3 py-1.5 text-sm font-medium text-royal-700 hover:bg-royal-100">
                  {s}
                </button>
              ))}
            </div>
          )}
          {debounced.length > 1 && data && (
            <>
              {data.entities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.entities.slice(0, 8).map((en) => (
                    <button
                      key={`${en.type}:${en.name}`}
                      onClick={() => go(`/graph?focus=${encodeURIComponent(`${en.type}:${en.name}`)}`)}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: ENTITY_META[en.type]?.bg, color: ENTITY_META[en.type]?.color }}
                    >
                      <Tag className="size-3" /> {en.name} <span className="opacity-60">· {en.count}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="divide-y divide-line rounded-2xl border border-line">
                {data.events.slice(0, 8).map((e) => (
                  <button key={e.id} onClick={() => go(`/events/${e.id}`)} className="flex w-full cursor-pointer items-start gap-3 p-3 text-left hover:bg-royal-50/60">
                    <CalendarClock className="mt-0.5 size-4 shrink-0" style={{ color: TIMELINE_META[e.timeline].color }} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{e.title}</p>
                      <p className="truncate text-xs text-muted">
                        {e.dateLabel} · {TIMELINE_META[e.timeline].short} · {e.era}
                      </p>
                    </div>
                  </button>
                ))}
                {data.blogs.slice(0, 3).map((b) => (
                  <button key={b.id} onClick={() => go(`/stories/${b.slug}`)} className="flex w-full cursor-pointer items-start gap-3 p-3 text-left hover:bg-royal-50/60">
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-amber-600" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{b.title}</p>
                      <p className="truncate text-xs text-muted">Story · {b.excerpt}</p>
                    </div>
                  </button>
                ))}
                {data.events.length === 0 && data.blogs.length === 0 && <p className="p-4 text-sm text-muted">No results for “{debounced}”.</p>}
              </div>
              <button
                onClick={() => go(`/search?q=${encodeURIComponent(debounced)}`)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-royal-50 py-2.5 text-sm font-semibold text-royal-700 hover:bg-royal-100"
              >
                See all {data.total} results with filters <ArrowRight className="size-4" />
              </button>
            </>
          )}
          {isFetching && !data && <p className="text-sm text-muted">Searching…</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
