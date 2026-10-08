'use client';
import type L from 'leaflet';
import { useMemo, useRef } from 'react';
import { TileLayer } from 'react-leaflet';
import type { BaseLayerDef, TileSource } from './tiles';

/** Number of failed tiles (with no successful ones) before switching provider. */
const FAIL_THRESHOLD = 4;

/**
 * A keyless TileLayer with automatic provider fallback.
 * If the primary tile server keeps failing, it swaps the URL in place
 * (no remount, so it also works inside <LayersControl.BaseLayer>).
 */
export function SmartTileLayer({ def }: { def: BaseLayerDef }) {
  const ref = useRef<L.TileLayer | null>(null);
  const state = useRef({ idx: 0, errors: 0, loads: 0 });
  const sources = useMemo<TileSource[]>(() => [def, ...(def.fallbacks ?? [])], [def]);

  const handlers = useMemo(
    () => ({
      tileload() {
        state.current.loads++;
      },
      tileerror() {
        const s = state.current;
        s.errors++;
        if (s.errors < FAIL_THRESHOLD || s.loads > s.errors || s.idx >= sources.length - 1) return;
        const layer = ref.current;
        if (!layer) return;
        const prev = sources[s.idx];
        s.idx++;
        s.errors = 0;
        s.loads = 0;
        const next = sources[s.idx];
        const map = (layer as unknown as { _map?: L.Map })._map;
        map?.attributionControl?.removeAttribution(prev.attribution).addAttribution(next.attribution);
        layer.options.attribution = next.attribution;
        layer.options.subdomains = (next.subdomains ?? 'abc').split('');
        layer.options.maxZoom = next.maxZoom ?? 19;
        if (typeof console !== 'undefined') console.info(`[map] "${def.name}" tiles failed, switching to fallback #${s.idx}`);
        layer.setUrl(next.url);
      },
    }),
    [sources, def.name],
  );

  return (
    <TileLayer
      ref={ref}
      url={def.url}
      attribution={def.attribution}
      subdomains={def.subdomains ?? 'abc'}
      maxZoom={def.maxZoom ?? 19}
      className={def.className}
      eventHandlers={handlers}
    />
  );
}
