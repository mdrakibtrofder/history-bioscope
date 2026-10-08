import type { DataSource } from './source';
import type { Blog, EventFilters, HistoricalEvent, LocationItem, MediaItem } from '../types';
import { slugify, uid } from '../utils';
import { buildGraph, computeStats, filterEvents, searchAll } from './logic';

/**
 * LocalStorageDataSource – runs entirely in the browser.
 * Seed data is loaded from /seed/*.json; any change is saved to window.localStorage
 * (copy-on-write per collection), so admins can edit content without a backend.
 */
const PREFIX = 'history-bioscope:';
const cache = new Map<string, unknown[]>();

function readLS<T>(name: string): T[] | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + name);
    return raw ? (JSON.parse(raw) as T[]) : null;
  } catch {
    return null;
  }
}

async function load<T>(name: string): Promise<T[]> {
  if (cache.has(name)) return cache.get(name) as T[];
  const stored = typeof window !== 'undefined' ? readLS<T>(name) : null;
  let data: T[];
  if (stored) data = stored;
  else {
    const res = await fetch(`/seed/${name}.json`);
    data = res.ok ? ((await res.json()) as T[]) : [];
  }
  cache.set(name, data);
  return data;
}

function save(name: string, data: unknown[]) {
  cache.set(name, data);
  try {
    window.localStorage.setItem(PREFIX + name, JSON.stringify(data));
  } catch (e) {
    throw new Error('Browser storage is full. Large uploads should use the API mode (run the backend).');
  }
}

async function crud<T extends { id: string }>(name: string) {
  const list = await load<T>(name);
  return {
    list,
    find: (id: string) => list.find((x) => x.id === id),
    put: (item: T) => {
      const i = list.findIndex((x) => x.id === item.id);
      const next = i === -1 ? [...list, item] : list.map((x) => (x.id === item.id ? item : x));
      save(name, next);
      return item;
    },
    remove: (id: string) => save(name, list.filter((x) => x.id !== id)),
  };
}

const now = () => new Date().toISOString();

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });

export class LocalStorageDataSource implements DataSource {
  readonly kind = 'local' as const;

  timelines = () => load<any>('timelines');
  events = async (f: EventFilters = {}) => filterEvents(await load<HistoricalEvent>('events'), f);
  event = async (id: string) => {
    const all = await load<HistoricalEvent>('events');
    const e = all.find((x) => x.id === id || x.slug === id);
    if (!e) throw new Error('Event not found');
    return e;
  };
  createEvent = async (d: Partial<HistoricalEvent>) => {
    const c = await crud<HistoricalEvent>('events');
    const e = {
      region: 'Global', civilization: '', endYear: null, dateLabel: String(d.startYear ?? ''), approximate: false, description: '',
      significance: '', locations: [], images: [], videos: [], documents: [], wikiTitle: null, noImage: false, references: [],
      relatedEventIds: [], entities: [], tags: [], featured: false, status: 'draft',
      ...d, id: uid((d.timeline ?? 'ev').slice(0, 2)), slug: slugify(d.title ?? 'event'), createdAt: now(), updatedAt: now(),
    } as HistoricalEvent;
    return c.put(e);
  };
  updateEvent = async (id: string, d: Partial<HistoricalEvent>) => {
    const c = await crud<HistoricalEvent>('events');
    const cur = c.find(id);
    if (!cur) throw new Error('Event not found');
    return c.put({ ...cur, ...d, id, slug: d.title ? slugify(d.title) : cur.slug, updatedAt: now() });
  };
  deleteEvent = async (id: string) => (await crud<HistoricalEvent>('events')).remove(id);

  blogs = async (includeDrafts = false) =>
    (await load<Blog>('blogs')).filter((b) => includeDrafts || b.status === 'published').sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  blog = async (id: string) => {
    const b = (await load<Blog>('blogs')).find((x) => x.id === id || x.slug === id);
    if (!b) throw new Error('Story not found');
    return b;
  };
  createBlog = async (d: Partial<Blog>) =>
    (await crud<Blog>('blogs')).put({
      timeline: 'world', excerpt: (d.content ?? '').replace(/[#>*_`]/g, '').slice(0, 160), tags: [], relatedEventIds: [], coverImage: null,
      wikiTitle: null, author: 'History Bioscope Editorial', status: 'draft', content: '', title: 'Untitled',
      ...d, id: uid('blog'), slug: d.slug || slugify(d.title ?? 'story'), createdAt: now(), updatedAt: now(),
    } as Blog);
  updateBlog = async (id: string, d: Partial<Blog>) => {
    const c = await crud<Blog>('blogs');
    const cur = c.find(id);
    if (!cur) throw new Error('Story not found');
    return c.put({ ...cur, ...d, id, updatedAt: now() });
  };
  deleteBlog = async (id: string) => (await crud<Blog>('blogs')).remove(id);

  media = async () => [...(await load<MediaItem>('media'))].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  uploadMedia = async (file: File, caption?: string, eventId?: string) => {
    if (file.size > 3 * 1024 * 1024) throw new Error('In browser mode files must be under 3 MB. Start the backend for larger uploads.');
    const url = await fileToDataUrl(file);
    const type: MediaItem['type'] = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : file.type === 'application/pdf' ? 'document' : 'other';
    return (await crud<MediaItem>('media')).put({
      id: uid('media'), key: file.name, url, type, mimeType: file.type, size: file.size, originalName: file.name, caption: caption ?? '',
      eventId: eventId ?? null, createdAt: now(), updatedAt: now(),
    });
  };
  deleteMedia = async (id: string) => (await crud<MediaItem>('media')).remove(id);

  locations = () => load<LocationItem>('locations');
  createLocation = async (d: Partial<LocationItem>) =>
    (await crud<LocationItem>('locations')).put({ name: '', lat: 0, lng: 0, eventIds: [], ...d, id: uid('loc'), createdAt: now(), updatedAt: now() } as LocationItem);
  updateLocation = async (id: string, d: Partial<LocationItem>) => {
    const c = await crud<LocationItem>('locations');
    const cur = c.find(id);
    if (!cur) throw new Error('Location not found');
    return c.put({ ...cur, ...d, id, updatedAt: now() });
  };
  deleteLocation = async (id: string) => (await crud<LocationItem>('locations')).remove(id);

  routes = () => load<any>('routes');
  territories = () => load<any>('territories');
  graph = async (timeline?: string, era?: string) => buildGraph(filterEvents(await load<HistoricalEvent>('events'), { timeline, era }));
  search = async (f: EventFilters) => searchAll(await load<HistoricalEvent>('events'), await load<Blog>('blogs'), f);
  stats = async () =>
    computeStats(await load<HistoricalEvent>('events'), (await load('blogs')).length, (await load('media')).length, (await load('locations')).length);
  reset = async () => {
    for (const k of ['events', 'blogs', 'media', 'locations', 'routes', 'territories', 'timelines']) {
      try {
        window.localStorage.removeItem(PREFIX + k);
      } catch {}
      cache.delete(k);
    }
  };
}
