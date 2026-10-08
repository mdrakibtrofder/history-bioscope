'use client';
import { Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useEvents, useMutate } from '@/lib/hooks';
import type { HistoricalEvent } from '@/lib/types';
import { TIMELINE_META, cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { Input, Select } from '../ui/input';
import { Spinner } from '../ui/misc';
import { EventForm, emptyEvent, type EventDraft } from './event-form';

export function EventsAdmin({ editId }: { editId?: string | null }) {
  const { data: events, isLoading } = useEvents({ includeDrafts: true });
  const [q, setQ] = useState('');
  const [tl, setTl] = useState('');
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState<EventDraft | null>(null);
  const del = useMutate((ds, id: string) => ds.deleteEvent(id));
  const patch = useMutate((ds, a: { id: string; data: Partial<HistoricalEvent> }) => ds.updateEvent(a.id, a.data));

  useEffect(() => {
    if (editId && events) {
      const e = events.find((x) => x.id === editId);
      if (e) setEditing(e);
    }
  }, [editId, events]);

  const list = useMemo(
    () =>
      (events ?? [])
        .filter((e) => !tl || e.timeline === tl)
        .filter((e) => !status || e.status === status)
        .filter((e) => !q || `${e.title} ${e.era} ${e.dateLabel}`.toLowerCase().includes(q.toLowerCase())),
    [events, tl, status, q],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input placeholder="Search events…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={tl} onChange={(e) => setTl(e.target.value)} className="w-auto">
          <option value="">All timelines</option>
          <option value="bangladesh">Bangladesh</option>
          <option value="islamic">Islamic</option>
          <option value="world">World</option>
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-auto">
          <option value="">Any status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </Select>
        <Button onClick={() => setEditing(emptyEvent())}><Plus /> New event</Button>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-royal-50/60 text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Timeline / era</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((e) => (
                <tr key={e.id} className="hover:bg-royal-50/30">
                  <td className="px-4 py-3">
                    <Link href={`/events/${e.id}`} className="font-semibold text-ink hover:text-royal-700">{e.title}</Link>
                    {e.featured && <Star className="ml-1.5 inline size-3.5 fill-amber-400 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: TIMELINE_META[e.timeline]?.color }}>{TIMELINE_META[e.timeline]?.short}</span>
                    <span className="block text-xs text-muted">{e.era}</span>
                  </td>
                  <td className="px-4 py-3 text-muted">{e.dateLabel}</td>
                  <td className="px-4 py-3">
                    <Badge className={cn(e.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700')}>{e.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title={e.status === 'published' ? 'Unpublish' : 'Publish'}
                        onClick={() => patch.mutate({ id: e.id, data: { status: e.status === 'published' ? 'draft' : 'published' } })}
                      >
                        {e.status === 'published' ? <EyeOff /> : <Eye />}
                      </Button>
                      <Button size="icon-sm" variant="ghost" title="Edit" onClick={() => setEditing(e)}><Pencil /></Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Delete"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => {
                          if (window.confirm(`Delete “${e.title}”? This cannot be undone.`)) del.mutate(e.id);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-4 py-2 text-xs text-muted">{list.length} of {events?.length ?? 0} events</p>
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        {editing && (
          <DialogContent title={editing.id ? `Edit: ${editing.title}` : 'Create new event'} className="max-w-3xl">
            <EventForm key={editing.id ?? 'new'} initial={editing} onDone={() => setEditing(null)} />
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
