import { Suspense } from 'react';
import { MapExplorer } from '@/components/map';
import { Spinner } from '@/components/ui/misc';

export const metadata = { title: 'Historical Map Explorer' };

export default function MapPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <MapExplorer />
    </Suspense>
  );
}
