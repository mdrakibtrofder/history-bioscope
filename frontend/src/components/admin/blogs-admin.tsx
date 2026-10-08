'use client';
import { Columns2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBlogs, useEvents, useMutate } from '@/lib/hooks';
import type { Blog } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Markdown } from '../event/markdown';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Field, Input, Select, Textarea } from '../ui/input';
import { EmptyState, Spinner } from '../ui/misc';

const blank = (): Partial<Blog> => ({ title: '', excerpt: '', content: '## Introduction\n\nStart writing…', timeline: 'bangladesh', tags: [], relatedEventIds: [], status: 'draft', wikiTitle: '' });

const TOOLBAR: [string, string, string][] = [
  ['B', '**', '**'],
  ['I', '_', '_'],
  ['H2', '\n## ', ''],
  ['H3', '\n### ', ''],
  ['• List', '\n- ', ''],
  ['Quote', '\n> ', ''],
  ['Link', '[', '](https://)'],
];

function BlogEditor({ initial, onDone }: { initial: Partial<Blog>; onDone: () => void }) {
  const [b, setB] = useState<Partial<Blog>>(initial);
  const [split, setSplit] = useState(true);
  const [err, setErr] = useState('');
  const { data: events = [] } = useEvents();
  const save = useMutate((ds, d: Partial<Blog>) => (initial.id ? ds.updateBlog(initial.id, d) : ds.createBlog(d)));
  const set = <K extends keyof Blog>(k: K, v: Blog[K]) => setB((x) => ({ ...x, [k]: v }));

  const wrap = (pre: string, post: string) => {
    const ta = document.getElementById('blog-md') as HTMLTextAreaElement | null;
    const c = b.content ?? '';
    if (!ta) return set('content', c + pre + post);
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    set('content', c.slice(0, s) + pre + c.slice(s, e) + post + c.slice(e));
  };

  const submit = async (status: 'draft' | 'published') => {
    if (!b.title?.trim()) return setErr('Title is required');
    try {
      await save.mutateAsync({ ...b, status, wikiTitle: b.wikiTitle || null, coverImage: b.coverImage || null });
      onDone();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Field label="Title" className="md:col-span-2"><Input value={b.title} onChange={(e) => set('title', e.target.value)} /></Field>
        <Field label="Timeline">
          <Select value={b.timeline} onChange={(e) => set('timeline', e.target.value)}>
            <option value="bangladesh">Bangladesh</option>
            <option value="islamic">Islamic</option>
            <option value="world">World</option>
          </Select>
        </Field>
        <Field label="Tags (comma separated)"><Input value={(b.tags ?? []).join(', ')} onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></Field>
        <Field label="Excerpt" className="md:col-span-2"><Input value={b.excerpt} onChange={(e) => set('excerpt', e.target.value)} /></Field>
        <Field label="Cover image URL"><Input value={b.coverImage ?? ''} onChange={(e) => set('coverImage', e.target.value)} /></Field>
        <Field label="…or Wikipedia title for cover"><Input value={b.wikiTitle ?? ''} onChange={(e) => set('wikiTitle', e.target.value)} /></Field>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1 rounded-xl border border-line bg-royal-50/40 p-1">
        {TOOLBAR.map(([l, pre, post]) => (
          <button key={l} type="button" onClick={() => wrap(pre, post)} className="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-bold text-ink hover:bg-white">{l}</button>
        ))}
        <button type="button" onClick={() => setSplit((s) => !s)} className="ml-auto flex cursor-pointer items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-royal-700 hover:bg-white">
          <Columns2 className="size-3.5" /> {split ? 'Editor only' : 'Live preview'}
        </button>
      </div>
      <div className={cn('mt-2 grid gap-4', split && 'lg:grid-cols-2')}>
        <Textarea id="blog-md" value={b.content} onChange={(e) => set('content', e.target.value)} className="min-h-[420px] font-mono text-[13px]" />
        {split && <div className="max-h-[420px] overflow-y-auto rounded-xl border border-line p-4 scrollbar-thin"><Markdown>{b.content ?? ''}</Markdown></div>}
      </div>

      <Field label="Related events" className="mt-4">
        <Select
          value=""
          onChange={(e) => e.target.value && set('relatedEventIds', [...new Set([...(b.relatedEventIds ?? []), e.target.value])])}
        >
          <option value="">Link an event…</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </Select>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(b.relatedEventIds ?? []).map((id) => (
            <button key={id} type="button" onClick={() => set('relatedEventIds', (b.relatedEventIds ?? []).filter((x) => x !== id))} className="cursor-pointer rounded-full bg-royal-50 px-2.5 py-1 text-xs font-semibold text-royal-700">
              {events.find((e) => e.id === id)?.title ?? id} ×
            </button>
          ))}
        </div>
      </Field>

      {err && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onDone}>Cancel</Button>
        <Button variant="outline" onClick={() => submit('draft')} disabled={save.isPending}>Save draft</Button>
        <Button onClick={() => submit('published')} disabled={save.isPending}>Publish</Button>
      </div>
    </div>
  );
}

export function BlogsAdmin({ editId }: { editId?: string | null }) {
  const { data: blogs, isLoading } = useBlogs(true);
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const del = useMutate((ds, id: string) => ds.deleteBlog(id));

  useEffect(() => {
    if (editId && blogs) {
      const b = blogs.find((x) => x.id === editId);
      if (b) setEditing(b);
    }
  }, [editId, blogs]);

  if (editing) return <BlogEditor key={editing.id ?? 'new'} initial={editing} onDone={() => setEditing(null)} />;
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing(blank())}><Plus /> New story</Button>
      </div>
      {isLoading ? (
        <Spinner />
      ) : !blogs?.length ? (
        <EmptyState title="No stories yet" />
      ) : (
        <div className="divide-y divide-line rounded-2xl border border-line bg-white">
          {blogs.map((b) => (
            <div key={b.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{b.title}</p>
                <p className="truncate text-sm text-muted">{b.excerpt}</p>
              </div>
              <Badge className={b.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>{b.status}</Badge>
              <Button size="icon-sm" variant="ghost" onClick={() => setEditing(b)} title="Edit"><Pencil /></Button>
              <Button size="icon-sm" variant="ghost" className="text-red-600" onClick={() => window.confirm(`Delete “${b.title}”?`) && del.mutate(b.id)} title="Delete">
                <Trash2 />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
