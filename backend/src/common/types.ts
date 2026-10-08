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
  type: 'person' | 'place' | 'empire' | 'battle' | 'religion';
  name: string;
}
export type PublishStatus = 'draft' | 'published';

export interface HistoricalEvent {
  id: string;
  slug: string;
  title: string;
  timeline: 'bangladesh' | 'islamic' | 'world';
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
