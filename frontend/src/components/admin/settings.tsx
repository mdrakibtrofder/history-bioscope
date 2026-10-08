'use client';
import { useQueryClient } from '@tanstack/react-query';
import { Database, ExternalLink, HardDrive, RotateCcw, Server } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from '@/lib/data';
import { useDS } from '@/lib/hooks';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function Settings() {
  const pref = useApp((s) => s.preferredMode);
  const setPref = useApp((s) => s.setPreferredMode);
  const mode = useApp((s) => s.dataMode);
  const ds = useDS();
  const qc = useQueryClient();
  const [msg, setMsg] = useState('');

  const reset = async () => {
    if (!ds || !window.confirm('Reset ALL content to the original seed data? Your edits will be lost.')) return;
    await ds.reset();
    await qc.invalidateQueries();
    setMsg('Data reset to the original seed.');
  };

  const opts = [
    { id: 'auto', icon: Database, t: 'Automatic', d: 'Use the NestJS API when it is running, otherwise browser storage.' },
    { id: 'api', icon: Server, t: 'NestJS API', d: `Server storage (JSON files today; MongoDB / PostgreSQL / S3 later). ${API_URL}` },
    { id: 'local', icon: HardDrive, t: 'Browser LocalStorage', d: 'Everything stays in this browser. Works without any server.' },
  ] as const;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold">Storage provider</h3>
        <p className="mt-1 text-sm text-muted">
          Currently active: <b className={mode === 'api' ? 'text-emerald-700' : 'text-amber-700'}>{mode === 'api' ? 'NestJS API' : mode === 'local' ? 'Browser LocalStorage' : 'detecting…'}</b>
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => setPref(o.id)}
              className={cn('cursor-pointer rounded-2xl border p-4 text-left transition', pref === o.id ? 'border-royal-400 bg-royal-50 ring-4 ring-royal-100' : 'border-line hover:border-royal-200')}
            >
              <o.icon className="size-5 text-royal-600" />
              <p className="mt-2 font-semibold">{o.t}</p>
              <p className="mt-1 text-xs text-muted">{o.d}</p>
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="font-display text-xl font-semibold">API</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <a href={API_URL.replace(/\/api$/, '') + '/api/docs'} target="_blank" rel="noreferrer"><ExternalLink /> Swagger documentation</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`${API_URL}/health`} target="_blank" rel="noreferrer"><Server /> Health check</a>
          </Button>
        </div>
      </Card>
      <Card className="border-red-100 p-6">
        <h3 className="font-display text-xl font-semibold text-red-700">Danger zone</h3>
        <p className="mt-1 text-sm text-muted">Restore every event, story, location and route to the bundled seed data for the active provider.</p>
        <Button variant="destructive" className="mt-4" onClick={reset}><RotateCcw /> Reset to seed data</Button>
        {msg && <p className="mt-3 text-sm text-emerald-700">{msg}</p>}
      </Card>
    </div>
  );
}
