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
exports.GraphModule = exports.GraphController = exports.GraphService = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const events_module_1 = require("../events/events.module");
const events_service_1 = require("../events/events.service");
let GraphService = class GraphService {
    constructor(events) {
        this.events = events;
    }
    async build(timeline, era) {
        const events = await this.events.findAll({ timeline, era });
        const nodes = new Map();
        const edges = [];
        const ids = new Set(events.map((e) => e.id));
        for (const e of events) {
            nodes.set(e.id, { id: e.id, label: e.title, type: 'event', timeline: e.timeline, year: e.startYear, degree: 0 });
        }
        for (const e of events) {
            for (const ent of e.entities) {
                const nid = `${ent.type}:${ent.name}`;
                if (!nodes.has(nid))
                    nodes.set(nid, { id: nid, label: ent.name, type: ent.type, degree: 0 });
                edges.push({ id: `${e.id}->${nid}`, source: e.id, target: nid, kind: 'involves' });
            }
            for (const r of e.relatedEventIds) {
                if (ids.has(r) && e.id < r)
                    edges.push({ id: `${e.id}<->${r}`, source: e.id, target: r, kind: 'related' });
            }
        }
        for (const ed of edges) {
            nodes.get(ed.source).degree++;
            nodes.get(ed.target).degree++;
        }
        return { nodes: [...nodes.values()], edges };
    }
};
exports.GraphService = GraphService;
exports.GraphService = GraphService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], GraphService);
let GraphController = class GraphController {
    constructor(graph) {
        this.graph = graph;
    }
    get(timeline, era) {
        return this.graph.build(timeline, era);
    }
};
exports.GraphController = GraphController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Nodes (events, people, places, empires, battles, religions) and edges' }),
    (0, swagger_1.ApiQuery)({ name: 'timeline', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'era', required: false }),
    __param(0, (0, common_1.Query)('timeline')),
    __param(1, (0, common_1.Query)('era')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GraphController.prototype, "get", null);
exports.GraphController = GraphController = __decorate([
    (0, swagger_1.ApiTags)('Knowledge Graph'),
    (0, common_1.Controller)('graph'),
    __metadata("design:paramtypes", [GraphService])
], GraphController);
let GraphModule = class GraphModule {
};
exports.GraphModule = GraphModule;
exports.GraphModule = GraphModule = __decorate([
    (0, common_1.Module)({ imports: [events_module_1.EventsModule], controllers: [GraphController], providers: [GraphService] })
], GraphModule);
//# sourceMappingURL=graph.module.js.map