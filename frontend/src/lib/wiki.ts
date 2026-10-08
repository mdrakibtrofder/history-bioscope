'use client';
import { useQuery } from '@tanstack/react-query';

export interface WikiSummary {
  title: string;
  extract: string;
  thumbnail?: string;
  image?: string;
  url: string;
}
export interface WikiImage {
  src: string;
  caption: string;
  title: string;
}

const BASE = 'https://en.wikipedia.org/api/rest_v1';

/** Fetches a Wikipedia summary (thumbnail + extract). Cached for the session. */
export function useWikiSummary(title?: string | null, enabled = true) {
  return useQuery<WikiSummary | null>({
    queryKey: ['wiki', title],
    enabled: !!title && enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`${BASE}/page/summary/${title}`);
      if (!res.ok) return null;
      const j = await res.json();
      return {
        title: j.title,
        extract: j.extract,
        thumbnail: j.thumbnail?.source,
        image: j.originalimage?.source,
        url: j.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${title}`,
      };
    },
  });
}

/** Fetches the images used on a Wikipedia article for the event gallery. */
export function useWikiImages(title?: string | null, enabled = true) {
  return useQuery<WikiImage[]>({
    queryKey: ['wiki-media', title],
    enabled: !!title && enabled,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    queryFn: async () => {
      const res = await fetch(`${BASE}/page/media-list/${title}`);
      if (!res.ok) return [];
      const j = await res.json();
      const items: WikiImage[] = [];
      for (const it of j.items ?? []) {
        if (it.type !== 'image') continue;
        const t: string = it.title ?? '';
        if (/\.(svg)$/i.test(t) || /(icon|logo|flag|symbol|commons-logo|wiki|seal)/i.test(t)) continue;
        const src = it.srcset?.[it.srcset.length - 1]?.src ?? it.srcset?.[0]?.src;
        if (!src) continue;
        items.push({ src: src.startsWith('//') ? `https:${src}` : src, caption: it.caption?.text ?? '', title: t.replace(/^File:/, '').replace(/\.[a-z]+$/i, '').replace(/_/g, ' ') });
        if (items.length >= 12) break;
      }
      return items;
    },
  });
}
