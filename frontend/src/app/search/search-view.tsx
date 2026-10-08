'use client';
import { BookOpen, Filter, RotateCcw, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { EventCard } from '@/components/event/event-card';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/input';
import { EmptyState, PageHeader, Spinner } from '@/components/ui/misc';
import { useEvents, useSearch, useTimelines } from '@/lib/hooks';
import type { EventFilters } from '@/lib/types';
import { CATEGORY_META, ENTITY_META, TIMELINE_META } from '@/lib/utils';

const KEYS = ['q', 'timeline', 'era', 'category', 'region', 'civilization', 'from', 'to'] as const;

export function SearchView() {
  const params = useSearchParams();
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>(() => Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? ''])));
  useEffect(() => setForm(Object.fromEntries(KEYS.map((k) => [k, params.get(k) ?? '']))), [params]);

  const filters: EventFilters = useMemo(() => {
    const f: EventFilters = {};
    for (const k of KEYS) {
      const v = params.get(k);
      if (!v) continue;
      if (k === 'from' || k === 'to') f[k] = Number(v);
      else (f as Record<string, string>)[k] = v;
    }
    return f;
  }, [params]);

  const { data, isLoading } = useSearch(filters);
  const { data: timelines } = useTimelines();
  const { data: all = [] } = useEvents();
  const regions = useMemo(() => [...new Set(all.map((e) => e.region))].sort(), [all]);
  const civs = useMemo(() => [...new Set(all.map((e) => e.civilization).filter(Boolean))].sort(), [all]);
  const eras = form.timeline ? timelines?.find((t) => t.id === form.timeline)?.eras ?? [] : timelines?.flatMap((t) => t.eras) ?? [];

  const apply = (next = form) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    router.replace(`/search?${p.toString()}`, { scroll: false });
  };
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader eyebrow="Global search" title="Search across history">
        Events, historical figures, countries, empires, battles and dates — with advanced filters.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply();
          }}
          className="h-fit space-y-4 rounded-3xl border border-line bg-white p-5 shadow-sm lg:sticky lg:top-20"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input value={form.q} onChange={(e) => set('q', e.target.value)} placeholder="Keyword, name or year…" className="pl-9" />
          </div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted"><Filter className="size-3.5" /> Filters</p>
          <Field label="Timeline">
            <Select value={form.timeline} onChange={(e) => (set('timeline', e.target.value), set('era', ''))}>
              <option value="">All</option>
              {timelines?.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Era / period">
            <Select value={form.era} onChange={(e) => set('era', e.target.value)}>
              <option value="">All</option>
              {eras.map((x) => <option key={x}>{x}</option>)}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
              <option value="">All</option>
              {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
          </Field>
          <Field label="Region">
            <Select value={form.region} onChange={(e) => set('region', e.target.value)}>
              <option value="">All</option>
              {regions.map((r) => <option key={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Civilization">
            <Select value={form.civilization} onChange={(e) => set('civilization', e.target.value)}>
              <option value="">All</option>
              {civs.map((r) => <option key={r}>{r}</option>)}
            </Select>
          </Field>
          <Field label="Time range" hint="Use negative numbers for BCE (e.g. -500)">
            <div className="flex gap-2">
              <Input type="number" placeholder="From" value={form.from} onChange={(e) => set('from', e.target.value)} />
              <Input type="number" placeholder="To" value={form.to} onChange={(e) => set('to', e.target.value)} />
            </div>
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Search</Button>
            <Button type="button" variant="outline" onClick={() => apply(Object.fromEntries(KEYS.map((k) => [k, ''])))} aria-label="Reset">
              <RotateCcw />
            </Button>
          </div>
        </form>

        <div>
          {isLoading || !data ? (
            <Spinner label="Searching…" />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                <b className="text-ink">{data.total}</b> events{data.query && <> for “<b className="text-ink">{data.query}</b>”</>}
                {data.blogs.length > 0 && <> · {data.blogs.length} stories</>}
              </p>
              {data.entities.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {data.entities.slice(0, 16).map((en) => (
                    <Link
                      key={`${en.type}:${en.name}`}
                      href={`/graph?focus=${encodeURIComponent(`${en.type}:${en.name}`)}`}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: ENTITY_META[en.type]?.bg, color: ENTITY_META[en.type]?.color }}
                    >
                      <Tag className="size-3" /> {en.name} <span className="opacity-60">{ENTITY_META[en.type]?.label} · {en.count}</span>
                    </Link>
                  ))}
                </div>
              )}
              {data.blogs.length > 0 && (
                <div className="mb-6 grid gap-3 sm:grid-cols-2">
                  {data.blogs.map((b) => (
                    <Link key={b.id} href={`/stories/${b.slug}`} className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4 hover:border-amber-300">
                      <BookOpen className="size-5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-semibold">{b.title}</p>
                        <p className="line-clamp-2 text-sm text-muted">{b.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {data.events.length === 0 ? (
                <EmptyState icon={<Search />} title="Nothing found">Try fewer words or remove some filters.</EmptyState>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {data.events.slice(0, 90).map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
                </div>
              )}
              {data.events.length > 90 && <p className="mt-4 text-center text-sm text-muted">Showing first 90 results — narrow your filters to see more.</p>}
              <div className="mt-8 flex flex-wrap gap-2 text-xs text-muted">
                Legend:
                {Object.entries(TIMELINE_META).map(([k, v]) => (
                  <span key={k} className="flex items-center gap-1"><span className="size-2 rounded-full" style={{ background: v.color }} />{v.short}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
