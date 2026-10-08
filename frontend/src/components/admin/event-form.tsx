'use client';
import { Eye, ImagePlus, MapPin, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useEvents, useMedia, useMutate, useTimelines } from '@/lib/hooks';
import type { EntityTag, GeoLocation, HistoricalEvent, MediaRef, Reference, TimelineId, VideoRef } from '@/lib/types';
import { CATEGORY_META, ENTITY_META, cn } from '@/lib/utils';
import { Markdown } from '../event/markdown';
import { LocationPicker } from '../map';
import { Button } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/input';

export type EventDraft = Partial<HistoricalEvent>;

export const emptyEvent = (): EventDraft => ({
  title: '', timeline: 'bangladesh', era: 'Ancient Bengal', category: 'politics', startYear: 1971, endYear: null, dateLabel: '', approximate: false,
  region: 'South Asia', civilization: '', summary: '', description: '', significance: '', locations: [], images: [], videos: [], documents: [],
  references: [], entities: [], relatedEventIds: [], tags: [], wikiTitle: '', noImage: false, featured: false, status: 'draft',
});

function ListBlock<T>({
  title, items, onChange, render, empty, addLabel, onAdd,
}: {
  title: string;
  items: T[];
  onChange: (v: T[]) => void;
  render: (item: T, update: (patch: Partial<T>) => void, i: number) => React.ReactNode;
  empty: () => T;
  addLabel: string;
  onAdd?: () => void;
}) {
  return (
    <fieldset className="rounded-2xl border border-line p-4">
      <legend className="px-2 text-sm font-semibold text-ink">{title}</legend>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="relative rounded-xl bg-royal-50/50 p-3 pr-10">
            {render(it, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))), i)}
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute right-2 top-2 cursor-pointer rounded-lg p-1.5 text-red-500 hover:bg-red-50" aria-label="Remove">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
      <Button type="button" size="sm" variant="secondary" className="mt-3" onClick={() => (onAdd ? onAdd() : onChange([...items, empty()]))}>
        <Plus /> {addLabel}
      </Button>
    </fieldset>
  );
}

export function EventForm({ initial, onDone }: { initial: EventDraft; onDone: () => void }) {
  const [d, setD] = useState<EventDraft>({ ...emptyEvent(), ...initial });
  const [tab, setTab] = useState<'basics' | 'content' | 'places' | 'media' | 'links'>('basics');
  const [preview, setPreview] = useState(false);
  const [picker, setPicker] = useState<number | null>(null);
  const [err, setErr] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const [relQ, setRelQ] = useState('');

  const { data: timelines = [] } = useTimelines();
  const { data: allEvents = [] } = useEvents({ includeDrafts: true });
  const { data: library = [] } = useMedia();
  const isNew = !initial.id;

  const save = useMutate((ds, ev: EventDraft) => (isNew ? ds.createEvent(ev) : ds.updateEvent(initial.id!, ev)));
  const upload = useMutate((ds, f: File) => ds.uploadMedia(f, f.name, initial.id));

  const set = <K extends keyof HistoricalEvent>(k: K, v: HistoricalEvent[K]) => setD((x) => ({ ...x, [k]: v }));
  const eras = timelines.find((t) => t.id === d.timeline)?.eras ?? [];
  const relCandidates = useMemo(
    () => (relQ.length > 1 ? allEvents.filter((e) => e.id !== d.id && !d.relatedEventIds?.includes(e.id) && e.title.toLowerCase().includes(relQ.toLowerCase())).slice(0, 6) : []),
    [relQ, allEvents, d.id, d.relatedEventIds],
  );

  const submit = async (status?: 'draft' | 'published') => {
    setErr('');
    if (!d.title?.trim()) return setErr('Title is required'), setTab('basics');
    if (!d.summary?.trim()) return setErr('Summary is required'), setTab('content');
    const payload: EventDraft = {
      ...d,
      status: status ?? d.status,
      startYear: Number(d.startYear),
      endYear: d.endYear === null || d.endYear === undefined || (d.endYear as unknown) === '' ? null : Number(d.endYear),
      dateLabel: d.dateLabel || (d.endYear ? `${d.startYear} – ${d.endYear}` : String(d.startYear)),
      wikiTitle: d.wikiTitle ? d.wikiTitle.trim().replace(/ /g, '_') : null,
      locations: (d.locations ?? []).map((l) => ({ ...l, lat: Number(l.lat), lng: Number(l.lng) })),
    };
    if (payload.endYear === null) delete (payload as Record<string, unknown>).endYear;
    try {
      await save.mutateAsync(payload);
      onDone();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const onUpload = async (files: FileList | null, kind: 'image' | 'doc') => {
    if (!files) return;
    setErr('');
    for (const f of Array.from(files)) {
      try {
        const m = await upload.mutateAsync(f);
        if (kind === 'image') set('images', [...(d.images ?? []), { url: m.url, caption: '', credit: '' }]);
        else setD((x) => ({ ...x, documents: [...(x.documents ?? []), { url: m.url, caption: f.name, type: 'pdf' }] }));
      } catch (e) {
        setErr((e as Error).message);
      }
    }
  };

  const TABS = [
    ['basics', 'Basics'],
    ['content', 'Content'],
    ['places', `Places (${d.locations?.length ?? 0})`],
    ['media', `Media (${(d.images?.length ?? 0) + (d.videos?.length ?? 0)})`],
    ['links', 'Links & graph'],
  ] as const;

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-1 rounded-2xl bg-royal-50/80 p-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn('cursor-pointer rounded-xl px-3 py-1.5 text-sm font-semibold', tab === id ? 'bg-white text-royal-700 shadow-sm' : 'text-muted')}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'basics' && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title *" className="sm:col-span-2">
            <Input value={d.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Battle of Plassey" />
          </Field>
          <Field label="Timeline">
            <Select value={d.timeline} onChange={(e) => (set('timeline', e.target.value as TimelineId), set('era', timelines.find((t) => t.id === e.target.value)?.eras[0] ?? ''))}>
              {timelines.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Era">
            <Select value={d.era} onChange={(e) => set('era', e.target.value)}>
              {eras.map((x) => <option key={x}>{x}</option>)}
              {d.era && !eras.includes(d.era) && <option>{d.era}</option>}
            </Select>
          </Field>
          <Field label="Category">
            <Select value={d.category} onChange={(e) => set('category', e.target.value)}>
              {Object.entries(CATEGORY_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={d.status} onChange={(e) => set('status', e.target.value as 'draft')}>
              <option value="draft">Draft (hidden from visitors)</option>
              <option value="published">Published</option>
            </Select>
          </Field>
          <Field label="Start year *" hint="Negative for BCE">
            <Input type="number" value={d.startYear ?? ''} onChange={(e) => set('startYear', e.target.value as unknown as number)} />
          </Field>
          <Field label="End year" hint="Leave empty for a single date">
            <Input type="number" value={d.endYear ?? ''} onChange={(e) => set('endYear', e.target.value as unknown as number)} />
          </Field>
          <Field label="Date label" hint="Shown to readers, e.g. “23 June 1757”" className="sm:col-span-2">
            <Input value={d.dateLabel} onChange={(e) => set('dateLabel', e.target.value)} />
          </Field>
          <Field label="Region">
            <Input value={d.region} onChange={(e) => set('region', e.target.value)} placeholder="South Asia" />
          </Field>
          <Field label="Civilization">
            <Input value={d.civilization} onChange={(e) => set('civilization', e.target.value)} placeholder="Bengal" />
          </Field>
          <div className="flex flex-wrap gap-5 sm:col-span-2">
            {([
              ['approximate', 'Date is approximate'],
              ['featured', 'Featured on homepage'],
              ['noImage', 'Do not show images'],
            ] as const).map(([k, l]) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={!!d[k]} onChange={(e) => set(k, e.target.checked)} className="size-4 accent-royal-600" /> {l}
              </label>
            ))}
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-4">
          <Field label="Summary *" hint="One or two sentences">
            <Textarea value={d.summary} onChange={(e) => set('summary', e.target.value)} className="min-h-20" />
          </Field>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">Description (Markdown)</span>
              <button type="button" onClick={() => setPreview((p) => !p)} className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-royal-600">
                <Eye className="size-3.5" /> {preview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {preview ? (
              <div className="min-h-48 rounded-xl border border-line p-4"><Markdown>{d.description || '*Nothing yet*'}</Markdown></div>
            ) : (
              <Textarea value={d.description} onChange={(e) => set('description', e.target.value)} className="min-h-48 font-mono text-[13px]" placeholder="## Background&#10;Write **rich** text with Markdown…" />
            )}
          </div>
          <Field label="Historical significance">
            <Textarea value={d.significance} onChange={(e) => set('significance', e.target.value)} className="min-h-20" />
          </Field>
        </div>
      )}

      {tab === 'places' && (
        <ListBlock<GeoLocation>
          title="Geographic locations"
          items={d.locations ?? []}
          onChange={(v) => set('locations', v)}
          empty={() => ({ name: '', lat: 23.7, lng: 90.4, country: '', region: '', historicalTerritory: '' })}
          addLabel="Add location"
          render={(l, up, i) => (
            <div className="space-y-2">
              <div className="grid gap-2 sm:grid-cols-3">
                <Input placeholder="Place name" value={l.name} onChange={(e) => up({ name: e.target.value })} className="sm:col-span-3" />
                <Input type="number" step="0.0001" placeholder="Latitude" value={l.lat} onChange={(e) => up({ lat: e.target.value as unknown as number })} />
                <Input type="number" step="0.0001" placeholder="Longitude" value={l.lng} onChange={(e) => up({ lng: e.target.value as unknown as number })} />
                <Button type="button" variant={picker === i ? 'default' : 'outline'} onClick={() => setPicker(picker === i ? null : i)}>
                  <MapPin /> {picker === i ? 'Close map' : 'Pick on map'}
                </Button>
                <Input placeholder="Country" value={l.country ?? ''} onChange={(e) => up({ country: e.target.value })} />
                <Input placeholder="Region" value={l.region ?? ''} onChange={(e) => up({ region: e.target.value })} />
                <Input placeholder="Historical territory" value={l.historicalTerritory ?? ''} onChange={(e) => up({ historicalTerritory: e.target.value })} />
              </div>
              {picker === i && (
                <LocationPicker
                  lat={Number(l.lat)}
                  lng={Number(l.lng)}
                  onPick={(lat, lng, name, country) => up({ lat, lng, ...(name && !l.name ? { name } : {}), ...(country && !l.country ? { country } : {}) })}
                />
              )}
            </div>
          )}
        />
      )}

      {tab === 'media' && (
        <div className="space-y-4">
          <Field label="Wikipedia article title" hint="Used for automatic photos & summary, e.g. Battle_of_Plassey">
            <Input value={d.wikiTitle ?? ''} onChange={(e) => set('wikiTitle', e.target.value)} />
          </Field>
          <ListBlock<MediaRef>
            title="Images"
            items={d.images ?? []}
            onChange={(v) => set('images', v)}
            empty={() => ({ url: '', caption: '', credit: '' })}
            addLabel="Add image URL"
            render={(m, up) => (
              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {m.url ? <img src={m.url} alt="" className="size-16 shrink-0 rounded-lg object-cover" /> : <div className="size-16 shrink-0 rounded-lg bg-white" />}
                <div className="grid flex-1 gap-2 sm:grid-cols-2">
                  <Input placeholder="Image URL" value={m.url} onChange={(e) => up({ url: e.target.value })} className="sm:col-span-2" />
                  <Input placeholder="Caption" value={m.caption ?? ''} onChange={(e) => up({ caption: e.target.value })} />
                  <Input placeholder="Credit / source" value={m.credit ?? ''} onChange={(e) => up({ credit: e.target.value })} />
                </div>
              </div>
            )}
          />
          <div className="flex flex-wrap gap-2">
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files, 'image')} />
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
              <Upload /> {upload.isPending ? 'Uploading…' : 'Upload images'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowLibrary((s) => !s)}>
              <ImagePlus /> Choose from media library
            </Button>
          </div>
          {showLibrary && (
            <div className="grid max-h-52 grid-cols-4 gap-2 overflow-y-auto rounded-xl border border-line p-2 sm:grid-cols-6">
              {library.filter((m) => m.type === 'image').map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => set('images', [...(d.images ?? []), { url: m.url, caption: m.caption ?? '' }])}
                  className="cursor-pointer overflow-hidden rounded-lg ring-royal-400 hover:ring-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" className="aspect-square w-full object-cover" />
                </button>
              ))}
              {library.filter((m) => m.type === 'image').length === 0 && <p className="col-span-full p-3 text-sm text-muted">Library is empty — upload in the Media tab.</p>}
            </div>
          )}
          <ListBlock<VideoRef>
            title="Videos"
            items={d.videos ?? []}
            onChange={(v) => set('videos', v)}
            empty={() => ({ type: 'youtube', url: '', title: '' })}
            addLabel="Add video"
            render={(v, up) => (
              <div className="grid gap-2 sm:grid-cols-[130px_1fr]">
                <Select value={v.type} onChange={(e) => up({ type: e.target.value as VideoRef['type'] })}>
                  <option value="youtube">YouTube</option>
                  <option value="upload">Uploaded file</option>
                  <option value="link">Direct link</option>
                </Select>
                <Input placeholder="https://www.youtube.com/watch?v=…" value={v.url} onChange={(e) => up({ url: e.target.value })} />
                <Input placeholder="Title" value={v.title ?? ''} onChange={(e) => up({ title: e.target.value })} className="sm:col-span-2" />
              </div>
            )}
          />
          <ListBlock<MediaRef>
            title="Documents (PDF)"
            items={d.documents ?? []}
            onChange={(v) => set('documents', v)}
            empty={() => ({ url: '', caption: '' })}
            addLabel="Add document URL"
            render={(m, up) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="URL" value={m.url} onChange={(e) => up({ url: e.target.value })} />
                <Input placeholder="Title" value={m.caption ?? ''} onChange={(e) => up({ caption: e.target.value })} />
              </div>
            )}
          />
          <input ref={docRef} type="file" accept="application/pdf" hidden onChange={(e) => onUpload(e.target.files, 'doc')} />
          <Button type="button" variant="outline" onClick={() => docRef.current?.click()}><Upload /> Upload PDF</Button>
        </div>
      )}

      {tab === 'links' && (
        <div className="space-y-4">
          <ListBlock<Reference>
            title="References & sources"
            items={d.references ?? []}
            onChange={(v) => set('references', v)}
            empty={() => ({ title: '', url: '' })}
            addLabel="Add reference"
            render={(r, up) => (
              <div className="grid gap-2 sm:grid-cols-2">
                <Input placeholder="Title / citation" value={r.title} onChange={(e) => up({ title: e.target.value })} />
                <Input placeholder="URL (optional)" value={r.url ?? ''} onChange={(e) => up({ url: e.target.value })} />
              </div>
            )}
          />
          <ListBlock<EntityTag>
            title="Knowledge graph entities (people, places, empires, battles, religions)"
            items={d.entities ?? []}
            onChange={(v) => set('entities', v)}
            empty={() => ({ type: 'person', name: '' })}
            addLabel="Add entity"
            render={(en, up) => (
              <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                <Select value={en.type} onChange={(e) => up({ type: e.target.value as EntityTag['type'] })}>
                  {Object.entries(ENTITY_META).filter(([k]) => k !== 'event').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Select>
                <Input placeholder="Name" value={en.name} onChange={(e) => up({ name: e.target.value })} />
              </div>
            )}
          />
          <fieldset className="rounded-2xl border border-line p-4">
            <legend className="px-2 text-sm font-semibold">Related events</legend>
            <div className="flex flex-wrap gap-1.5">
              {(d.relatedEventIds ?? []).map((id) => (
                <span key={id} className="flex items-center gap-1 rounded-full bg-royal-50 px-2.5 py-1 text-xs font-semibold text-royal-700">
                  {allEvents.find((e) => e.id === id)?.title ?? id}
                  <button type="button" onClick={() => set('relatedEventIds', (d.relatedEventIds ?? []).filter((x) => x !== id))} className="cursor-pointer" aria-label="Remove">
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input className="mt-3" placeholder="Search events to link…" value={relQ} onChange={(e) => setRelQ(e.target.value)} />
            {relCandidates.length > 0 && (
              <div className="mt-2 divide-y divide-line rounded-xl border border-line">
                {relCandidates.map((e) => (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => (set('relatedEventIds', [...(d.relatedEventIds ?? []), e.id]), setRelQ(''))}
                    className="block w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-royal-50"
                  >
                    {e.title} <span className="text-xs text-muted">· {e.dateLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </fieldset>
        </div>
      )}

      {err && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <div className="sticky bottom-0 -mx-6 -mb-6 mt-6 flex flex-wrap justify-end gap-2 border-t border-line bg-white/95 px-6 py-4 backdrop-blur">
        <Button type="button" variant="ghost" onClick={onDone}>Cancel</Button>
        <Button type="button" variant="outline" onClick={() => submit('draft')} disabled={save.isPending}><Save /> Save draft</Button>
        <Button type="button" onClick={() => submit('published')} disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Publish'}</Button>
      </div>
    </div>
  );
}
