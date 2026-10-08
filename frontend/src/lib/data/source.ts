import type {
  Blog, EventFilters, GraphData, HistoricalEvent, HistoricalRoute, LocationItem, MediaItem, SearchResult, Stats, Territory, Timeline,
} from '../types';

/**
 * DataSource – the frontend side of the storage abstraction.
 * UI code only talks to this interface; the concrete provider is chosen by the
 * factory in ./index.ts (NestJS API or browser LocalStorage).
 */
export interface DataSource {
  readonly kind: 'api' | 'local';
  timelines(): Promise<Timeline[]>;
  events(filters?: EventFilters): Promise<HistoricalEvent[]>;
  event(idOrSlug: string): Promise<HistoricalEvent>;
  createEvent(data: Partial<HistoricalEvent>): Promise<HistoricalEvent>;
  updateEvent(id: string, data: Partial<HistoricalEvent>): Promise<HistoricalEvent>;
  deleteEvent(id: string): Promise<void>;

  blogs(includeDrafts?: boolean): Promise<Blog[]>;
  blog(idOrSlug: string): Promise<Blog>;
  createBlog(data: Partial<Blog>): Promise<Blog>;
  updateBlog(id: string, data: Partial<Blog>): Promise<Blog>;
  deleteBlog(id: string): Promise<void>;

  media(): Promise<MediaItem[]>;
  uploadMedia(file: File, caption?: string, eventId?: string): Promise<MediaItem>;
  deleteMedia(id: string): Promise<void>;

  locations(): Promise<LocationItem[]>;
  createLocation(data: Partial<LocationItem>): Promise<LocationItem>;
  updateLocation(id: string, data: Partial<LocationItem>): Promise<LocationItem>;
  deleteLocation(id: string): Promise<void>;

  routes(): Promise<HistoricalRoute[]>;
  territories(): Promise<Territory[]>;
  graph(timeline?: string, era?: string): Promise<GraphData>;
  search(filters: EventFilters): Promise<SearchResult>;
  stats(): Promise<Stats>;
  reset(): Promise<void>;
}
