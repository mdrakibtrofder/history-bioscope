import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { HistoricalEvent, TimelineId } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatYear(y: number): string {
  if (y < 0) return `${Math.abs(y).toLocaleString()} BCE`;
  if (y < 1000) return `${y} CE`;
  return String(y);
}

export function formatRange(e: Pick<HistoricalEvent, 'startYear' | 'endYear'>) {
  return e.endYear && e.endYear !== e.startYear ? `${formatYear(e.startYear)} – ${formatYear(e.endYear)}` : formatYear(e.startYear);
}

export const TIMELINE_META: Record<TimelineId, { label: string; short: string; color: string; soft: string; text: string; ring: string }> = {
  bangladesh: { label: 'Bangladesh History', short: 'Bangladesh', color: '#1f3be0', soft: 'bg-royal-50', text: 'text-royal-700', ring: 'ring-royal-200' },
  islamic: { label: 'Islamic History', short: 'Islamic', color: '#0f766e', soft: 'bg-teal-50', text: 'text-teal-700', ring: 'ring-teal-200' },
  world: { label: 'World History', short: 'World', color: '#7c3aed', soft: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-200' },
};

export const CATEGORY_META: Record<string, { label: string; color: string }> = {
  politics: { label: 'Politics', color: '#1f3be0' },
  war: { label: 'War & Battles', color: '#dc2626' },
  religion: { label: 'Religion', color: '#0f766e' },
  prophet: { label: 'Prophets', color: '#059669' },
  culture: { label: 'Culture & Arts', color: '#d97706' },
  science: { label: 'Science', color: '#0891b2' },
  technology: { label: 'Technology', color: '#4f46e5' },
  economy: { label: 'Economy & Trade', color: '#ca8a04' },
  movement: { label: 'Movements', color: '#db2777' },
  disaster: { label: 'Disasters', color: '#64748b' },
  dynasty: { label: 'Dynasties & Empires', color: '#7c3aed' },
  exploration: { label: 'Exploration', color: '#0284c7' },
};

export const ENTITY_META: Record<string, { label: string; color: string; bg: string }> = {
  event: { label: 'Event', color: '#1f3be0', bg: '#eef3ff' },
  person: { label: 'Person', color: '#db2777', bg: '#fdf2f8' },
  place: { label: 'Place', color: '#059669', bg: '#ecfdf5' },
  empire: { label: 'Empire', color: '#7c3aed', bg: '#f5f3ff' },
  battle: { label: 'Battle', color: '#dc2626', bg: '#fef2f2' },
  religion: { label: 'Religion', color: '#d97706', bg: '#fffbeb' },
};

export function centuryOf(year: number): number {
  return year > 0 ? Math.ceil(year / 100) : -Math.ceil(Math.abs(year) / 100);
}

export function centuryLabel(c: number): string {
  const n = Math.abs(c);
  const suf = n % 100 >= 11 && n % 100 <= 13 ? 'th' : n % 10 === 1 ? 'st' : n % 10 === 2 ? 'nd' : n % 10 === 3 ? 'rd' : 'th';
  return `${n}${suf} century ${c < 0 ? 'BCE' : 'CE'}`;
}

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

export function googleMapsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=14&basemap=satellite`;
}
export function googleEarthUrl(lat: number, lng: number) {
  return `https://earth.google.com/web/@${lat},${lng},300a,6000d,35y,0h,45t,0r`;
}

export const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 80);
