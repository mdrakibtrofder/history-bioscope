'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/misc';

const KnowledgeGraph = dynamic(() => import('@/components/graph/knowledge-graph'), { ssr: false, loading: () => <Spinner label="Loading graph…" /> });

export default function GraphPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <KnowledgeGraph />
    </Suspense>
  );
}
