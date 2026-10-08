import { Suspense } from 'react';
import { Spinner } from '@/components/ui/misc';
import { SearchView } from './search-view';

export const metadata = { title: 'Search' };
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <SearchView />
    </Suspense>
  );
}
