'use client';
import { Info } from 'lucide-react';
import { useApp } from '@/lib/store';

export function ModeBanner() {
  const mode = useApp((s) => s.dataMode);
  const pref = useApp((s) => s.preferredMode);
  if (mode !== 'local' || pref === 'local') return null;
  return (
    <div className="border-b border-amber-200 bg-amber-50 text-amber-900">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs sm:px-6 lg:px-8">
        <Info className="size-4 shrink-0" />
        <span>
          The API server is offline, so the site is running in <b>browser storage mode</b> with the bundled data. Edits are saved in this browser only.
          Start the backend (<code className="rounded bg-amber-100 px-1">npm run dev</code> in the project folder) to use the full NestJS API.
        </span>
      </div>
    </div>
  );
}
