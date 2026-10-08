'use client';
import { motion } from 'framer-motion';
import {
  ArrowRight, BookOpen, Clapperboard, Landmark, Moon, Clock, Columns3, Compass, GalleryHorizontalEnd, Globe2, LayoutGrid, ListTree, Map, Network, Search, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { EventCard } from '@/components/event/event-card';
import { EventImage } from '@/components/event/event-image';
import { MiniMap } from '@/components/map';
import { Button } from '@/components/ui/button';
import { SectionHeading, Skeleton } from '@/components/ui/misc';
import { useBlogs, useEvents, useRoutes, useTimelines } from '@/lib/hooks';
import { useApp } from '@/lib/store';
import type { TimelineId } from '@/lib/types';
import { TIMELINE_META } from '@/lib/utils';
import { StoryCover } from './stories/stories-list';

const TL_ICONS: Record<TimelineId, React.ComponentType<{ className?: string }>> = { bangladesh: Landmark, islamic: Moon, world: Globe2 };

export function HomeView() {
  const { data: events = [], isLoading } = useEvents();
  const { data: timelines = [] } = useTimelines();
  const { data: routes = [] } = useRoutes();
  const { data: blogs = [] } = useBlogs();
  const setSearchOpen = useApp((s) => s.setSearchOpen);
  const featured = useMemo(() => events.filter((e) => e.featured && !e.noImage), [events]);
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    if (!featured.length) return;
    const id = setInterval(() => setSpot((s) => (s + 1) % featured.length), 5000);
    return () => clearInterval(id);
  }, [featured.length]);

  const places = new Set(events.flatMap((e) => e.locations.map((l) => l.name))).size;
  const hero = featured[spot];
  const mapLocs = useMemo(() => featured.slice(0, 30).map((e) => e.locations[0]).filter(Boolean), [featured]);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden hero-gradient text-white">
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
        <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-sky2-300/30 blur-3xl" />
        <div className="absolute -bottom-52 -left-24 size-[520px] rounded-full bg-royal-950/40 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pt-24">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="size-3.5" /> An interactive museum of time & place
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-5 text-5xl font-semibold leading-[1.05] md:text-7xl">
              Walk through <span className="italic text-sky2-200">5,000 years</span> of history.
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 font-bangla text-xl text-white/80">
              ইতিহাসের পাতায় এক জীবন্ত বায়োস্কোপ
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-5 max-w-xl text-lg text-white/85">
              From the Pala monasteries of Bengal to the House of Wisdom in Baghdad and the dawn of AI — explore events on zoomable timelines, satellite maps, migration routes and a living knowledge graph.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" variant="white" asChild>
                <Link href="/timeline/bangladesh"><Clock /> Explore timelines</Link>
              </Button>
              <Button size="lg" className="bg-white/15 backdrop-blur hover:bg-white/25" asChild>
                <Link href="/timeline/all?mode=journey"><Clapperboard /> Start a journey</Link>
              </Button>
              <Button size="lg" className="bg-transparent shadow-none ring-1 ring-white/40 hover:bg-white/10" onClick={() => setSearchOpen(true)}>
                <Search /> Search
              </Button>
            </motion.div>
            <div className="mt-12 grid max-w-lg grid-cols-4 gap-4">
              {[
                [events.length, 'Events'],
                [timelines.reduce((n, t) => n + t.eras.length, 0), 'Eras'],
                [places, 'Places'],
                [routes.length, 'Routes'],
              ].map(([n, l]) => (
                <div key={l as string}>
                  <p className="font-display text-3xl font-semibold">{isLoading ? '–' : n}</p>
                  <p className="text-xs uppercase tracking-widest text-white/70">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* floating spotlight */}
          <div className="relative hidden min-h-[460px] lg:block">
            {hero ? (
              <motion.div key={hero.id} initial={{ opacity: 0, y: 24, rotate: -1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.7 }} className="absolute inset-x-6 top-0">
                <Link href={`/events/${hero.id}`} className="group block overflow-hidden rounded-[2rem] bg-white text-ink shadow-2xl shadow-royal-950/40 ring-1 ring-white/50">
                  <EventImage event={hero} className="aspect-[16/10]" priority />
                  <div className="p-6">
                    <p className="text-sm font-bold" style={{ color: TIMELINE_META[hero.timeline].color }}>{hero.dateLabel} · {hero.era}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold group-hover:text-royal-700">{hero.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{hero.summary}</p>
                  </div>
                </Link>
              </motion.div>
            ) : (
              <Skeleton className="absolute inset-x-6 top-0 h-[440px] rounded-[2rem] bg-white/20" />
            )}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="glass absolute -left-4 bottom-0 flex items-center gap-3 rounded-2xl px-4 py-3 text-ink">
              <Globe2 className="size-8 text-royal-600" />
              <div>
                <p className="text-sm font-semibold">Satellite & historical maps</p>
                <p className="text-xs text-muted">Empires, trade routes & campaigns</p>
              </div>
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 7, repeat: Infinity }} className="glass absolute -right-2 bottom-24 flex items-center gap-3 rounded-2xl px-4 py-3 text-ink">
              <Network className="size-8 text-violet-600" />
              <div>
                <p className="text-sm font-semibold">Knowledge graph</p>
                <p className="text-xs text-muted">People · places · empires</p>
              </div>
            </motion.div>
            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
              {featured.slice(0, 12).map((f, i) => (
                <button key={f.id} onClick={() => setSpot(i)} className={`h-1.5 cursor-pointer rounded-full transition-all ${i === spot % 12 ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`} aria-label={f.title} />
              ))}
            </div>
          </div>
        </div>
        <svg className="relative block h-12 w-full text-white" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden>
          <path d="M0 48h1440V0c-240 32-480 48-720 48S240 32 0 0z" fill="currentColor" />
        </svg>
      </section>

      {/* TIMELINES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Three journeys" title="Choose your timeline">
          Each timeline is organised into eras, with dates, places, significance, images, videos and references for every event.
        </SectionHeading>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {(timelines.length ? timelines : []).map((t, i) => {
            const count = events.filter((e) => e.timeline === t.id).length;
            const sample = events.filter((e) => e.timeline === t.id && e.featured && !e.noImage)[0];
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link href={`/timeline/${t.id}`} className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-2xl hover:shadow-royal-600/10">
                  <div className="relative h-44 overflow-hidden">
                    {sample ? <EventImage event={sample} className="h-full w-full" /> : <div className="h-full bg-royal-50" />}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, ${t.color}dd)` }} />
                    <div className="absolute bottom-4 left-5 text-white">
                      {(() => { const I = TL_ICONS[t.id]; return <I className="mb-1 size-7" />; })()}
                      <h3 className="font-display text-2xl font-semibold">{t.name}</h3>
                      <p className="font-bangla text-sm opacity-90">{t.nameBn}</p>
                    </div>
                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold" style={{ color: t.color }}>{count} events</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm text-muted">{t.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {t.eras.map((era) => (
                        <span key={era} className="rounded-full bg-royal-50 px-2.5 py-1 text-[11px] font-semibold text-royal-700">{era}</span>
                      ))}
                    </div>
                    <span className="mt-auto flex items-center gap-1 pt-6 text-sm font-semibold" style={{ color: t.color }}>
                      Open timeline <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
          {!timelines.length && [0, 1, 2].map((i) => <Skeleton key={i} className="h-96 rounded-[2rem]" />)}
        </div>
      </section>

      {/* MODES */}
      <section className="soft-gradient border-y border-line py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Five ways to see time" title="Interactive timeline modes" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: GalleryHorizontalEnd, t: 'Horizontal', d: 'Zoom from millennia to years and drag through history.', mode: 'horizontal' },
              { icon: ListTree, t: 'Story mode', d: 'A vertical, scrolling narrative grouped by era.', mode: 'vertical' },
              { icon: Columns3, t: 'Century view', d: 'See how events cluster across the centuries.', mode: 'century' },
              { icon: LayoutGrid, t: 'Event view', d: 'Rich cards with images, places and summaries.', mode: 'events' },
              { icon: Clapperboard, t: 'Journey', d: 'Plays events like a documentary, with narration.', mode: 'journey' },
            ].map((m, i) => (
              <motion.div key={m.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link href={`/timeline/bangladesh?mode=${m.mode}`} className="group block h-full rounded-3xl border border-line bg-white p-5 transition hover:border-royal-200 hover:shadow-lg">
                  <span className="inline-flex rounded-2xl bg-gradient-to-br from-royal-600 to-sky2-400 p-3 text-white shadow-lg shadow-royal-600/20">
                    <m.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold group-hover:text-royal-700">{m.t}</h3>
                  <p className="mt-1 text-sm text-muted">{m.d}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Featured moments" title="Turning points that shaped our world" />
          <Button variant="outline" asChild>
            <Link href="/search">Browse all events <ArrowRight /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(isLoading ? [] : featured.slice(0, 8)).map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          {isLoading && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-80" />)}
        </div>
      </section>

      {/* MAP TEASER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-[2rem] border border-line bg-white shadow-xl shadow-royal-600/5 lg:grid-cols-[1fr_1.3fr]">
          <div className="p-8 md:p-12">
            <span className="inline-flex rounded-2xl bg-royal-50 p-3 text-royal-600"><Map className="size-6" /></span>
            <h2 className="mt-5 text-3xl font-semibold md:text-4xl">History has a geography</h2>
            <p className="mt-3 text-muted">
              Switch between satellite, terrain, political and parchment-style historical maps. Watch the Silk Road, the Hijrah and Ibn Battuta’s travels animate across the globe, and slide through time to see empires rise and fall.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {['Event markers for every location', 'Trade routes, migrations & military campaigns', 'Empire extents from the Mauryas to the Ottomans', 'Open any place in Google Earth or Google Maps'].map((x) => (
                <li key={x} className="flex items-center gap-2"><Compass className="size-4 text-royal-500" /> {x}</li>
              ))}
            </ul>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/map"><Globe2 /> Open Map Explorer</Link>
            </Button>
          </div>
          <div className="relative min-h-80">
            {mapLocs.length > 0 && <MiniMap locations={mapLocs} className="absolute inset-0 rounded-none border-0" initialLayer="satellite" />}
          </div>
        </div>
      </section>

      {/* STORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Read" title="Stories & articles" />
          <Button variant="outline" asChild>
            <Link href="/stories"><BookOpen /> All stories</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {blogs.slice(0, 3).map((b) => (
            <Link key={b.id} href={`/stories/${b.slug}`} className="group overflow-hidden rounded-3xl border border-line bg-white transition hover:shadow-xl">
              <StoryCover blog={b} className="aspect-[16/9]" />
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold group-hover:text-royal-700">{b.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] hero-gradient p-10 text-white md:p-14">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-semibold md:text-4xl">Connect the dots of history</h2>
              <p className="mt-2 max-w-xl text-white/85">See how people, places, empires, battles and religions link across centuries in the interactive knowledge graph.</p>
            </div>
            <Button size="lg" variant="white" asChild>
              <Link href="/graph"><Network /> Open Knowledge Graph</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
