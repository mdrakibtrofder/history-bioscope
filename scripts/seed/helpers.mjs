// Helpers for authoring seed data compactly.
// Every event is converted to the canonical JSON shape stored in data/seed/events.json.

let CTX = { timeline: 'world', region: 'Global', civilization: 'World' };

export function context(ctx) {
  CTX = { ...CTX, ...ctx };
}

/** Location helper */
export function L(name, lat, lng, country, region, historicalTerritory) {
  return { name, lat, lng, country, region: region || '', historicalTerritory: historicalTerritory || '' };
}

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

/**
 * E(id, title, era, category, startYear, endYear, dateLabel, wikiTitle, locations, summary, description, significance, entities, related, extra)
 * entities: ['person:Name', 'place:Name', 'empire:Name', 'battle:Name', 'religion:Name']
 */
export function E(
  id,
  title,
  era,
  category,
  startYear,
  endYear,
  dateLabel,
  wikiTitle,
  locations,
  summary,
  description,
  significance,
  entities = [],
  related = [],
  extra = {},
) {
  const now = '2026-10-08T00:00:00.000Z';
  return {
    id,
    slug: slugify(title),
    title,
    timeline: CTX.timeline,
    era,
    category,
    region: extra.region || CTX.region,
    civilization: extra.civilization || CTX.civilization,
    startYear,
    endYear: endYear ?? null,
    dateLabel,
    approximate: extra.approximate ?? false,
    summary,
    description,
    significance,
    locations,
    images: extra.images || [],
    videos: extra.videos || [],
    wikiTitle: wikiTitle || null,
    noImage: extra.noImage ?? CTX.noImage ?? false,
    references: [
      ...(wikiTitle
        ? [{ title: `Wikipedia – ${wikiTitle.replace(/_/g, ' ')}`, url: `https://en.wikipedia.org/wiki/${wikiTitle}` }]
        : []),
      ...(extra.references || []),
    ],
    relatedEventIds: related,
    entities: entities.map((e) => {
      const i = e.indexOf(':');
      return { type: e.slice(0, i), name: e.slice(i + 1) };
    }),
    tags: extra.tags || [],
    featured: extra.featured ?? false,
    status: 'published',
    createdAt: now,
    updatedAt: now,
  };
}
