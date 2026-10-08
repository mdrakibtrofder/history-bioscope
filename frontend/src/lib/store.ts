'use client';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { DataMode } from './data';

export type TimelineMode = 'horizontal' | 'vertical' | 'century' | 'events' | 'journey';

interface AppState {
  /** Resolved data provider (null while detecting) */
  dataMode: DataMode | null;
  /** User preference: auto-detect, force API, or force browser storage */
  preferredMode: 'auto' | DataMode;
  timelineMode: TimelineMode;
  scaleMode: 'time' | 'sequence';
  searchOpen: boolean;
  setDataMode: (m: DataMode) => void;
  setPreferredMode: (m: 'auto' | DataMode) => void;
  setTimelineMode: (m: TimelineMode) => void;
  setScaleMode: (m: 'time' | 'sequence') => void;
  setSearchOpen: (o: boolean) => void;
}

const safeStorage = createJSONStorage(() => {
  try {
    return window.localStorage;
  } catch {
    const mem = new Map<string, string>();
    return { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v), removeItem: (k) => void mem.delete(k) };
  }
});

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      dataMode: null,
      preferredMode: 'auto',
      timelineMode: 'horizontal',
      scaleMode: 'time',
      searchOpen: false,
      setDataMode: (dataMode) => set({ dataMode }),
      setPreferredMode: (preferredMode) => set({ preferredMode }),
      setTimelineMode: (timelineMode) => set({ timelineMode }),
      setScaleMode: (scaleMode) => set({ scaleMode }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
    }),
    {
      name: 'history-bioscope:prefs',
      storage: safeStorage,
      partialize: (s) => ({ preferredMode: s.preferredMode, timelineMode: s.timelineMode, scaleMode: s.scaleMode }),
    },
  ),
);
