'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { EmptyState, PageHeader, Spinner } from '@/components/ui/misc';
import { useBlogs } from '@/lib/hooks';
import type { Blog } from '@/lib/types';
import { TIMELINE_META, cn } from '@/lib/utils';
import { useWikiSummary } from '@/lib/wiki';

export function StoryCover({ blog, className }: { blog: Blog; className?: string }) {
  const wiki = useWikiSummary(blog.wikiTitle, !blog.coverImage);
  const src = blog.coverImage || wiki.data?.thumbnail;
  return (
    <div className={cn('overflow-hidden bg-gradient-to-br from-royal-100 to-sky2-100', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt={blog.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
    </div>
  );
}

export function StoriesList() {
  const { data: blogs, isLoading } = useBlogs();
  const [tl, setTl] = useState('');
  const list = (blogs ?? []).filter((b) => !tl || b.timeline === tl);
  return (
    <div>
      <PageHeader eyebrow="Stories & blogs" title="Stories from the past">
        Long-form articles, educational notes and research write-ups connected to the timeline.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {['', 'bangladesh', 'islamic', 'world'].map((t) => (
            <button
              key={t}
              onClick={() => setTl(t)}
              className={cn('cursor-pointer rounded-full px-4 py-1.5 text-sm font-semibold', tl === t ? 'bg-royal-600 text-white' : 'bg-white text-muted ring-1 ring-line')}
            >
              {t ? TIMELINE_META[t as 'world'].short : 'All'}
            </button>
          ))}
        </div>
        {isLoading ? (
          <Spinner />
        ) : list.length === 0 ? (
          <EmptyState title="No stories yet">Write one in the admin dashboard.</EmptyState>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/stories/${b.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <StoryCover blog={b} className="aspect-[16/9]" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex flex-wrap gap-1.5">
                      {b.timeline in TIMELINE_META && <Badge color={TIMELINE_META[b.timeline as 'world'].color}>{TIMELINE_META[b.timeline as 'world'].short}</Badge>}
                      {b.tags.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold group-hover:text-royal-700">{b.title}</h2>
                    <p className="mt-2 text-sm text-muted">{b.excerpt}</p>
                    <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-semibold text-royal-600">Read story <ArrowRight className="size-4" /></span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
