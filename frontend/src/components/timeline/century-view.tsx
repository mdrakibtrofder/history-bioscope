'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HistoricalEvent } from '@/lib/types';
import { TIMELINE_META, centuryLabel, centuryOf, cn } from '@/lib/utils';

/** Century overview: distribution chart + one tile per century. */
export function CenturyView({ events }: { events: HistoricalEvent[] }) {
  const [active, setActive] = useState<number | null>(null);
  const groups = useMemo(() => {
    const m = new Map<number, HistoricalEvent[]>();
    for (const e of events) {
      const c = centuryOf(e.startYear);
      m.set(c, [...(m.get(c) ?? []), e]);
    }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [events]);

  const chart = groups.map(([c, list]) => ({
    c,
    name: `${Math.abs(c)}${c < 0 ? ' BCE' : ''}`,
    count: list.length,
  }));

  return (
    <div>
      <div className="mb-8 rounded-3xl border border-line bg-white p-4 shadow-sm">
        <p className="mb-2 px-2 text-sm font-semibold text-ink">Events per century <span className="font-normal text-muted">(click a bar)</span></p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chart} onClick={(s: any) => s?.activePayload && setActive(s.activePayload[0].payload.c)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5ecfb" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#5b6785' }} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#5b6785' }} width={28} />
              <Tooltip cursor={{ fill: '#eef3ff' }} formatter={(v) => [v, 'Events']} labelFormatter={(l) => `Century: ${l}`} contentStyle={{ borderRadius: 12, border: '1px solid #dfe7f7' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} className="cursor-pointer">
                {chart.map((d) => (
                  <Cell key={d.c} fill={active === d.c ? '#1a2fc0' : d.c < 0 ? '#38bdf8' : '#3557ef'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {groups.map(([c, list], i) => (
          <motion.div
            key={c}
            id={`century-${c}`}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 8) * 0.03 }}
            className={cn(
              'rounded-3xl border bg-white p-5 shadow-sm transition',
              active === c ? 'border-royal-400 ring-4 ring-royal-100' : 'border-line hover:border-royal-200',
            )}
            onMouseEnter={() => setActive(c)}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-display text-lg font-semibold">{centuryLabel(c)}</h3>
              <span className="rounded-full bg-royal-50 px-2 py-0.5 text-xs font-bold text-royal-700">{list.length}</span>
            </div>
            <div className="mt-1 flex h-1.5 overflow-hidden rounded-full bg-royal-50">
              {(['bangladesh', 'islamic', 'world'] as const).map((t) => {
                const n = list.filter((e) => e.timeline === t).length;
                return n ? <span key={t} style={{ width: `${(n / list.length) * 100}%`, background: TIMELINE_META[t].color }} /> : null;
              })}
            </div>
            <ul className="mt-3 space-y-1.5">
              {list.slice(0, 6).map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.id}`} className="group flex gap-2 text-sm">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full" style={{ background: TIMELINE_META[e.timeline].color }} />
                    <span className="text-ink/85 group-hover:text-royal-700">
                      <span className="font-semibold text-muted">{e.startYear < 0 ? `${-e.startYear} BCE` : e.startYear}</span> · {e.title}
                    </span>
                  </Link>
                </li>
              ))}
              {list.length > 6 && <li className="pl-3.5 text-xs text-muted">+ {list.length - 6} more</li>}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
