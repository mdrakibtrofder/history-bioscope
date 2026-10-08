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
exports.MetaModule = exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const storage_interfaces_1 = require("../../storage/storage.interfaces");
let MetaController = class MetaController {
    constructor(storage, media) {
        this.storage = storage;
        this.media = media;
    }
    health() {
        return { status: 'ok', storage: this.storage.name, media: this.media.name, time: new Date().toISOString() };
    }
    async stats() {
        const events = await this.storage.findAll('events');
        const count = (f) => events.reduce((acc, e) => ((acc[f(e)] = (acc[f(e)] ?? 0) + 1), acc), {});
        return {
            totalEvents: events.length,
            published: events.filter((e) => e.status === 'published').length,
            drafts: events.filter((e) => e.status === 'draft').length,
            byTimeline: count((e) => e.timeline),
            byCategory: count((e) => e.category),
            byEra: count((e) => `${e.timeline}|${e.era}`),
            blogs: (await this.storage.findAll('blogs')).length,
            media: (await this.storage.findAll('media')).length,
            locations: (await this.storage.findAll('locations')).length,
        };
    }
    async reset() {
        await this.storage.reset();
        return { reset: true };
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "health", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Counts by timeline, era, category and century' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "stats", null);
__decorate([
    (0, common_1.Post)('admin/reset'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset all data to the original seed (destructive)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MetaController.prototype, "reset", null);
exports.MetaController = MetaController = __decorate([
    (0, swagger_1.ApiTags)('Meta'),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(storage_interfaces_1.STORAGE_PROVIDER)),
    __param(1, (0, common_1.Inject)(storage_interfaces_1.MEDIA_STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object])
], MetaController);
let MetaModule = class MetaModule {
};
exports.MetaModule = MetaModule;
exports.MetaModule = MetaModule = __decorate([
    (0, common_1.Module)({ controllers: [MetaController] })
], MetaModule);
//# sourceMappingURL=meta.module.js.map