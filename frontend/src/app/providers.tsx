'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { apiAvailable } from '@/lib/data';
import { useApp } from '@/lib/store';

function DataModeResolver() {
  const preferred = useApp((s) => s.preferredMode);
  const setDataMode = useApp((s) => s.setDataMode);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (preferred === 'local') return setDataMode('local');
      const ok = await apiAvailable();
      if (cancelled) return;
      if (preferred === 'api' && !ok) console.warn('[History Bioscope] API not reachable – falling back to browser storage');
      setDataMode(ok ? 'api' : 'local');
    })();
    return () => {
      cancelled = true;
    };
  }, [preferred, setDataMode]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } } }),
  );
  return (
    <QueryClientProvider client={client}>
      <DataModeResolver />
      {children}
    </QueryClientProvider>
  );
}
