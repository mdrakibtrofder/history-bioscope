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
exports.MapModule = exports.MapController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const storage_interfaces_1 = require("../../storage/storage.interfaces");
let MapController = class MapController {
    constructor(storage) {
        this.storage = storage;
    }
    async filtered(col, timeline, year) {
        const y = year !== undefined && year !== '' ? Number(year) : undefined;
        return (await this.storage.findAll(col))
            .filter((r) => !timeline || timeline === 'all' || r.timeline === timeline)
            .filter((r) => y === undefined || (r.startYear <= y && r.endYear >= y));
    }
    routes(timeline, year) {
        return this.filtered('routes', timeline, year);
    }
    territories(timeline, year) {
        return this.filtered('territories', timeline, year);
    }
};
exports.MapController = MapController;
__decorate([
    (0, common_1.Get)('routes'),
    (0, swagger_1.ApiQuery)({ name: 'timeline', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('timeline')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MapController.prototype, "routes", null);
__decorate([
    (0, common_1.Get)('territories'),
    (0, swagger_1.ApiQuery)({ name: 'timeline', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'year', required: false }),
    __param(0, (0, common_1.Query)('timeline')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MapController.prototype, "territories", null);
exports.MapController = MapController = __decorate([
    (0, swagger_1.ApiTags)('Map Layers'),
    (0, common_1.Controller)('map'),
    __param(0, (0, common_1.Inject)(storage_interfaces_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], MapController);
let MapModule = class MapModule {
};
exports.MapModule = MapModule;
exports.MapModule = MapModule = __decorate([
    (0, common_1.Module)({ controllers: [MapController] })
], MapModule);
//# sourceMappingURL=map.module.js.map