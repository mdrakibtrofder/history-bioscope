/**
 * Base-map definitions. Every provider here is FREE and needs NO API KEY.
 * Each layer has a chain of keyless fallbacks: if the primary tile server
 * fails (blocked, rate-limited, offline), <SmartTileLayer> switches to the next one.
 */
export interface TileSource {
  url: string;
  attribution: string;
  subdomains?: string;
  maxZoom?: number;
}

export interface BaseLayerDef extends TileSource {
  id: string;
  name: string;
  className?: string;
  fallbacks?: TileSource[];
}

const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const OSM: TileSource = {
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: OSM_ATTR,
  maxZoom: 19,
};
const CARTO_VOYAGER: TileSource = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  attribution: `${OSM_ATTR} &copy; <a href="https://carto.com/attributions">CARTO</a>`,
  subdomains: 'abcd',
  maxZoom: 19,
};
const ESRI_STREET: TileSource = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
  attribution: 'Tiles &copy; Esri',
  maxZoom: 19,
};

export const BASE_LAYERS: BaseLayerDef[] = [
  {
    id: 'political',
    name: 'Political',
    ...CARTO_VOYAGER,
    fallbacks: [OSM, ESRI_STREET],
  },
  {
    id: 'satellite',
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Imagery &copy; Esri, Maxar, Earthstar Geographics',
    maxZoom: 19,
    fallbacks: [
      {
        // Sentinel-2 cloudless by EOX — free, no key
        url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg',
        attribution: 'Sentinel-2 cloudless &copy; <a href="https://s2maps.eu">EOX IT Services GmbH</a> (Copernicus Sentinel data 2020)',
        maxZoom: 15,
      },
    ],
  },
  {
    id: 'terrain',
    name: 'Terrain',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri — Esri, HERE, Garmin, USGS, NGA',
    maxZoom: 19,
    fallbacks: [
      {
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: `${OSM_ATTR}, SRTM | &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)`,
        subdomains: 'abc',
        maxZoom: 17,
      },
      {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}',
        attribution: 'Tiles &copy; Esri — US National Park Service',
        maxZoom: 8,
      },
    ],
  },
  {
    id: 'historical',
    name: 'Historical (parchment)',
    ...OSM,
    className: 'tiles-historical',
    fallbacks: [CARTO_VOYAGER, ESRI_STREET],
  },
];

export const LABELS_OVERLAY: BaseLayerDef = {
  id: 'labels',
  name: 'Place labels',
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
  attribution: '&copy; Esri',
  fallbacks: [
    {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO',
      subdomains: 'abcd',
    },
  ],
};
