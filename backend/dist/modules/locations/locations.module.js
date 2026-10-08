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
exports.LocationsModule = exports.LocationsController = exports.LocationRepository = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_repository_1 = require("../../common/base.repository");
const storage_interfaces_1 = require("../../storage/storage.interfaces");
const location_dto_1 = require("./dto/location.dto");
let LocationRepository = class LocationRepository extends base_repository_1.BaseRepository {
    constructor(storage) {
        super(storage);
        this.collection = 'locations';
    }
};
exports.LocationRepository = LocationRepository;
exports.LocationRepository = LocationRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(storage_interfaces_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], LocationRepository);
let LocationsController = class LocationsController {
    constructor(repo) {
        this.repo = repo;
    }
    findAll() {
        return this.repo.findAll();
    }
    async findOne(id) {
        const l = await this.repo.findById(id);
        if (!l)
            throw new common_1.NotFoundException();
        return l;
    }
    create(dto) {
        const now = new Date().toISOString();
        return this.repo.create({ id: (0, base_repository_1.newId)('loc'), eventIds: [], country: '', region: '', historicalTerritory: '', ...dto, createdAt: now, updatedAt: now });
    }
    async update(id, dto) {
        const l = await this.repo.update(id, { ...dto, updatedAt: new Date().toISOString() });
        if (!l)
            throw new common_1.NotFoundException();
        return l;
    }
    async remove(id) {
        if (!(await this.repo.delete(id)))
            throw new common_1.NotFoundException();
        return { deleted: true };
    }
};
exports.LocationsController = LocationsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.CreateLocationDto]),
    __metadata("design:returntype", void 0)
], LocationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, location_dto_1.UpdateLocationDto]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationsController.prototype, "remove", null);
exports.LocationsController = LocationsController = __decorate([
    (0, swagger_1.ApiTags)('Locations'),
    (0, common_1.Controller)('locations'),
    __metadata("design:paramtypes", [LocationRepository])
], LocationsController);
let LocationsModule = class LocationsModule {
};
exports.LocationsModule = LocationsModule;
exports.LocationsModule = LocationsModule = __decorate([
    (0, common_1.Module)({ controllers: [LocationsController], providers: [LocationRepository] })
], LocationsModule);
//# sourceMappingURL=locations.module.js.map