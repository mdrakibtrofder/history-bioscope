export type TimelineId = 'bangladesh' | 'islamic' | 'world';
export type EntityType = 'person' | 'place' | 'empire' | 'battle' | 'religion';
export type PublishStatus = 'draft' | 'published';

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  country?: string;
  region?: string;
  historicalTerritory?: string;
}
export interface MediaRef {
  url: string;
  caption?: string;
  credit?: string;
  type?: string;
}
export interface VideoRef {
  type: 'youtube' | 'upload' | 'link';
  url: string;
  title?: string;
}
export interface Reference {
  title: string;
  url?: string;
}
export interface EntityTag {
  type: EntityType;
  name: string;
}

export interface HistoricalEvent {
  id: string;
  slug: string;
  title: string;
  timeline: TimelineId;
  era: string;
  category: string;
  region: string;
  civilization: string;
  startYear: number;
  endYear: number | null;
  dateLabel: string;
  approximate: boolean;
  summary: string;
  description: string;
  significance: string;
  locations: GeoLocation[];
  images: MediaRef[];
  videos: VideoRef[];
  documents?: MediaRef[];
  wikiTitle: string | null;
  noImage: boolean;
  references: Reference[];
  relatedEventIds: string[];
  entities: EntityTag[];
  tags: string[];
  featured: boolean;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Timeline {
  id: TimelineId;
  name: string;
  nameBn?: string;
  color: string;
  description: string;
  eras: string[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  timeline: string;
  excerpt: string;
  content: string;
  tags: string[];
  relatedEventIds: string[];
  coverImage: string | null;
  wikiTitle?: string | null;
  author: string;
  status: PublishStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MediaItem {
  id: string;
  key: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'other';
  mimeType: string;
  size: number;
  originalName: string;
  caption?: string;
  eventId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LocationItem extends GeoLocation {
  id: string;
  eventIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HistoricalRoute {
  id: string;
  name: string;
  type: 'trade' | 'migration' | 'military' | 'journey';
  timeline: TimelineId;
  color: string;
  startYear: number;
  endYear: number;
  description: string;
  relatedEventIds: string[];
  path: [number, number][];
}

export interface Territory {
  id: string;
  name: string;
  empire: string;
  timeline: TimelineId;
  color: string;
  startYear: number;
  endYear: number;
  polygon: [number, number][];
}

export interface EventFilters {
  timeline?: string;
  era?: string;
  category?: string;
  region?: string;
  civilization?: string;
  q?: string;
  from?: number;
  to?: number;
  includeDrafts?: boolean;
  featured?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'event' | EntityType;
  timeline?: string;
  year?: number;
  degree: number;
}
export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: 'involves' | 'related';
}
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Stats {
  totalEvents: number;
  published: number;
  drafts: number;
  byTimeline: Record<string, number>;
  byCategory: Record<string, number>;
  byEra: Record<string, number>;
  blogs: number;
  media: number;
  locations: number;
}

export interface SearchResult {
  query: string;
  total: number;
  events: HistoricalEvent[];
  blogs: Blog[];
  entities: { type: string; name: string; count: number }[];
}
