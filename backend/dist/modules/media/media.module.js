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
exports.MediaModule = exports.MediaController = exports.MediaService = exports.MediaRepository = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const multer_1 = require("multer");
const base_repository_1 = require("../../common/base.repository");
const storage_interfaces_1 = require("../../storage/storage.interfaces");
let MediaRepository = class MediaRepository extends base_repository_1.BaseRepository {
    constructor(storage) {
        super(storage);
        this.collection = 'media';
    }
};
exports.MediaRepository = MediaRepository;
exports.MediaRepository = MediaRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(storage_interfaces_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], MediaRepository);
const kind = (mime) => mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : mime === 'application/pdf' ? 'document' : 'other';
let MediaService = class MediaService {
    constructor(repo, files) {
        this.repo = repo;
        this.files = files;
    }
    async findAll() {
        return (await this.repo.findAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async upload(file, caption, eventId) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded (field name must be "file")');
        const stored = await this.files.save({ buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, size: file.size });
        const now = new Date().toISOString();
        return this.repo.create({
            id: (0, base_repository_1.newId)('media'), ...stored, type: kind(file.mimetype), caption: caption ?? '', eventId: eventId || null, createdAt: now, updatedAt: now,
        });
    }
    async update(id, patch) {
        const m = await this.repo.update(id, { ...patch, updatedAt: new Date().toISOString() });
        if (!m)
            throw new common_1.NotFoundException();
        return m;
    }
    async remove(id) {
        const m = await this.repo.findById(id);
        if (!m)
            throw new common_1.NotFoundException();
        await this.files.remove(m.key);
        await this.repo.delete(id);
        return { deleted: true };
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(storage_interfaces_1.MEDIA_STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [MediaRepository, Object])
], MediaService);
let MediaController = class MediaController {
    constructor(service) {
        this.service = service;
    }
    findAll() {
        return this.service.findAll();
    }
    upload(file, caption, eventId) {
        return this.service.upload(file, caption, eventId);
    }
    update(id, body) {
        return this.service.update(id, body);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload an image, video or PDF (max 50 MB)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, caption: { type: 'string' }, eventId: { type: 'string' } } } }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { storage: (0, multer_1.memoryStorage)(), limits: { fileSize: 50 * 1024 * 1024 } })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('caption')),
    __param(2, (0, common_1.Body)('eventId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "upload", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [MediaService])
], MediaController);
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({ controllers: [MediaController], providers: [MediaService, MediaRepository] })
], MediaModule);
//# sourceMappingURL=media.module.js.map