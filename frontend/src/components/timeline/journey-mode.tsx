'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { HistoricalEvent } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn } from '@/lib/utils';
import { EventImage } from '../event/event-image';
import { MiniMap } from '../map';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

/** Historical Journey Mode – plays events sequentially like a documentary. */
export function JourneyMode({ events }: { events: HistoricalEvent[] }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(7);
  const [narrate, setNarrate] = useState(false);
  const [tick, setTick] = useState(0);
  const e = events[Math.min(idx, events.length - 1)];

  useEffect(() => setIdx(0), [events]);

  const go = useCallback((d: number) => setIdx((i) => (i + d + events.length) % events.length), [events.length]);

  useEffect(() => {
    if (!playing) return;
    setTick(0);
    const step = 100;
    const id = setInterval(() => {
      setTick((t) => {
        if (t + step >= seconds * 1000) {
          setIdx((i) => {
            if (i + 1 >= events.length) {
              setPlaying(false);
              return i;
            }
            return i + 1;
          });
          return 0;
        }
        return t + step;
      });
    }, step);
    return () => clearInterval(id);
  }, [playing, seconds, events.length, idx]);

  useEffect(() => {
    if (!narrate || typeof window === 'undefined' || !('speechSynthesis' in window) || !e) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(`${e.title}. ${e.dateLabel.replace('–', 'to')}. ${e.summary}`);
    u.rate = 1;
    window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [e, narrate]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if ((ev.target as HTMLElement)?.tagName === 'INPUT') return;
      if (ev.key === 'ArrowRight') go(1);
      if (ev.key === 'ArrowLeft') go(-1);
      if (ev.key === ' ') {
        ev.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const locs = useMemo(() => e?.locations ?? [], [e]);
  if (!e) return null;
  const color = TIMELINE_META[e.timeline].color;

  return (
    <div className="overflow-hidden rounded-[2rem] border border-royal-100 bg-gradient-to-br from-royal-950 via-royal-900 to-royal-700 p-3 text-white shadow-2xl shadow-royal-900/30 md:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait">
            <motion.div key={e.id} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
              <EventImage event={e} className="h-full w-full" priority compact />
              <div className="absolute inset-0 bg-gradient-to-t from-royal-950 via-royal-950/55 to-transparent" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div key={e.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, delay: 0.15 }}>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-white/15 text-white backdrop-blur">{e.era}</Badge>
                  <Badge className="bg-white/15 text-white backdrop-blur">{CATEGORY_META[e.category]?.label}</Badge>
                </div>
                <p className="mt-3 font-display text-2xl font-semibold text-sky2-300 md:text-3xl">{e.dateLabel}</p>
                <h2 className="mt-1 font-display text-3xl font-semibold leading-tight md:text-4xl">{e.title}</h2>
                <p className="mt-3 max-w-2xl text-base text-white/85">{e.summary}</p>
                <Link href={`/events/${e.id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky2-300 hover:text-white">
                  Full story <ArrowRight className="size-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <MiniMap locations={locs} color={color} className="h-64 border-white/10 lg:h-auto lg:flex-1" initialLayer="satellite" flyZoom={locs.length ? 6 : undefined} />
          <div className="rounded-3xl bg-white/10 p-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-widest text-sky2-300">Why it matters</p>
            <p className="mt-1 text-sm text-white/85">{e.significance}</p>
          </div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-4 flex flex-wrap items-center gap-3 px-1">
        <Button size="icon" variant="glass" onClick={() => go(-1)} aria-label="Previous"><ChevronLeft /></Button>
        <Button size="icon" variant="white" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? <Pause /> : <Play />}
        </Button>
        <Button size="icon" variant="glass" onClick={() => go(1)} aria-label="Next"><ChevronRight /></Button>
        <span className="text-sm font-semibold text-white/80">{idx + 1} / {events.length}</span>
        <div className="ml-auto flex items-center gap-2 text-xs text-white/80">
          <label className="flex items-center gap-1.5">
            Speed
            <select value={seconds} onChange={(ev) => setSeconds(+ev.target.value)} className="cursor-pointer rounded-lg bg-white/10 px-2 py-1 text-white">
              {[4, 7, 10, 15].map((s) => <option key={s} value={s} className="text-ink">{s}s / event</option>)}
            </select>
          </label>
          <button onClick={() => setNarrate((n) => !n)} className={cn('flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1', narrate ? 'bg-sky2-400 text-royal-950' : 'bg-white/10')}>
            {narrate ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />} Narrate
          </button>
        </div>
      </div>
      <div className="mt-3 px-1">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/15">
          <div className="absolute inset-y-0 left-0 bg-sky2-400 transition-all" style={{ width: `${((idx + (playing ? tick / (seconds * 1000) : 0)) / events.length) * 100}%` }} />
        </div>
        <div className="mt-2 flex gap-[2px]">
          {events.map((ev, i) => (
            <button
              key={ev.id}
              title={`${ev.dateLabel} – ${ev.title}`}
              onClick={() => setIdx(i)}
              className={cn('h-3 flex-1 cursor-pointer rounded-sm transition', i === idx ? 'bg-white' : i < idx ? 'bg-sky2-400/70' : 'bg-white/20 hover:bg-white/40')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
