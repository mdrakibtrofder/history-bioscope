'use client';
import 'leaflet/dist/leaflet.css';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, useMap, useMapEvents } from 'react-leaflet';
import { SmartTileLayer } from './smart-tile-layer';
import { BASE_LAYERS, LABELS_OVERLAY } from './tiles';

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (e) => onPick(+e.latlng.lat.toFixed(4), +e.latlng.lng.toFixed(4)) });
  return null;
}
function Recenter({ lat, lng }: { lat?: number; lng?: number }) {
  const map = useMap();
  useEffect(() => {
    if (lat !== undefined && lng !== undefined && !Number.isNaN(lat)) map.setView([lat, lng], Math.max(map.getZoom(), 5));
  }, [lat, lng, map]);
  return null;
}

/** Map-based coordinate picker with place search (OpenStreetMap Nominatim). */
export default function LocationPicker({
  lat, lng, onPick,
}: {
  lat?: number;
  lng?: number;
  onPick: (lat: number, lng: number, name?: string, country?: string) => void;
}) {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ display_name: string; lat: string; lon: string; address?: { country?: string } }[]>([]);
  const [busy, setBusy] = useState(false);
  const [satellite, setSatellite] = useState(false);
  const base = BASE_LAYERS.find((b) => b.id === (satellite ? 'satellite' : 'political'))!;

  /** Keyless geocoding: OpenStreetMap Nominatim, falling back to Photon (Komoot). */
  const search = async () => {
    if (!q.trim()) return;
    setBusy(true);
    try {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`);
        if (!r.ok) throw new Error(String(r.status));
        const data = await r.json();
        if (!Array.isArray(data)) throw new Error('bad response');
        setResults(data);
      } catch {
        const r = await fetch(`https://photon.komoot.io/api/?limit=5&q=${encodeURIComponent(q)}`);
        const data = await r.json();
        setResults(
          (data.features ?? []).map((f: { geometry: { coordinates: [number, number] }; properties: Record<string, string | undefined> }) => {
            const p = f.properties;
            return {
              display_name: [p.name, p.city, p.state, p.country].filter(Boolean).join(', '),
              lat: String(f.geometry.coordinates[1]),
              lon: String(f.geometry.coordinates[0]),
              address: { country: p.country },
            };
          }),
        );
      }
    } catch {
      setResults([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              search();
            }
          }}
          placeholder="Search a place (e.g. Mahasthangarh)…"
          className="h-9 flex-1 rounded-xl border border-line px-3 text-sm focus:border-royal-400 focus:outline-none"
        />
        <button type="button" onClick={search} className="flex h-9 cursor-pointer items-center gap-1 rounded-xl bg-royal-600 px-3 text-xs font-semibold text-white">
          <Search className="size-3.5" /> {busy ? '…' : 'Find'}
        </button>
        <button type="button" onClick={() => setSatellite((s) => !s)} className="h-9 cursor-pointer rounded-xl border border-line px-3 text-xs font-semibold">
          {satellite ? 'Map' : 'Satellite'}
        </button>
      </div>
      {results.length > 0 && (
        <div className="max-h-36 overflow-y-auto rounded-xl border border-line text-xs">
          {results.map((r) => (
            <button
              type="button"
              key={`${r.lat}${r.lon}`}
              onClick={() => {
                onPick(+(+r.lat).toFixed(4), +(+r.lon).toFixed(4), r.display_name.split(',')[0], r.address?.country);
                setResults([]);
              }}
              className="block w-full cursor-pointer truncate px-3 py-2 text-left hover:bg-royal-50"
            >
              {r.display_name}
            </button>
          ))}
        </div>
      )}
      <div className="h-64 overflow-hidden rounded-xl border border-line">
        <MapContainer center={[lat ?? 23.7, lng ?? 90.4]} zoom={lat !== undefined ? 5 : 3} className="h-full w-full cursor-crosshair">
          <SmartTileLayer key={base.id} def={base} />
          {satellite && <SmartTileLayer def={LABELS_OVERLAY} />}
          <ClickHandler onPick={(a, b) => onPick(a, b)} />
          <Recenter lat={lat} lng={lng} />
          {lat !== undefined && lng !== undefined && !Number.isNaN(lat) && (
            <CircleMarker center={[lat, lng]} radius={9} pathOptions={{ color: 'white', weight: 3, fillColor: '#1f3be0', fillOpacity: 1 }} />
          )}
        </MapContainer>
      </div>
      <p className="text-xs text-muted">Click anywhere on the map to set the coordinates.</p>
    </div>
  );
}
