'use client';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { EventCard } from '@/components/event/event-card';
import { Markdown } from '@/components/event/markdown';
import { Badge } from '@/components/ui/badge';
import { EmptyState, Spinner } from '@/components/ui/misc';
import { useBlog, useEvents } from '@/lib/hooks';
import { TIMELINE_META } from '@/lib/utils';
import { StoryCover } from '../stories-list';

export function StoryView({ slug }: { slug: string }) {
  const { data: b, isLoading } = useBlog(slug);
  const { data: events = [] } = useEvents();
  if (isLoading) return <Spinner />;
  if (!b) return <div className="mx-auto max-w-3xl px-4 py-20"><EmptyState title="Story not found" /></div>;
  const related = events.filter((e) => b.relatedEventIds.includes(e.id));
  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link href="/stories" className="flex items-center gap-1 text-sm font-semibold text-royal-600"><ArrowLeft className="size-4" /> All stories</Link>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {b.timeline in TIMELINE_META && <Badge color={TIMELINE_META[b.timeline as 'world'].color}>{TIMELINE_META[b.timeline as 'world'].label}</Badge>}
        {b.tags.map((t) => <Badge key={t}>{t}</Badge>)}
        {b.status === 'draft' && <Badge className="bg-amber-100 text-amber-800">Draft</Badge>}
      </div>
      <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{b.title}</h1>
      <p className="mt-3 text-lg text-muted">{b.excerpt}</p>
      <p className="mt-3 flex items-center gap-3 text-sm text-muted">
        By {b.author} · {new Date(b.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        <Link href={`/admin?blog=${b.id}`} className="flex items-center gap-1 font-semibold text-royal-600"><Pencil className="size-3.5" /> Edit</Link>
      </p>
      <StoryCover blog={b} className="mt-8 aspect-[21/9] rounded-3xl" />
      <Markdown className="prose-lg mt-10">{b.content}</Markdown>
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-2xl font-semibold">Events in this story</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        </div>
      )}
    </article>
  );
}
