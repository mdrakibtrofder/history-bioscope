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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchModule = exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const blogs_module_1 = require("../blogs/blogs.module");
const event_dto_1 = require("../events/dto/event.dto");
const events_module_1 = require("../events/events.module");
const events_service_1 = require("../events/events.service");
let SearchController = class SearchController {
    constructor(events, blogs) {
        this.events = events;
        this.blogs = blogs;
    }
    async search(q) {
        const events = await this.events.findAll(q);
        const needle = (q.q ?? '').toLowerCase();
        const blogs = needle
            ? (await this.blogs.findAll()).filter((b) => `${b.title} ${b.excerpt} ${b.tags.join(' ')} ${b.content}`.toLowerCase().includes(needle))
            : [];
        const entityMap = new Map();
        if (needle) {
            for (const e of events)
                for (const en of e.entities)
                    if (en.name.toLowerCase().includes(needle)) {
                        const k = `${en.type}:${en.name}`;
                        const cur = entityMap.get(k) ?? { type: en.type, name: en.name, count: 0 };
                        cur.count++;
                        entityMap.set(k, cur);
                    }
        }
        return { query: q.q ?? '', total: events.length, events, blogs, entities: [...entityMap.values()].sort((a, b) => b.count - a.count) };
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Global search across events, people, places, empires, battles, dates and stories' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [event_dto_1.EventQueryDto]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
exports.SearchController = SearchController = __decorate([
    (0, swagger_1.ApiTags)('Search'),
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [events_service_1.EventsService,
        blogs_module_1.BlogsService])
], SearchController);
let SearchModule = class SearchModule {
};
exports.SearchModule = SearchModule;
exports.SearchModule = SearchModule = __decorate([
    (0, common_1.Module)({ imports: [events_module_1.EventsModule, blogs_module_1.BlogsModule], controllers: [SearchController] })
], SearchModule);
//# sourceMappingURL=search.module.js.map