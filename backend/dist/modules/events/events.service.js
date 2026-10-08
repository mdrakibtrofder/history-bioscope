"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = exports.matchesText = void 0;
const common_1 = require("@nestjs/common");
const base_repository_1 = require("../../common/base.repository");
const timeline_repository_1 = require("./timeline.repository");
const matchesText = (e, q) => {
    const needle = q.toLowerCase().trim();
    if (!needle)
        return true;
    const hay = [
        e.title, e.summary, e.description, e.era, e.category, e.civilization, e.region, e.dateLabel, String(e.startYear),
        ...e.entities.map((x) => x.name), ...e.locations.map((l) => `${l.name} ${l.country ?? ''} ${l.historicalTerritory ?? ''}`), ...e.tags,
    ]
        .join(' ')
        .toLowerCase();
    return needle.split(/\s+/).every((w) => hay.includes(w));
};
exports.matchesText = matchesText;
let EventsService = class EventsService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(q = {}) {
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
            .filter((e) => !q.q || (0, exports.matchesText)(e, q.q))
            .sort((a, b) => a.startYear - b.startYear);
    }
    async findOne(idOrSlug) {
        const byId = await this.repo.findById(idOrSlug);
        if (byId)
            return byId;
        const all = await this.repo.findAll();
        const bySlug = all.find((e) => e.slug === idOrSlug);
        if (!bySlug)
            throw new common_1.NotFoundException(`Event ${idOrSlug} not found`);
        return bySlug;
    }
    async create(dto) {
        const now = new Date().toISOString();
        const event = {
            id: (0, base_repository_1.newId)(dto.timeline.slice(0, 2)),
            slug: (0, base_repository_1.slugify)(dto.title),
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
        };
        return this.repo.create(event);
    }
    async update(id, dto) {
        const patch = { ...dto, updatedAt: new Date().toISOString() };
        if (dto.title)
            patch.slug = (0, base_repository_1.slugify)(dto.title);
        const updated = await this.repo.update(id, patch);
        if (!updated)
            throw new common_1.NotFoundException(`Event ${id} not found`);
        return updated;
    }
    async remove(id) {
        const ok = await this.repo.delete(id);
        if (!ok)
            throw new common_1.NotFoundException(`Event ${id} not found`);
        return { deleted: true };
    }
    timelines() {
        return this.repo.findTimelines();
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [timeline_repository_1.TimelineRepository])
], EventsService);
//# sourceMappingURL=events.service.js.map