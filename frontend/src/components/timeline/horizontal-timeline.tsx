'use client';
import { scaleLinear } from 'd3-scale';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Hand, Maximize2, MousePointerClick, ZoomIn, ZoomOut } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '@/lib/store';
import type { HistoricalEvent } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn, formatYear } from '@/lib/utils';
import { EventImage } from '../event/event-image';
import { MiniMap } from '../map';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const CARD_W = 190;
const LANE_H = 78;
const MAX_LANES = 5;
const AXIS_Y = 64;
const PAD = 60;

interface Placed {
  e: HistoricalEvent;
  x: number;
  x2: number;
  lane: number;
}

export function HorizontalTimeline({ events, eras }: { events: HistoricalEvent[]; eras: string[] }) {
  const scaleMode = useApp((s) => s.scaleMode);
  const setScaleMode = useApp((s) => s.setScaleMode);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);
  const [k, setK] = useState(1);
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<HistoricalEvent | null>(null);
  const drag = useRef<{ x: number; o: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // reset view when data or scale changes
  useEffect(() => {
    setK(scaleMode === 'sequence' ? Math.max(1, (events.length * 120) / Math.max(width, 1)) : 1);
    setOffset(0);
    setSelected(null);
  }, [events, scaleMode, width]);

  const innerW = Math.max(width - PAD * 2, 200);
  const base = useMemo(() => {
    if (scaleMode === 'sequence') return scaleLinear().domain([0, Math.max(events.length - 1, 1)]).range([0, innerW * k]);
    const min = Math.min(...events.map((e) => e.startYear));
    const max = Math.max(...events.map((e) => e.endYear ?? e.startYear));
    const span = Math.max(max - min, 10);
    return scaleLinear().domain([min - span * 0.02, max + span * 0.02]).range([0, innerW * k]);
  }, [events, innerW, k, scaleMode]);

  const xOf = useCallback(
    (e: HistoricalEvent, i: number, end = false) =>
      PAD + offset + (scaleMode === 'sequence' ? base(i) : base(end ? e.endYear ?? e.startYear : e.startYear)),
    [base, offset, scaleMode],
  );

  const placed: Placed[] = useMemo(() => {
    const laneEnd: number[] = Array(MAX_LANES).fill(-Infinity);
    return events.map((e, i) => {
      const x = xOf(e, i);
      const x2 = scaleMode === 'sequence' ? x : xOf(e, i, true);
      let lane = laneEnd.findIndex((end) => end < x - 8);
      if (lane === -1) lane = MAX_LANES; // overflow: dot only
      else laneEnd[lane] = x + CARD_W;
      return { e, x, x2, lane };
    });
  }, [events, xOf, scaleMode]);

  const eraBands = useMemo(() => {
    return eras
      .map((era) => {
        const idx = events.map((e, i) => (e.era === era ? i : -1)).filter((i) => i >= 0);
        if (!idx.length) return null;
        const xs = idx.map((i) => placed[i]);
        const start = Math.min(...xs.map((p) => p.x));
        const end = Math.max(...xs.map((p) => Math.max(p.x2, p.x)));
        return { era, start, end: Math.max(end, start + 6), first: idx[0], last: idx[idx.length - 1] };
      })
      .filter(Boolean) as { era: string; start: number; end: number; first: number; last: number }[];
  }, [eras, events, placed]);

  const ticks = useMemo(() => {
    if (scaleMode === 'sequence') {
      const every = Math.max(1, Math.ceil(110 / Math.max(base(1) - base(0), 1)));
      return events.map((e, i) => ({ x: xOf(e, i), label: formatYear(e.startYear), show: i % every === 0 })).filter((t) => t.show);
    }
    const visible = scaleLinear().domain(base.domain()).range([PAD + offset, PAD + offset + innerW * k]);
    const d0 = visible.invert(0);
    const d1 = visible.invert(width);
    const s = scaleLinear().domain([d0, d1]).range([0, width]);
    return s.ticks(Math.max(2, Math.floor(width / 120))).map((y) => ({ x: s(y), label: formatYear(Math.round(y)), show: true }));
  }, [scaleMode, base, events, xOf, offset, innerW, k, width]);

  const clampOffset = useCallback((o: number, kk = k) => Math.min(width * 0.4, Math.max(-(innerW * kk) + width * 0.4, o)), [k, innerW, width]);

  const zoomAt = useCallback(
    (factor: number, mx = width / 2) => {
      setK((oldK) => {
        const nk = Math.min(400, Math.max(1, oldK * factor));
        setOffset((o) => {
          const contentX = mx - PAD - o;
          return clampOffset(mx - PAD - contentX * (nk / oldK), nk);
        });
        return nk;
      });
    },
    [width, clampOffset],
  );

  // wheel zoom (non-passive)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent) => {
      if (Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) {
        ev.preventDefault();
        setOffset((o) => clampOffset(o - ev.deltaX));
        return;
      }
      ev.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(ev.deltaY < 0 ? 1.18 : 1 / 1.18, ev.clientX - rect.left);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt, clampOffset]);

  const fitRange = (startX: number, endX: number) => {
    // startX/endX are current screen positions; compute new k so range fills the view
    const curContentStart = startX - PAD - offset;
    const curContentEnd = endX - PAD - offset;
    const span = Math.max(curContentEnd - curContentStart, 20);
    const factor = (width * 0.8) / span;
    const nk = Math.min(400, Math.max(1, k * factor));
    const ratio = nk / k;
    setK(nk);
    setOffset(clampOffset(width * 0.1 - PAD - curContentStart * ratio, nk));
  };

  const pan = (dx: number) => setOffset((o) => clampOffset(o + dx));

  const height = AXIS_Y + 30 + MAX_LANES * LANE_H + 24;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1">
          <Button size="icon-sm" variant="ghost" onClick={() => zoomAt(1 / 1.5)} aria-label="Zoom out"><ZoomOut /></Button>
          <span className="w-14 text-center text-xs font-semibold text-muted">{k.toFixed(1)}×</span>
          <Button size="icon-sm" variant="ghost" onClick={() => zoomAt(1.5)} aria-label="Zoom in"><ZoomIn /></Button>
          <Button size="icon-sm" variant="ghost" onClick={() => (setK(scaleMode === 'sequence' ? Math.max(1, (events.length * 120) / width) : 1), setOffset(0))} aria-label="Reset">
            <Maximize2 />
          </Button>
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-line bg-white p-1 text-xs font-semibold">
          {(['time', 'sequence'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setScaleMode(m)}
              className={cn('cursor-pointer rounded-lg px-3 py-1.5', scaleMode === m ? 'bg-royal-600 text-white' : 'text-muted hover:bg-royal-50')}
            >
              {m === 'time' ? 'Proportional time' : 'Even spacing'}
            </button>
          ))}
        </div>
        <div className="ml-auto hidden items-center gap-3 text-xs text-muted md:flex">
          <span className="flex items-center gap-1"><Hand className="size-3.5" /> Drag to pan</span>
          <span className="flex items-center gap-1"><MousePointerClick className="size-3.5" /> Scroll to zoom · click an era to focus</span>
        </div>
        <div className="flex gap-1">
          <Button size="icon-sm" variant="outline" onClick={() => pan(width * 0.6)} aria-label="Pan left"><ChevronLeft /></Button>
          <Button size="icon-sm" variant="outline" onClick={() => pan(-width * 0.6)} aria-label="Pan right"><ChevronRight /></Button>
        </div>
      </div>

      <div
        ref={wrapRef}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') pan(120);
          if (e.key === 'ArrowRight') pan(-120);
          if (e.key === '+' || e.key === '=') zoomAt(1.3);
          if (e.key === '-') zoomAt(1 / 1.3);
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, o: offset, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 3) {
            if (!drag.current.moved) (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
            drag.current.moved = true;
          }
          if (drag.current.moved) setOffset(clampOffset(drag.current.o + dx));
        }}
        onPointerUp={() => setTimeout(() => (drag.current = null), 0)}
        onPointerCancel={() => (drag.current = null)}
        className="relative cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl border border-line bg-white shadow-sm active:cursor-grabbing"
        style={{ height }}
      >
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" />

        {/* Era bands */}
        {eraBands.map((b, i) => (
          <button
            key={b.era}
            onClick={() => !drag.current?.moved && fitRange(b.start - 20, b.end + CARD_W * 0.6)}
            className="absolute top-3 flex h-9 cursor-pointer items-center overflow-hidden rounded-xl px-3 text-left text-xs font-bold text-white shadow-sm transition hover:brightness-110"
            style={{
              left: b.start - 6,
              width: Math.max(b.end - b.start + 12, 28),
              background: `linear-gradient(90deg, hsl(${226 - i * 14} 75% ${46 + i * 3}%), hsl(${210 - i * 12} 85% ${55 + i * 2}%))`,
            }}
            title={`Focus on ${b.era}`}
          >
            <span className="truncate">{b.era}</span>
          </button>
        ))}

        {/* Axis */}
        <div className="absolute left-0 right-0 h-[3px] rounded bg-gradient-to-r from-royal-200 via-royal-400 to-sky2-300" style={{ top: AXIS_Y }} />
        {ticks.map((t, i) =>
          t.x > -50 && t.x < width + 50 ? (
            <div key={`${t.label}-${i}`} className="pointer-events-none absolute" style={{ left: t.x, top: AXIS_Y - 6 }}>
              <div className="h-[15px] w-px bg-royal-300" />
              <div className="absolute top-4 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-royal-700/80">{t.label}</div>
            </div>
          ) : null,
        )}

        {/* Events */}
        {placed.map(({ e, x, x2, lane }) => {
          if (x < -CARD_W - 40 || x > width + 40) return null;
          const color = TIMELINE_META[e.timeline].color;
          const top = AXIS_Y + 34 + Math.min(lane, MAX_LANES - 1) * LANE_H;
          const isSel = selected?.id === e.id;
          return (
            <div key={e.id}>
              {x2 - x > 4 && (
                <div className="absolute h-[7px] rounded-full opacity-40" style={{ left: x, width: x2 - x, top: AXIS_Y - 2, background: color }} />
              )}
              <div className="absolute size-3 -translate-x-1/2 rounded-full border-2 border-white shadow" style={{ left: x, top: AXIS_Y - 4.5, background: color }} />
              {lane < MAX_LANES && (
                <>
                  <div className="absolute w-px" style={{ left: x, top: AXIS_Y + 8, height: top - AXIS_Y - 8, background: `${color}55` }} />
                  <button
                    onClick={() => !drag.current?.moved && setSelected(isSel ? null : e)}
                    className={cn(
                      'absolute flex cursor-pointer items-center gap-2 rounded-xl border bg-white/95 p-1.5 pr-2.5 text-left shadow-sm transition hover:z-10 hover:-translate-y-0.5 hover:shadow-lg',
                      isSel ? 'z-10 border-royal-400 ring-4 ring-royal-100' : 'border-line',
                    )}
                    style={{ left: x - 10, top, width: CARD_W - 12 }}
                  >
                    <EventImage event={e} className="size-12 shrink-0 rounded-lg" compact />
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-bold" style={{ color }}>{e.dateLabel}</span>
                      <span className="line-clamp-2 text-xs font-semibold leading-tight text-ink">{e.title}</span>
                    </span>
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">
        {events.length} events · zoom in to reveal events hidden behind others (shown as dots on the axis).
      </p>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-6 grid gap-6 overflow-hidden rounded-3xl border border-line bg-white p-4 shadow-lg md:grid-cols-[1.1fr_1.4fr_1fr] md:p-5"
          >
            <EventImage event={selected} className="aspect-[4/3] rounded-2xl" />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: TIMELINE_META[selected.timeline].color }}>{selected.dateLabel}</span>
                <Badge color={CATEGORY_META[selected.category]?.color}>{CATEGORY_META[selected.category]?.label}</Badge>
                <Badge>{selected.era}</Badge>
              </div>
              <h3 className="mt-2 font-display text-2xl font-semibold">{selected.title}</h3>
              <p className="mt-2 text-sm text-muted">{selected.summary}</p>
              <p className="mt-3 rounded-xl bg-royal-50/70 p-3 text-sm text-royal-900">
                <b>Significance: </b>
                {selected.significance}
              </p>
              <Button className="mt-4" asChild>
                <Link href={`/events/${selected.id}`}>
                  Explore event <ArrowRight />
                </Link>
              </Button>
            </div>
            {selected.locations.length > 0 && <MiniMap locations={selected.locations} color={TIMELINE_META[selected.timeline].color} className="h-64 md:h-full" />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
