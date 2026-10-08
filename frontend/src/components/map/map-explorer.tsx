'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Globe2, Layers, MapPin, Pause, Play, RotateCcw, Route, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleMarker, LayersControl, MapContainer, Polygon, Polyline, Popup, Tooltip, useMap,
} from 'react-leaflet';
import { useEvents, useRoutes, useTerritories, useTimelines } from '@/lib/hooks';
import type { HistoricalEvent, HistoricalRoute, TimelineId } from '@/lib/types';
import { CATEGORY_META, TIMELINE_META, cn, formatYear, googleEarthUrl, googleMapsUrl } from '@/lib/utils';
import { EventImage } from '../event/event-image';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select } from '../ui/input';
import { SmartTileLayer } from './smart-tile-layer';
import { BASE_LAYERS, LABELS_OVERLAY } from './tiles';

const ROUTE_TYPES: { id: HistoricalRoute['type']; label: string }[] = [
  { id: 'trade', label: 'Trade routes' },
  { id: 'migration', label: 'Migration paths' },
  { id: 'military', label: 'Military campaigns' },
  { id: 'journey', label: 'Journeys & voyages' },
];

function FlyTo({ target }: { target: { lat: number; lng: number; zoom?: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo([target.lat, target.lng], target.zoom ?? 6, { duration: 1.5 });
  }, [target, map]);
  return null;
}

function FitRoute({ route }: { route: HistoricalRoute | null }) {
  const map = useMap();
  useEffect(() => {
    if (route) map.flyToBounds(L.latLngBounds(route.path).pad(0.2), { duration: 1.5 });
  }, [route, map]);
  return null;
}

export default function MapExplorer() {
  const params = useSearchParams();
  const { data: timelines } = useTimelines();
  const { data: events = [] } = useEvents();
  const { data: routes = [] } = useRoutes();
  const { data: territories = [] } = useTerritories();

  const [timeline, setTimeline] = useState<string>(params.get('timeline') ?? 'all');
  const [era, setEra] = useState('');
  const [category, setCategory] = useState('');
  const [showEvents, setShowEvents] = useState(true);
  const [routeTypes, setRouteTypes] = useState<Set<string>>(new Set(['trade', 'migration', 'military', 'journey']));
  const [showTerritories, setShowTerritories] = useState(true);
  const [animate, setAnimate] = useState(true);
  const [timeFilter, setTimeFilter] = useState(false);
  const [year, setYear] = useState(1971);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState<HistoricalEvent | null>(null);
  const [focusRoute, setFocusRoute] = useState<HistoricalRoute | null>(null);
  const [target, setTarget] = useState<{ lat: number; lng: number; zoom?: number } | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  // deep link: /map?event=id
  const deepLinked = useRef(false);
  useEffect(() => {
    const id = params.get('event');
    if (!id || deepLinked.current || !events.length) return;
    const e = events.find((x) => x.id === id);
    if (e && e.locations[0]) {
      deepLinked.current = true;
      setSelected(e);
      setTarget({ lat: e.locations[0].lat, lng: e.locations[0].lng, zoom: 7 });
    }
  }, [params, events]);

  const eras = timelines?.find((t) => t.id === timeline)?.eras ?? [];
  const minYear = -3500;
  const maxYear = new Date().getFullYear();

  const visibleEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          (timeline === 'all' || e.timeline === timeline) &&
          (!era || e.era === era) &&
          (!category || e.category === category) &&
          (!timeFilter || e.startYear <= year),
      ),
    [events, timeline, era, category, timeFilter, year],
  );

  const visibleRoutes = useMemo(
    () =>
      routes.filter(
        (r) => routeTypes.has(r.type) && (timeline === 'all' || r.timeline === timeline) && (!timeFilter || (r.startYear <= year && r.endYear >= year - 50)),
      ),
    [routes, routeTypes, timeline, timeFilter, year],
  );

  const visibleTerritories = useMemo(
    () => territories.filter((t) => (timeline === 'all' || t.timeline === timeline) && (!timeFilter || (t.startYear <= year && t.endYear >= year))),
    [territories, timeline, timeFilter, year],
  );

  // Play through time
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setYear((y) => {
        const step = y < 0 ? 50 : y < 1500 ? 15 : y < 1900 ? 5 : 1;
        const next = y + step;
        if (next >= maxYear) {
          setPlaying(false);
          return maxYear;
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [playing, maxYear]);

  const startPlay = () => {
    setTimeFilter(true);
    if (year >= maxYear - 1) setYear(minYear);
    setPlaying(true);
  };

  const toggleRouteType = (t: string) =>
    setRouteTypes((s) => {
      const n = new Set(s);
      n.has(t) ? n.delete(t) : n.add(t);
      return n;
    });

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[560px] w-full">
      <MapContainer center={[25, 55]} zoom={3} minZoom={2} worldCopyJump className="h-full w-full" zoomControl={false}>
        <LayersControl position="topright">
          {BASE_LAYERS.map((b, i) => (
            <LayersControl.BaseLayer key={b.id} name={b.name} checked={i === 0}>
              <SmartTileLayer def={b} />
            </LayersControl.BaseLayer>
          ))}
          <LayersControl.Overlay name="Place labels (for satellite)">
            <SmartTileLayer def={LABELS_OVERLAY} />
          </LayersControl.Overlay>
        </LayersControl>

        {showTerritories &&
          visibleTerritories.map((t) => (
            <Polygon key={t.id} positions={t.polygon} pathOptions={{ color: t.color, weight: 1.5, fillColor: t.color, fillOpacity: 0.14, dashArray: '4 4' }}>
              <Tooltip sticky>
                <b>{t.name}</b>
                <br />
                {formatYear(t.startYear)} – {formatYear(t.endYear)} · approximate extent
              </Tooltip>
            </Polygon>
          ))}

        {visibleRoutes.map((r) => (
          <Polyline
            key={`${r.id}-${animate}`}
            positions={r.path}
            pathOptions={{
              color: r.color,
              weight: focusRoute?.id === r.id ? 5 : 3,
              opacity: 0.9,
              className: animate ? 'route-animated' : undefined,
              dashArray: !animate && r.type === 'military' ? '8 8' : undefined,
            }}
            eventHandlers={{ click: () => setFocusRoute(r) }}
          >
            <Tooltip sticky>
              <b>{r.name}</b> · {r.type}
              <br />
              {formatYear(r.startYear)}
              {r.endYear !== r.startYear && ` – ${formatYear(r.endYear)}`}
            </Tooltip>
          </Polyline>
        ))}

        {showEvents &&
          visibleEvents.flatMap((e) =>
            e.locations.map((l, i) => (
              <CircleMarker
                key={`${e.id}-${i}`}
                center={[l.lat, l.lng]}
                radius={selected?.id === e.id ? 10 : 6.5}
                pathOptions={{ color: 'white', weight: 2, fillColor: TIMELINE_META[e.timeline].color, fillOpacity: 0.95 }}
                eventHandlers={{ click: () => setSelected(e) }}
              >
                <Popup>
                  <div className="w-56">
                    <p className="text-[11px] font-bold" style={{ color: TIMELINE_META[e.timeline].color }}>
                      {e.dateLabel}
                    </p>
                    <p className="font-display text-sm font-semibold leading-snug text-ink">{e.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      <MapPin className="mr-1 inline size-3" />
                      {l.name}
                      {l.historicalTerritory ? ` · ${l.historicalTerritory}` : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                      <Link href={`/events/${e.id}`} className="text-royal-600">Open event →</Link>
                      <a href={googleEarthUrl(l.lat, l.lng)} target="_blank" rel="noreferrer" className="text-emerald-700">Google Earth</a>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )),
          )}

        <FlyTo target={target} />
        <FitRoute route={focusRoute} />
      </MapContainer>

      {/* Control panel */}
      <AnimatePresence>
        {panelOpen ? (
          <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -30, opacity: 0 }}
            className="glass-strong absolute left-3 top-3 z-[450] flex max-h-[calc(100%-1.5rem)] w-[min(340px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-royal-600" />
                <p className="font-display font-semibold">Map Explorer</p>
              </div>
              <button className="cursor-pointer rounded-lg p-1 text-muted hover:bg-royal-50" onClick={() => setPanelOpen(false)} aria-label="Hide panel">
                <X className="size-4" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto p-4 scrollbar-thin">
              <div className="grid grid-cols-2 gap-2">
                <Select value={timeline} onChange={(e) => (setTimeline(e.target.value), setEra(''))} className="col-span-2">
                  <option value="all">All timelines</option>
                  {(['bangladesh', 'islamic', 'world'] as TimelineId[]).map((t) => (
                    <option key={t} value={t}>{TIMELINE_META[t].label}</option>
                  ))}
                </Select>
                <Select value={era} onChange={(e) => setEra(e.target.value)} disabled={timeline === 'all'}>
                  <option value="">All eras</option>
                  {eras.map((x) => <option key={x}>{x}</option>)}
                </Select>
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">All categories</option>
                  {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Select>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Layers</p>
                <div className="space-y-1.5 text-sm">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={showEvents} onChange={(e) => setShowEvents(e.target.checked)} className="accent-royal-600" />
                    Event markers <span className="ml-auto text-xs text-muted">{visibleEvents.length}</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input type="checkbox" checked={showTerritories} onChange={(e) => setShowTerritories(e.target.checked)} className="accent-royal-600" />
                    Empire territories (historical overlay) <span className="ml-auto text-xs text-muted">{visibleTerritories.length}</span>
                  </label>
                  {ROUTE_TYPES.map((t) => (
                    <label key={t.id} className="flex cursor-pointer items-center gap-2">
                      <input type="checkbox" checked={routeTypes.has(t.id)} onChange={() => toggleRouteType(t.id)} className="accent-royal-600" />
                      {t.label}
                      <span className="ml-auto text-xs text-muted">{visibleRoutes.filter((r) => r.type === t.id).length}</span>
                    </label>
                  ))}
                  <label className="flex cursor-pointer items-center gap-2 pt-1">
                    <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} className="accent-royal-600" />
                    <Sparkles className="size-3.5 text-royal-500" /> Animate routes
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-muted">Switch Satellite / Terrain / Historical base maps with the layer button (top right).</p>
              </div>

              <div className="rounded-2xl bg-royal-50/70 p-3">
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                    <input type="checkbox" checked={timeFilter} onChange={(e) => setTimeFilter(e.target.checked)} className="accent-royal-600" />
                    Time travel
                  </label>
                  <span className="font-display text-lg font-semibold text-royal-700">{formatYear(year)}</span>
                </div>
                <input
                  type="range"
                  min={minYear}
                  max={maxYear}
                  value={year}
                  onChange={(e) => (setYear(+e.target.value), setTimeFilter(true))}
                  className="mt-2 w-full accent-royal-600"
                  aria-label="Year"
                />
                <div className="mt-2 flex gap-2">
                  {playing ? (
                    <Button size="sm" onClick={() => setPlaying(false)}><Pause /> Pause</Button>
                  ) : (
                    <Button size="sm" onClick={startPlay}><Play /> Play history</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => (setPlaying(false), setTimeFilter(false), setYear(1971))}>
                    <RotateCcw /> Reset
                  </Button>
                </div>
                <p className="mt-2 text-[11px] text-muted">Shows events up to the selected year, and empires and routes active at that time.</p>
              </div>

              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted"><Route className="size-3.5" /> Routes</p>
                <div className="space-y-1">
                  {visibleRoutes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setFocusRoute(r)}
                      className={cn('flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs hover:bg-royal-50', focusRoute?.id === r.id && 'bg-royal-50')}
                    >
                      <span className="h-1 w-5 shrink-0 rounded-full" style={{ background: r.color }} />
                      <span className="flex-1 truncate font-medium">{r.name}</span>
                      <span className="text-muted">{r.type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-line pt-3 text-xs">
                {(['bangladesh', 'islamic', 'world'] as TimelineId[]).map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full" style={{ background: TIMELINE_META[t].color }} />
                    {TIMELINE_META[t].short}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setPanelOpen(true)}
            className="glass-strong absolute left-3 top-3 z-[450] flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold text-royal-700"
          >
            <Layers className="size-4" /> Filters & layers
          </motion.button>
        )}
      </AnimatePresence>

      {/* Selected event card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="glass-strong absolute bottom-4 right-3 z-[450] w-[min(380px,calc(100vw-1.5rem))] overflow-hidden rounded-3xl"
          >
            <EventImage event={selected} className="h-36" compact />
            <button onClick={() => setSelected(null)} className="absolute right-2 top-2 cursor-pointer rounded-full bg-white/90 p-1.5 shadow" aria-label="Close">
              <X className="size-4" />
            </button>
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold" style={{ color: TIMELINE_META[selected.timeline].color }}>{selected.dateLabel}</span>
                <Badge color={CATEGORY_META[selected.category]?.color}>{CATEGORY_META[selected.category]?.label}</Badge>
              </div>
              <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{selected.title}</h3>
              <p className="mt-1 line-clamp-3 text-sm text-muted">{selected.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" asChild>
                  <Link href={`/events/${selected.id}`}>Read more</Link>
                </Button>
                {selected.locations[0] && (
                  <>
                    <Button size="sm" variant="outline" asChild>
                      <a href={googleEarthUrl(selected.locations[0].lat, selected.locations[0].lng)} target="_blank" rel="noreferrer">
                        <Globe2 /> Google Earth
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost" asChild>
                      <a href={googleMapsUrl(selected.locations[0].lat, selected.locations[0].lng)} target="_blank" rel="noreferrer">
                        <ExternalLink /> Maps
                      </a>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Route info */}
      <AnimatePresence>
        {focusRoute && !selected && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="glass-strong absolute bottom-4 right-3 z-[450] w-[min(360px,calc(100vw-1.5rem))] rounded-3xl p-4"
          >
            <button onClick={() => setFocusRoute(null)} className="absolute right-3 top-3 cursor-pointer rounded-full p-1 hover:bg-royal-50" aria-label="Close">
              <X className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full" style={{ background: focusRoute.color }} />
              <span className="text-xs font-bold uppercase tracking-wider text-muted">{focusRoute.type}</span>
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold">{focusRoute.name}</h3>
            <p className="text-xs font-semibold text-royal-600">
              {formatYear(focusRoute.startYear)}
              {focusRoute.endYear !== focusRoute.startYear && ` – ${formatYear(focusRoute.endYear)}`}
            </p>
            <p className="mt-2 text-sm text-muted">{focusRoute.description}</p>
            {focusRoute.relatedEventIds.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {focusRoute.relatedEventIds.map((id) => {
                  const ev = events.find((e) => e.id === id);
                  return ev ? (
                    <Link key={id} href={`/events/${id}`} className="rounded-full bg-royal-50 px-2.5 py-1 text-xs font-semibold text-royal-700 hover:bg-royal-100">
                      {ev.title}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
