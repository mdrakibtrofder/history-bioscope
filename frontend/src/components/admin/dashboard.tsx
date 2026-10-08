'use client';
import { BookOpen, CalendarClock, FileEdit, Image as ImageIcon, MapPin } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useStats } from '@/lib/hooks';
import { CATEGORY_META, TIMELINE_META } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Spinner } from '../ui/misc';

export function Dashboard() {
  const { data: s } = useStats();
  if (!s) return <Spinner />;
  const tiles = [
    { label: 'Events', value: s.totalEvents, icon: CalendarClock, sub: `${s.published} published` },
    { label: 'Drafts', value: s.drafts, icon: FileEdit, sub: 'awaiting review' },
    { label: 'Stories', value: s.blogs, icon: BookOpen, sub: 'blogs & articles' },
    { label: 'Media files', value: s.media, icon: ImageIcon, sub: 'uploaded' },
    { label: 'Locations', value: s.locations, icon: MapPin, sub: 'mapped places' },
  ];
  const eraData = Object.entries(s.byEra).map(([k, v]) => {
    const [tl, era] = k.split('|');
    return { era, tl, count: v };
  });
  const catData = Object.entries(s.byCategory)
    .map(([k, v]) => ({ name: CATEGORY_META[k]?.label ?? k, key: k, value: v }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label} className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-muted">{t.label}</p>
              <t.icon className="size-5 text-royal-500" />
            </div>
            <p className="mt-2 font-display text-3xl font-semibold">{t.value}</p>
            <p className="text-xs text-muted">{t.sub}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Events per era</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eraData} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5ecfb" vertical={false} />
                <XAxis dataKey="era" angle={-40} textAnchor="end" interval={0} tick={{ fontSize: 10, fill: '#5b6785' }} />
                <YAxis allowDecimals={false} width={28} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {eraData.map((d) => <Cell key={d.tl + d.era} fill={TIMELINE_META[d.tl as 'world']?.color ?? '#3557ef'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>By category</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={catData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                  {catData.map((d) => <Cell key={d.key} fill={CATEGORY_META[d.key]?.color ?? '#94a3b8'} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
