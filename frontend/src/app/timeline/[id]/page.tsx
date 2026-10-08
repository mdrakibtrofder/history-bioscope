import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { TimelineExplorer } from '@/components/timeline/timeline-explorer';
import { Spinner } from '@/components/ui/misc';
import type { TimelineId } from '@/lib/types';

const IDS = ['bangladesh', 'islamic', 'world', 'all'];
const TITLES: Record<string, string> = { bangladesh: 'Bangladesh History', islamic: 'Islamic History', world: 'World History', all: 'All Timelines' };

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${TITLES[id] ?? 'Timeline'} Timeline` };
}

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!IDS.includes(id)) notFound();
  return (
    <Suspense fallback={<Spinner />}>
      <TimelineExplorer id={id as TimelineId | 'all'} />
    </Suspense>
  );
}
