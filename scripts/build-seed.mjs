// Generates data/seed/*.json from the authoring sources in scripts/seed.
// Usage: node scripts/build-seed.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bangladeshEvents, bangladeshEras } from './seed/bangladesh.mjs';
import { islamicEvents, islamicEras } from './seed/islamic.mjs';
import { worldEvents, worldEras } from './seed/world.mjs';
import { routes, territories } from './seed/map.mjs';
import { blogs } from './seed/blogs.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, 'data/seed');
mkdirSync(out, { recursive: true });

const events = [...bangladeshEvents, ...islamicEvents, ...worldEvents];

// Validate ids and relations
const ids = new Set();
for (const e of events) {
  if (ids.has(e.id)) throw new Error(`Duplicate id ${e.id}`);
  ids.add(e.id);
}
let broken = 0;
for (const e of events) {
  e.relatedEventIds = e.relatedEventIds.filter((r) => {
    if (!ids.has(r)) {
      console.warn(`  ! ${e.id} → unknown related id ${r}`);
      broken++;
      return false;
    }
    return true;
  });
}
for (const r of routes) r.relatedEventIds = r.relatedEventIds.filter((id) => ids.has(id));
for (const b of blogs) b.relatedEventIds = b.relatedEventIds.filter((id) => ids.has(id));

// Make relations symmetric
const byId = Object.fromEntries(events.map((e) => [e.id, e]));
for (const e of events) for (const r of e.relatedEventIds) if (!byId[r].relatedEventIds.includes(e.id)) byId[r].relatedEventIds.push(e.id);

// Locations collection derived from events (unique by name+coords)
const locMap = new Map();
for (const e of events) {
  for (const l of e.locations) {
    const key = `${l.name}|${l.lat.toFixed(2)}|${l.lng.toFixed(2)}`;
    if (!locMap.has(key)) {
      locMap.set(key, { id: `loc-${locMap.size + 1}`, ...l, eventIds: [] });
    }
    locMap.get(key).eventIds.push(e.id);
  }
}
const locations = [...locMap.values()];

const timelines = [
  { id: 'bangladesh', name: 'Bangladesh History', nameBn: 'বাংলাদেশের ইতিহাস', color: '#1d4ed8', description: 'From ancient Pundranagara and the Pala Empire to the Liberation War and modern Bangladesh.', eras: bangladeshEras },
  { id: 'islamic', name: 'Islamic History', nameBn: 'ইসলামের ইতিহাস', color: '#0f766e', description: 'The 25 Prophets named in the Quran, the Seerah, the caliphates, the Golden Age and the modern Muslim world.', eras: islamicEras },
  { id: 'world', name: 'World History', nameBn: 'বিশ্ব ইতিহাস', color: '#7c3aed', description: 'Ancient civilisations, medieval empires, two world wars, the Cold War and the AI revolution.', eras: worldEras },
];

const write = (name, data) => {
  writeFileSync(resolve(out, `${name}.json`), JSON.stringify(data, null, 2));
  console.log(`  ✓ ${name}.json (${Array.isArray(data) ? data.length : Object.keys(data).length})`);
};

console.log('Building seed data…');
write('timelines', timelines);
write('events', events);
write('locations', locations);
write('routes', routes);
write('territories', territories);
write('blogs', blogs);
write('media', []);
console.log(`Done. ${events.length} events, ${broken} broken relations removed.`);
