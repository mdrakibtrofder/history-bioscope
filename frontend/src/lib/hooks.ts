'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDataSource, type DataSource } from './data';
import { useApp } from './store';
import type { EventFilters } from './types';

export function useDS(): DataSource | null {
  const mode = useApp((s) => s.dataMode);
  return mode ? getDataSource(mode) : null;
}

function useQ<T>(key: unknown[], fn: (ds: DataSource) => Promise<T>, enabled = true) {
  const mode = useApp((s) => s.dataMode);
  return useQuery<T>({
    queryKey: [mode, ...key],
    queryFn: () => fn(getDataSource(mode!)),
    enabled: !!mode && enabled,
  });
}

export const useTimelines = () => useQ(['timelines'], (ds) => ds.timelines());
export const useEvents = (f: EventFilters = {}) => useQ(['events', f], (ds) => ds.events(f));
export const useEvent = (id?: string) => useQ(['event', id], (ds) => ds.event(id!), !!id);
export const useBlogs = (includeDrafts = false) => useQ(['blogs', includeDrafts], (ds) => ds.blogs(includeDrafts));
export const useBlog = (id?: string) => useQ(['blog', id], (ds) => ds.blog(id!), !!id);
export const useMedia = () => useQ(['media'], (ds) => ds.media());
export const useLocations = () => useQ(['locations'], (ds) => ds.locations());
export const useRoutes = () => useQ(['routes'], (ds) => ds.routes());
export const useTerritories = () => useQ(['territories'], (ds) => ds.territories());
export const useGraph = (timeline?: string, era?: string) => useQ(['graph', timeline, era], (ds) => ds.graph(timeline, era));
export const useSearch = (f: EventFilters, enabled = true) => useQ(['search', f], (ds) => ds.search(f), enabled);
export const useStats = () => useQ(['stats'], (ds) => ds.stats());

/** Generic mutation that invalidates everything for the current data mode afterwards */
export function useMutate<TArgs, TResult>(fn: (ds: DataSource, args: TArgs) => Promise<TResult>) {
  const qc = useQueryClient();
  const mode = useApp((s) => s.dataMode);
  return useMutation<TResult, Error, TArgs>({
    mutationFn: (args) => fn(getDataSource(mode!), args),
    onSuccess: () => qc.invalidateQueries(),
  });
}
