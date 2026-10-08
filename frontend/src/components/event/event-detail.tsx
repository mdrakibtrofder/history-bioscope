'use client';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, BookOpen, CalendarRange, ExternalLink, FileText, Film, Globe2, Image as ImageIcon, Info, Landmark, Map, MapPin, Network,
  Pencil, Youtube,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { useBlogs, useEvent, useEvents } from '@/lib/hooks';
import { CATEGORY_META, ENTITY_META, TIMELINE_META, formatRange, googleEarthUrl, googleMapsUrl, youtubeId } from '@/lib/utils';
import { useWikiImages, useWikiSummary } from '@/lib/wiki';
import { MiniMap } from '../map';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EmptyState, Spinner } from '../ui/misc';
import { EventCard } from './event-card';
import { EventImage } from './event-image';
import { Gallery } from './gallery';
import { Markdown } from './markdown';

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-semibold">
        <span className="rounded-xl bg-royal-50 p-2 text-royal-600"><Icon className="size-5" /></span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function EventDetail({ id }: { id: string }) {
  const { data: e, isLoading, error } = useEvent(id);
  const { data: timelineEvents = [] } = useEvents(e ? { timeline: e.timeline } : {});
  const { data: blogs = [] } = useBlogs();
  const wiki = useWikiSummary(e?.wikiTitle, !!e);
  const wikiImgs = useWikiImages(e?.wikiTitle, !!e && !e.noImage);

  const related = useMemo(() => (e ? timelineEvents.filter((x) => e.relatedEventIds.includes(x.id)) : []), [e, timelineEvents]);
  const idx = e ? timelineEvents.findIndex((x) => x.id === e.id) : -1;
  const prev = idx > 0 ? timelineEvents[idx - 1] : null;
  const next = idx >= 0 && idx < timelineEvents.length - 1 ? timelineEvents[idx + 1] : null;
  const stories = e ? blogs.filter((b) => b.relatedEventIds.includes(e.id)) : [];

  if (isLoading) return <Spinner label="Loading event…" />;
  if (error || !e)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <EmptyState title="Event not found">
          <Link href="/timeline/bangladesh" className="text-royal-600">Back to timelines</Link>
        </EmptyState>
      </div>
    );

  const meta = TIMELINE_META[e.timeline];
  const cat = CATEGORY_META[e.category];
  const gallery = [
    ...e.images.map((i) => ({ src: i.url, caption: i.caption, credit: i.credit })),
    ...(e.noImage ? [] : (wikiImgs.data ?? []).map((w) => ({ src: w.src, caption: w.caption || w.title, credit: 'Wikimedia Commons' }))),
  ];
  const videos = e.videos ?? [];
  const groupedEntities = Object.entries(
    e.entities.reduce<Record<string, string[]>>((acc, x) => ((acc[x.type] = [...(acc[x.type] ?? []), x.name]), acc), {}),
  );

  return (
    <article>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <EventImage event={e} className="absolute inset-0 h-full w-full opacity-30 blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/85 to-white" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-8 sm:px-6 md:grid-cols-[1.3fr_1fr] md:items-end lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <nav className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <Link href={`/timeline/${e.timeline}`} className="font-semibold hover:text-royal-700" style={{ color: meta.color }}>{meta.label}</Link>
              <span>/</span>
              <Link href={`/timeline/${e.timeline}?era=${encodeURIComponent(e.era)}`} className="hover:text-royal-700">{e.era}</Link>
            </nav>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{e.title}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-royal-600 px-3 py-1 text-sm font-semibold text-white">
                <CalendarRange className="size-4" /> {e.dateLabel}
              </span>
              {cat && <Badge color={cat.color} className="py-1 text-sm">{cat.label}</Badge>}
              {e.approximate && <Badge className="bg-amber-50 py-1 text-sm text-amber-800">Approximate date</Badge>}
              {e.status === 'draft' && <Badge className="bg-amber-100 py-1 text-sm text-amber-800">Draft</Badge>}
            </div>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">{e.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {e.locations[0] && (
                <Button asChild>
                  <Link href={`/map?event=${e.id}`}><Map /> View on map</Link>
                </Button>
              )}
              <Button variant="outline" asChild>
                <Link href={`/graph?focus=${e.id}`}><Network /> Connections</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href={`/admin?edit=${e.id}`}><Pencil /> Edit</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <EventImage event={e} className="aspect-[4/3] rounded-3xl shadow-2xl shadow-royal-900/15 ring-1 ring-white" priority />
          </motion.div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="min-w-0">
          <Section icon={BookOpen} title="The story">
            <Markdown>{e.description || e.summary}</Markdown>
            {e.significance && (
              <div className="mt-6 rounded-3xl border border-royal-100 bg-gradient-to-br from-royal-50 to-sky2-50 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-royal-600">Historical significance</p>
                <p className="mt-2 font-display text-lg leading-relaxed text-royal-950">{e.significance}</p>
              </div>
            )}
            {wiki.data?.extract && (
              <div className="mt-6 rounded-3xl border border-line bg-white p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted">
                  <Info className="size-3.5" /> From Wikipedia
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{wiki.data.extract}</p>
                <a href={wiki.data.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-royal-600">
                  Read the full article <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}
          </Section>

          <Section icon={ImageIcon} title="Photos & illustrations">
            {e.noImage ? (
              <p className="rounded-2xl bg-royal-50/60 p-4 text-sm text-muted">
                In keeping with Islamic tradition, figurative images of prophets are not shown. Explore the places connected to this story on the map instead.
              </p>
            ) : wikiImgs.isLoading ? (
              <Spinner label="Loading images…" className="py-8" />
            ) : gallery.length ? (
              <Gallery items={gallery} />
            ) : (
              <p className="text-sm text-muted">No images yet. Add some from the admin dashboard.</p>
            )}
          </Section>

          <Section icon={Film} title="Videos">
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((v, i) => {
                const yt = v.type === 'youtube' ? youtubeId(v.url) : null;
                return (
                  <div key={i} className="overflow-hidden rounded-2xl border border-line bg-black">
                    {yt ? (
                      <iframe className="aspect-video w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={v.title ?? e.title} allowFullScreen />
                    ) : (
                      <video className="aspect-video w-full" src={v.url} controls />
                    )}
                    {v.title && <p className="bg-white p-2 text-sm font-semibold">{v.title}</p>}
                  </div>
                );
              })}
            </div>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${e.title} history documentary`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition hover:border-red-200 hover:bg-red-50/40"
            >
              <Youtube className="size-8 text-red-600" />
              <div>
                <p className="font-semibold">Find documentaries on YouTube</p>
                <p className="text-sm text-muted">Search: “{e.title} history documentary”</p>
              </div>
              <ExternalLink className="ml-auto size-4 text-muted" />
            </a>
          </Section>

          {(stories.length > 0 || (e.documents?.length ?? 0) > 0) && (
            <Section icon={FileText} title="Articles & documents">
              <div className="grid gap-3">
                {stories.map((b) => (
                  <Link key={b.id} href={`/stories/${b.slug}`} className="rounded-2xl border border-line bg-white p-4 hover:border-royal-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Story</p>
                    <p className="font-display text-lg font-semibold">{b.title}</p>
                    <p className="text-sm text-muted">{b.excerpt}</p>
                  </Link>
                ))}
                {e.documents?.map((d, i) => (
                  <a key={i} href={d.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 hover:border-royal-200">
                    <FileText className="size-6 text-royal-500" />
                    <span className="font-semibold">{d.caption || 'Document'}</span>
                  </a>
                ))}
              </div>
            </Section>
          )}

          <Section icon={Landmark} title="References">
            <ol className="list-decimal space-y-2 pl-5 text-sm">
              {e.references.map((r, i) => (
                <li key={i}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" className="text-royal-700 hover:underline">{r.title}</a>
                  ) : (
                    r.title
                  )}
                </li>
              ))}
              <li>
                <a href={`https://www.britannica.com/search?query=${encodeURIComponent(e.title)}`} target="_blank" rel="noreferrer" className="text-royal-700 hover:underline">
                  Encyclopaedia Britannica – search “{e.title}”
                </a>
              </li>
              {e.timeline === 'bangladesh' && (
                <li>
                  <a href={`https://en.banglapedia.org/index.php?search=${encodeURIComponent(e.title)}`} target="_blank" rel="noreferrer" className="text-royal-700 hover:underline">
                    Banglapedia – search “{e.title}”
                  </a>
                </li>
              )}
            </ol>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:pt-10">
          <div className="rounded-3xl border border-line bg-white p-5 shadow-sm lg:sticky lg:top-20">
            <p className="text-xs font-bold uppercase tracking-widest text-muted">Quick facts</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                ['Date', e.dateLabel],
                ['Timeline span', formatRange(e)],
                ['Era', e.era],
                ['Civilization', e.civilization],
                ['Region', e.region],
              ].map(([k, v]) =>
                v ? (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right font-semibold">{v}</dd>
                  </div>
                ) : null,
              )}
            </dl>

            {e.locations.length > 0 && (
              <>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">Locations</p>
                <MiniMap locations={e.locations} color={meta.color} className="mt-3 h-56" />
                <ul className="mt-3 space-y-3">
                  {e.locations.map((l, i) => (
                    <li key={i} className="text-sm">
                      <p className="flex items-start gap-1.5 font-semibold"><MapPin className="mt-0.5 size-4 shrink-0 text-royal-500" /> {l.name}</p>
                      <p className="pl-5.5 text-xs text-muted">
                        {[l.country, l.region].filter(Boolean).join(', ')} {l.historicalTerritory && `· ${l.historicalTerritory}`} · {l.lat.toFixed(3)}, {l.lng.toFixed(3)}
                      </p>
                      <div className="flex gap-3 pl-5.5 pt-1 text-xs font-semibold">
                        <a href={googleMapsUrl(l.lat, l.lng)} target="_blank" rel="noreferrer" className="text-royal-600 hover:underline">Google Maps (satellite)</a>
                        <a href={googleEarthUrl(l.lat, l.lng)} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-700 hover:underline"><Globe2 className="size-3" /> Google Earth</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {groupedEntities.length > 0 && (
              <>
                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted">People, places & powers</p>
                <div className="mt-3 space-y-3">
                  {groupedEntities.map(([type, names]) => (
                    <div key={type}>
                      <p className="mb-1 text-[11px] font-semibold" style={{ color: ENTITY_META[type]?.color }}>{ENTITY_META[type]?.label}s</p>
                      <div className="flex flex-wrap gap-1.5">
                        {names.map((n) => (
                          <Link
                            key={n}
                            href={`/graph?focus=${encodeURIComponent(`${type}:${n}`)}`}
                            className="rounded-full px-2.5 py-1 text-xs font-semibold transition hover:brightness-95"
                            style={{ background: ENTITY_META[type]?.bg, color: ENTITY_META[type]?.color }}
                          >
                            {n}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-14 max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-5 text-2xl font-semibold">Related events</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.slice(0, 8).map((r, i) => <EventCard key={r.id} event={r} index={i} />)}
          </div>
        </div>
      )}

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
        {prev ? (
          <Link href={`/events/${prev.id}`} className="group rounded-3xl border border-line bg-white p-5 hover:border-royal-200">
            <p className="flex items-center gap-1 text-xs font-semibold text-muted"><ArrowLeft className="size-3.5" /> Previous in {meta.short}</p>
            <p className="mt-1 font-display text-lg font-semibold group-hover:text-royal-700">{prev.title}</p>
            <p className="text-sm text-muted">{prev.dateLabel}</p>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/events/${next.id}`} className="group rounded-3xl border border-line bg-white p-5 text-right hover:border-royal-200">
            <p className="flex items-center justify-end gap-1 text-xs font-semibold text-muted">Next in {meta.short} <ArrowRight className="size-3.5" /></p>
            <p className="mt-1 font-display text-lg font-semibold group-hover:text-royal-700">{next.title}</p>
            <p className="text-sm text-muted">{next.dateLabel}</p>
          </Link>
        )}
      </div>
    </article>
  );
}
