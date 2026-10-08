import { Injectable, NotFoundException } from '@nestjs/common';
import { newId, slugify } from '../../common/base.repository';
import { HistoricalEvent } from '../../common/types';
import { CreateEventDto, EventQueryDto, UpdateEventDto } from './dto/event.dto';
import { TimelineRepository } from './timeline.repository';

export const matchesText = (e: HistoricalEvent, q: string) => {
  const needle = q.toLowerCase().trim();
  if (!needle) return true;
  const hay = [
    e.title, e.summary, e.description, e.era, e.category, e.civilization, e.region, e.dateLabel, String(e.startYear),
    ...e.entities.map((x) => x.name), ...e.locations.map((l) => `${l.name} ${l.country ?? ''} ${l.historicalTerritory ?? ''}`), ...e.tags,
  ]
    .join(' ')
    .toLowerCase();
  return needle.split(/\s+/).every((w) => hay.includes(w));
};

@Injectable()
export class EventsService {
  constructor(private readonly repo: TimelineRepository) {}

  async findAll(q: EventQueryDto = {}): Promise<HistoricalEvent[]> {
    const all = await this.repo.findAll();
    return all
      .filter((e) => q.includeDrafts || e.status === 'published')
      .filter((e) => !q.timeline || q.timeline === 'all' || e.timeline === q.timeline)
      .filter((e) => !q.era || e.era === q.era)
      .filter((e) => !q.category || e.category === q.category)
      .filter((e) => !q.region || e.region === q.region)
      .filter((e) => !q.civilization || e.civilization === q.civilization)
      .filter((e) => !q.featured || e.featured)
      .filter((e) => q.from === undefined || (e.endYear ?? e.startYear) >= q.from)
      .filter((e) => q.to === undefined || e.startYear <= q.to)
      .filter((e) => !q.q || matchesText(e, q.q))
      .sort((a, b) => a.startYear - b.startYear);
  }

  async findOne(idOrSlug: string): Promise<HistoricalEvent> {
    const byId = await this.repo.findById(idOrSlug);
    if (byId) return byId;
    const all = await this.repo.findAll();
    const bySlug = all.find((e) => e.slug === idOrSlug);
    if (!bySlug) throw new NotFoundException(`Event ${idOrSlug} not found`);
    return bySlug;
  }

  async create(dto: CreateEventDto): Promise<HistoricalEvent> {
    const now = new Date().toISOString();
    const event: HistoricalEvent = {
      id: newId(dto.timeline.slice(0, 2)),
      slug: slugify(dto.title),
      region: 'Global',
      civilization: '',
      endYear: null,
      dateLabel: dto.endYear ? `${dto.startYear} – ${dto.endYear}` : String(dto.startYear),
      approximate: false,
      description: '',
      significance: '',
      locations: [],
      images: [],
      videos: [],
      documents: [],
      wikiTitle: null,
      noImage: false,
      references: [],
      relatedEventIds: [],
      entities: [],
      tags: [],
      featured: false,
      status: 'draft',
      ...dto,
      createdAt: now,
      updatedAt: now,
    } as HistoricalEvent;
    return this.repo.create(event);
  }

  async update(id: string, dto: UpdateEventDto): Promise<HistoricalEvent> {
    const patch: Partial<HistoricalEvent> = { ...(dto as Partial<HistoricalEvent>), updatedAt: new Date().toISOString() };
    if (dto.title) patch.slug = slugify(dto.title);
    const updated = await this.repo.update(id, patch);
    if (!updated) throw new NotFoundException(`Event ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const ok = await this.repo.delete(id);
    if (!ok) throw new NotFoundException(`Event ${id} not found`);
    return { deleted: true };
  }

  timelines() {
    return this.repo.findTimelines();
  }
}
