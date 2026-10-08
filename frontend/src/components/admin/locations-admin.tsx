'use client';
import { MapPin, Plus, Save, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocations, useMutate } from '@/lib/hooks';
import type { LocationItem } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LocationPicker } from '../map';
import { Button } from '../ui/button';
import { Field, Input } from '../ui/input';
import { Spinner } from '../ui/misc';

export function LocationsAdmin() {
  const { data: locations, isLoading } = useLocations();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<Partial<LocationItem> | null>(null);
  const [err, setErr] = useState('');
  const save = useMutate((ds, l: Partial<LocationItem>) => (l.id ? ds.updateLocation(l.id, l) : ds.createLocation(l)));
  const del = useMutate((ds, id: string) => ds.deleteLocation(id));
  const list = useMemo(
    () => (locations ?? []).filter((l) => !q || `${l.name} ${l.country} ${l.historicalTerritory}`.toLowerCase().includes(q.toLowerCase())),
    [locations, q],
  );

  const submit = async () => {
    if (!sel?.name) return setErr('Name is required');
    setErr('');
    try {
      const saved = await save.mutateAsync({ ...sel, lat: Number(sel.lat), lng: Number(sel.lng) });
      setSel(saved);
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="rounded-2xl border border-line bg-white">
        <div className="flex gap-2 border-b border-line p-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <Input placeholder="Search places…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Button size="icon" onClick={() => setSel({ name: '', lat: 23.7, lng: 90.4, country: '', region: '', historicalTerritory: '', eventIds: [] })} title="New location">
            <Plus />
          </Button>
        </div>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="max-h-[560px] overflow-y-auto scrollbar-thin">
            {list.map((l) => (
              <button
                key={l.id}
                onClick={() => setSel(l)}
                className={cn('flex w-full cursor-pointer items-start gap-2 border-b border-line/60 px-3 py-2.5 text-left hover:bg-royal-50/60', sel?.id === l.id && 'bg-royal-50')}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-royal-500" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{l.name}</span>
                  <span className="block truncate text-xs text-muted">{[l.country, l.historicalTerritory].filter(Boolean).join(' · ')} · {l.eventIds?.length ?? 0} events</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        {sel ? (
          <div className="space-y-4 rounded-2xl border border-line bg-white p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Name" className="sm:col-span-2"><Input value={sel.name ?? ''} onChange={(e) => setSel({ ...sel, name: e.target.value })} /></Field>
              <Field label="Latitude"><Input type="number" step="0.0001" value={sel.lat ?? ''} onChange={(e) => setSel({ ...sel, lat: e.target.value as unknown as number })} /></Field>
              <Field label="Longitude"><Input type="number" step="0.0001" value={sel.lng ?? ''} onChange={(e) => setSel({ ...sel, lng: e.target.value as unknown as number })} /></Field>
              <Field label="Country"><Input value={sel.country ?? ''} onChange={(e) => setSel({ ...sel, country: e.target.value })} /></Field>
              <Field label="Region"><Input value={sel.region ?? ''} onChange={(e) => setSel({ ...sel, region: e.target.value })} /></Field>
              <Field label="Historical territory" className="sm:col-span-2"><Input value={sel.historicalTerritory ?? ''} onChange={(e) => setSel({ ...sel, historicalTerritory: e.target.value })} /></Field>
            </div>
            <LocationPicker
              lat={Number(sel.lat)}
              lng={Number(sel.lng)}
              onPick={(lat, lng, name, country) => setSel((s) => ({ ...s, lat, lng, ...(name && !s?.name ? { name } : {}), ...(country && !s?.country ? { country } : {}) }))}
            />
            {err && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
            <div className="flex justify-between">
              {sel.id ? (
                <Button variant="ghost" className="text-red-600" onClick={() => window.confirm('Delete this location?') && (del.mutate(sel.id!), setSel(null))}>
                  <Trash2 /> Delete
                </Button>
              ) : <span />}
              <Button onClick={submit} disabled={save.isPending}><Save /> {save.isPending ? 'Saving…' : 'Save location'}</Button>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-80 items-center justify-center rounded-2xl border border-dashed border-royal-200 text-sm text-muted">
            Select a place to edit, or create a new one.
          </div>
        )}
      </div>
    </div>
  );
}
