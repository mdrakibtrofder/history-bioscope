'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Tooltip, useMap } from 'react-leaflet';
import type { GeoLocation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { SmartTileLayer } from './smart-tile-layer';
import { BASE_LAYERS, LABELS_OVERLAY } from './tiles';

function Fit({ locations, flyZoom }: { locations: GeoLocation[]; flyZoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (!locations.length) return;
    if (locations.length === 1 || flyZoom) {
      const l = locations[0];
      map.flyTo([l.lat, l.lng], flyZoom ?? 6, { duration: 1.6 });
    } else {
      map.flyToBounds(L.latLngBounds(locations.map((l) => [l.lat, l.lng] as [number, number])).pad(0.4), { duration: 1.4, maxZoom: 7 });
    }
  }, [map, locations, flyZoom]);
  return null;
}

export default function MiniMap({
  locations, color = '#1f3be0', className, initialLayer = 'political', flyZoom, interactive = true,
}: {
  locations: GeoLocation[];
  color?: string;
  className?: string;
  initialLayer?: 'political' | 'satellite' | 'terrain' | 'historical';
  flyZoom?: number;
  interactive?: boolean;
}) {
  const [layer, setLayer] = useState(initialLayer);
  const base = BASE_LAYERS.find((b) => b.id === layer)!;
  const center: [number, number] = locations[0] ? [locations[0].lat, locations[0].lng] : [23.7, 90.4];
  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-line', className)}>
      <MapContainer center={center} zoom={4} scrollWheelZoom={false} dragging={interactive} className="h-full w-full" worldCopyJump>
        <SmartTileLayer key={base.id} def={base} />
        {layer === 'satellite' && <SmartTileLayer def={LABELS_OVERLAY} />}
        {locations.map((l, i) => (
          <CircleMarker key={`${l.name}-${i}`} center={[l.lat, l.lng]} radius={8} pathOptions={{ color: 'white', weight: 2.5, fillColor: color, fillOpacity: 1 }}>
            <Tooltip direction="top" offset={[0, -6]}>{l.name}</Tooltip>
          </CircleMarker>
        ))}
        <Fit locations={locations} flyZoom={flyZoom} />
      </MapContainer>
      <div className="absolute right-2 top-2 z-[400] flex gap-1 rounded-xl bg-white/90 p-1 text-[11px] font-semibold shadow backdrop-blur">
        {(['political', 'satellite', 'terrain', 'historical'] as const).map((id) => (
          <button
            key={id}
            onClick={() => setLayer(id)}
            className={cn('cursor-pointer rounded-lg px-2 py-1 capitalize', layer === id ? 'bg-royal-600 text-white' : 'text-muted hover:bg-royal-50')}
          >
            {id}
          </button>
        ))}
      </div>
    </div>
  );
}
