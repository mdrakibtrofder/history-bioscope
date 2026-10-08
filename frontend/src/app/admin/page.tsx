import { Suspense } from 'react';
import { AdminView } from '@/components/admin/admin-view';
import { Spinner } from '@/components/ui/misc';

export const metadata = { title: 'Admin Dashboard' };
export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <AdminView />
    </Suspense>
  );
}
