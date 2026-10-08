'use client';
import '@xyflow/react/dist/style.css';
import {
  Background, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps, useReactFlow, ReactFlowProvider,
} from '@xyflow/react';
import { forceCenter, forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from 'd3-force';
import { ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from 'react';
import { useEvents, useGraph, useTimelines } from '@/lib/hooks';
import type { GraphNode } from '@/lib/types';
import { ENTITY_META, TIMELINE_META, cn, formatYear } from '@/lib/utils';
import { Select } from '../ui/input';
import { Spinner } from '../ui/misc';

type NData = GraphNode & { dim: boolean; focus: boolean; [key: string]: unknown };

const GraphNodeView = memo(function GraphNodeView({ data }: NodeProps<Node<NData>>) {
  const meta = ENTITY_META[data.type];
  const isEvent = data.type === 'event';
  const size = isEvent ? 12 : Math.min(10 + data.degree * 1.5, 30);
  return (
    <div className={cn('flex flex-col items-center transition-opacity', data.dim && 'opacity-15')}>
      <Handle type="target" position={Position.Top} className="!pointer-events-none !opacity-0" />
      <div
        className={cn('rounded-full border-2 border-white shadow-md', data.focus && 'ring-4 ring-royal-300')}
        style={{ width: size, height: size, background: isEvent ? TIMELINE_META[(data.timeline as 'world') ?? 'world']?.color ?? meta.color : meta.color }}
      />
      <div
        className={cn(
          'mt-1 max-w-[150px] truncate rounded-md px-1.5 py-0.5 text-center text-[10px] font-semibold leading-tight shadow-sm',
          isEvent ? 'bg-white text-ink' : '',
        )}
        style={!isEvent ? { background: meta.bg, color: meta.color } : undefined}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} className="!pointer-events-none !opacity-0" />
    </div>
  );
});
const nodeTypes = { g: GraphNodeView };

interface SimNode extends SimulationNodeDatum {
  id: string;
}

function GraphInner() {
  const params = useSearchParams();
  const initialFocus = params.get('focus');
  const { data: timelines } = useTimelines();
  const { data: allEvents = [] } = useEvents();
  const focusEvent = initialFocus && !initialFocus.includes(':') ? allEvents.find((e) => e.id === initialFocus) : undefined;

  const [timeline, setTimeline] = useState<string>('bangladesh');
  const [era, setEra] = useState<string>('');
  const [types, setTypes] = useState<Set<string>>(new Set(['event', 'person', 'place', 'empire', 'battle', 'religion']));
  const [minDegree, setMinDegree] = useState(2);
  const [focus, setFocus] = useState<string | null>(initialFocus);
  const [q, setQ] = useState('');

  useEffect(() => {
    if (focusEvent) setTimeline(focusEvent.timeline);
  }, [focusEvent]);
  useEffect(() => {
    if (initialFocus?.includes(':')) setTimeline('all');
  }, [initialFocus]);

  const { data, isLoading } = useGraph(timeline === 'all' ? undefined : timeline, era || undefined);
  const flow = useReactFlow();

  const { nodes, edges } = useMemo(() => {
    if (!data) return { nodes: [] as Node<NData>[], edges: [] as Edge[] };
    const keep = new Set(
      data.nodes.filter((n) => types.has(n.type) && (n.type === 'event' || n.degree >= minDegree || n.id === focus)).map((n) => n.id),
    );
    const es = data.edges.filter((e) => keep.has(e.source) && keep.has(e.target));
    const connected = new Set(es.flatMap((e) => [e.source, e.target]));
    const ns = data.nodes.filter((n) => keep.has(n.id) && (connected.has(n.id) || n.id === focus));

    // force-directed layout with d3-force
    const sim: SimNode[] = ns.map((n) => ({ id: n.id }));
    const index = new Map(sim.map((s) => [s.id, s]));
    const links = es.map((e) => ({ source: index.get(e.source)!, target: index.get(e.target)! }));
    forceSimulation(sim)
      .force('charge', forceManyBody().strength(-220))
      .force('link', forceLink(links).distance(70).strength(0.6))
      .force('collide', forceCollide(42))
      .force('center', forceCenter(0, 0))
      .force('x', forceX(0).strength(0.07))
      .force('y', forceY(0).strength(0.07))
      .stop()
      .tick(260);

    const neighbors = new Set<string>();
    if (focus) for (const e of es) if (e.source === focus || e.target === focus) neighbors.add(e.source === focus ? e.target : e.source);
    const needle = q.trim().toLowerCase();

    const nodes: Node<NData>[] = ns.map((n) => {
      const s = index.get(n.id)!;
      const match = needle ? n.label.toLowerCase().includes(needle) : true;
      const dim = (!!focus && n.id !== focus && !neighbors.has(n.id)) || !match;
      return { id: n.id, type: 'g', position: { x: s.x ?? 0, y: s.y ?? 0 }, data: { ...n, dim, focus: n.id === focus } };
    });
    const edges: Edge[] = es.map((e) => {
      const active = focus && (e.source === focus || e.target === focus);
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'straight',
        style: {
          stroke: e.kind === 'related' ? '#3557ef' : '#94a3b8',
          strokeWidth: active ? 2 : 1,
          opacity: focus ? (active ? 0.9 : 0.06) : e.kind === 'related' ? 0.5 : 0.3,
          strokeDasharray: e.kind === 'related' ? '4 3' : undefined,
        },
      };
    });
    return { nodes, edges };
  }, [data, types, minDegree, focus, q]);

  useEffect(() => {
    if (!focus || !nodes.length) return;
    const n = nodes.find((x) => x.id === focus);
    if (n) setTimeout(() => flow.setCenter(n.position.x, n.position.y, { zoom: 1.2, duration: 800 }), 50);
  }, [focus, nodes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const focusNode = data?.nodes.find((n) => n.id === focus);
  const focusLinks = useMemo(() => {
    if (!data || !focus) return [];
    return data.edges
      .filter((e) => e.source === focus || e.target === focus)
      .map((e) => data.nodes.find((n) => n.id === (e.source === focus ? e.target : e.source))!)
      .filter(Boolean)
      .sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  }, [data, focus]);

  const eras = timelines?.find((t) => t.id === timeline)?.eras ?? [];

  return (
    <div className="relative h-[calc(100vh-4rem)] min-h-[560px]">
      {isLoading ? (
        <Spinner label="Building knowledge graph…" />
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.05 }}
          minZoom={0.1}
          maxZoom={3}
          nodesConnectable={false}
          onNodeClick={(_, n) => setFocus(n.id === focus ? null : n.id)}
          onPaneClick={() => setFocus(null)}
          proOptions={{ hideAttribution: false }}
        >
          <Background color="#c7d7ff" gap={28} />
          <Controls position="bottom-left" showInteractive={false} />
          <MiniMap position="bottom-right" pannable zoomable nodeColor={(n) => ENTITY_META[(n.data as NData).type]?.color ?? '#1f3be0'} className="!hidden md:!block" />
        </ReactFlow>
      )}

      <div className="glass-strong absolute left-3 top-3 z-10 w-[min(330px,calc(100vw-1.5rem))] space-y-3 rounded-3xl p-4">
        <p className="font-display text-lg font-semibold">Knowledge Graph</p>
        <div className="grid grid-cols-2 gap-2">
          <Select value={timeline} onChange={(e) => (setTimeline(e.target.value), setEra(''))}>
            <option value="all">All timelines</option>
            <option value="bangladesh">Bangladesh</option>
            <option value="islamic">Islamic</option>
            <option value="world">World</option>
          </Select>
          <Select value={era} onChange={(e) => setEra(e.target.value)} disabled={timeline === 'all'}>
            <option value="">All eras</option>
            {eras.map((x) => <option key={x}>{x}</option>)}
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Highlight a name…" className="h-9 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm focus:border-royal-400 focus:outline-none" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(ENTITY_META).map(([k, m]) => {
            const on = types.has(k);
            return (
              <button
                key={k}
                onClick={() =>
                  setTypes((s) => {
                    const n = new Set(s);
                    n.has(k) ? n.delete(k) : n.add(k);
                    return n;
                  })
                }
                className={cn('flex cursor-pointer items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition', on ? '' : 'opacity-40')}
                style={{ background: m.bg, color: m.color, borderColor: m.color }}
              >
                <span className="size-2 rounded-full" style={{ background: m.color }} /> {m.label}
              </button>
            );
          })}
        </div>
        <label className="block text-xs text-muted">
          Hide entities with fewer than <b className="text-ink">{minDegree}</b> connection{minDegree > 1 ? 's' : ''}
          <input type="range" min={1} max={6} value={minDegree} onChange={(e) => setMinDegree(+e.target.value)} className="mt-1 w-full accent-royal-600" />
        </label>
        <p className="text-xs text-muted">
          {nodes.length} nodes · {edges.length} links. Click a node to see its connections. Dashed blue lines link related events.
        </p>
      </div>

      {focusNode && (
        <div className="glass-strong absolute right-3 top-3 z-10 max-h-[calc(100%-1.5rem)] w-[min(320px,calc(100vw-1.5rem))] overflow-y-auto rounded-3xl p-4 scrollbar-thin">
          <button onClick={() => setFocus(null)} className="absolute right-3 top-3 cursor-pointer rounded-full p-1 hover:bg-royal-50" aria-label="Close"><X className="size-4" /></button>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ background: ENTITY_META[focusNode.type].bg, color: ENTITY_META[focusNode.type].color }}>
            {ENTITY_META[focusNode.type].label}
          </span>
          <h3 className="mt-2 pr-6 font-display text-xl font-semibold">{focusNode.label}</h3>
          {focusNode.type === 'event' && (
            <Link href={`/events/${focusNode.id}`} className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-royal-600">
              Open event <ArrowRight className="size-3.5" />
            </Link>
          )}
          <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">{focusLinks.length} connections</p>
          <ul className="mt-2 space-y-1">
            {focusLinks.map((n) => (
              <li key={n.id}>
                <button onClick={() => setFocus(n.id)} className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-royal-50">
                  <span className="size-2 shrink-0 rounded-full" style={{ background: ENTITY_META[n.type].color }} />
                  <span className="flex-1 truncate">{n.label}</span>
                  {n.year !== undefined && <span className="text-xs text-muted">{formatYear(n.year)}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function KnowledgeGraph() {
  return (
    <ReactFlowProvider>
      <GraphInner />
    </ReactFlowProvider>
  );
}
