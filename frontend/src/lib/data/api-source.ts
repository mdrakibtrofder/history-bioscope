import type { DataSource } from './source';
import type { EventFilters } from '../types';

export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

function qs(params: Record<string, unknown> = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
  const s = p.toString();
  return s ? `?${s}` : '';
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const j = await res.json();
      msg = Array.isArray(j.message) ? j.message.join(', ') : j.message ?? msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

const body = (d: unknown) => JSON.stringify(d);

// Fields managed by the server that must not be sent in update payloads
const strip = <T extends object>(d: T) => {
  const { id: _i, slug: _s, createdAt: _c, updatedAt: _u, ...rest } = d as Record<string, unknown>;
  return rest;
};

export class ApiDataSource implements DataSource {
  readonly kind = 'api' as const;
  timelines = () => req<any>('/timelines');
  events = (f: EventFilters = {}) => req<any>(`/events${qs(f as Record<string, unknown>)}`);
  event = (id: string) => req<any>(`/events/${encodeURIComponent(id)}`);
  createEvent = (d: object) => req<any>('/events', { method: 'POST', body: body(strip(d)) });
  updateEvent = (id: string, d: object) => req<any>(`/events/${id}`, { method: 'PATCH', body: body(strip(d)) });
  deleteEvent = async (id: string) => void (await req(`/events/${id}`, { method: 'DELETE' }));

  blogs = (includeDrafts = false) => req<any>(`/blogs${qs({ includeDrafts })}`);
  blog = (id: string) => req<any>(`/blogs/${encodeURIComponent(id)}`);
  createBlog = (d: object) => req<any>('/blogs', { method: 'POST', body: body(strip(d)) });
  updateBlog = (id: string, d: object) => req<any>(`/blogs/${id}`, { method: 'PATCH', body: body(strip(d)) });
  deleteBlog = async (id: string) => void (await req(`/blogs/${id}`, { method: 'DELETE' }));

  media = () => req<any>('/media');
  uploadMedia = (file: File, caption?: string, eventId?: string) => {
    const fd = new FormData();
    fd.append('file', file);
    if (caption) fd.append('caption', caption);
    if (eventId) fd.append('eventId', eventId);
    return req<any>('/media/upload', { method: 'POST', body: fd });
  };
  deleteMedia = async (id: string) => void (await req(`/media/${id}`, { method: 'DELETE' }));

  locations = () => req<any>('/locations');
  createLocation = (d: object) => req<any>('/locations', { method: 'POST', body: body(strip(d)) });
  updateLocation = (id: string, d: object) => {
    const { eventIds: _e, ...rest } = strip(d) as Record<string, unknown>;
    return req<any>(`/locations/${id}`, { method: 'PATCH', body: body(rest) });
  };
  deleteLocation = async (id: string) => void (await req(`/locations/${id}`, { method: 'DELETE' }));

  routes = () => req<any>('/map/routes');
  territories = () => req<any>('/map/territories');
  graph = (timeline?: string, era?: string) => req<any>(`/graph${qs({ timeline, era })}`);
  search = (f: EventFilters) => req<any>(`/search${qs(f as Record<string, unknown>)}`);
  stats = () => req<any>('/stats');
  reset = async () => void (await req('/admin/reset', { method: 'POST' }));
}

export async function apiAvailable(timeoutMs = 1500): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${API_URL}/health`, { signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}
