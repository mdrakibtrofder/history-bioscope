// Pure data logic shared by the browser LocalStorage provider (mirrors the NestJS services).
import type { Blog, EventFilters, GraphData, GraphEdge, GraphNode, HistoricalEvent, SearchResult, Stats } from '../types';

export function matchesText(e: HistoricalEvent, q: string) {
  const needle = q.toLowerCase().trim();
  if (!needle) return true;
  const hay = [
    e.title, e.summary, e.description, e.era, e.category, e.civilization, e.region, e.dateLabel, String(e.startYear),
    ...e.entities.map((x) => x.name),
    ...e.locations.map((l) => `${l.name} ${l.country ?? ''} ${l.historicalTerritory ?? ''}`),
    ...e.tags,
  ].join(' ').toLowerCase();
  return needle.split(/\s+/).every((w) => hay.includes(w));
}

export function filterEvents(all: HistoricalEvent[], q: EventFilters = {}) {
  return all
    .filter((e) => q.includeDrafts || e.status === 'published')
    .filter((e) => !q.timeline || q.timeline === 'all' || e.timeline === q.timeline)
    .filter((e) => !q.era || e.era === q.era)
    .filter((e) => !q.category || e.category === q.category)
    .filter((e) => !q.region || e.region === q.region)
    .filter((e) => !q.civilization || e.civilization === q.civilization)
    .filter((e) => !q.featured || e.featured)
    .filter((e) => q.from === undefined || (e.endYear ?? e.startYear) >= q.from)
    .filter((e) => q.to === undefined || e.startYear <= q.to)
    .filter((e) => !q.q || matchesText(e, q.q))
    .sort((a, b) => a.startYear - b.startYear);
}

export function buildGraph(events: HistoricalEvent[]): GraphData {
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const ids = new Set(events.map((e) => e.id));
  for (const e of events) nodes.set(e.id, { id: e.id, label: e.title, type: 'event', timeline: e.timeline, year: e.startYear, degree: 0 });
  for (const e of events) {
    for (const ent of e.entities) {
      const nid = `${ent.type}:${ent.name}`;
      if (!nodes.has(nid)) nodes.set(nid, { id: nid, label: ent.name, type: ent.type, degree: 0 });
      edges.push({ id: `${e.id}->${nid}`, source: e.id, target: nid, kind: 'involves' });
    }
    for (const r of e.relatedEventIds) if (ids.has(r) && e.id < r) edges.push({ id: `${e.id}<->${r}`, source: e.id, target: r, kind: 'related' });
  }
  for (const ed of edges) {
    nodes.get(ed.source)!.degree++;
    nodes.get(ed.target)!.degree++;
  }
  return { nodes: [...nodes.values()], edges };
}

export function computeStats(events: HistoricalEvent[], blogs: number, media: number, locations: number): Stats {
  const count = (f: (e: HistoricalEvent) => string) =>
    events.reduce<Record<string, number>>((acc, e) => ((acc[f(e)] = (acc[f(e)] ?? 0) + 1), acc), {});
  return {
    totalEvents: events.length,
    published: events.filter((e) => e.status === 'published').length,
    drafts: events.filter((e) => e.status === 'draft').length,
    byTimeline: count((e) => e.timeline),
    byCategory: count((e) => e.category),
    byEra: count((e) => `${e.timeline}|${e.era}`),
    blogs, media, locations,
  };
}

export function searchAll(events: HistoricalEvent[], blogs: Blog[], q: EventFilters): SearchResult {
  const found = filterEvents(events, q);
  const needle = (q.q ?? '').toLowerCase();
  const blogHits = needle
    ? blogs.filter((b) => b.status === 'published' && `${b.title} ${b.excerpt} ${b.tags.join(' ')} ${b.content}`.toLowerCase().includes(needle))
    : [];
  const ent = new Map<string, { type: string; name: string; count: number }>();
  if (needle)
    for (const e of found)
      for (const en of e.entities)
        if (en.name.toLowerCase().includes(needle)) {
          const k = `${en.type}:${en.name}`;
          const cur = ent.get(k) ?? { type: en.type, name: en.name, count: 0 };
          cur.count++;
          ent.set(k, cur);
        }
  return { query: q.q ?? '', total: found.length, events: found, blogs: blogHits, entities: [...ent.values()].sort((a, b) => b.count - a.count) };
}
