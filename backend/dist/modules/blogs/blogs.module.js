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
exports.BlogsModule = exports.BlogsController = exports.BlogsService = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const base_repository_1 = require("../../common/base.repository");
const blog_repository_1 = require("./blog.repository");
const blog_dto_1 = require("./dto/blog.dto");
let BlogsService = class BlogsService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(includeDrafts = false, timeline) {
        return (await this.repo.findAll())
            .filter((b) => includeDrafts || b.status === 'published')
            .filter((b) => !timeline || b.timeline === timeline)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async findOne(idOrSlug) {
        const b = (await this.repo.findById(idOrSlug)) ?? (await this.repo.findAll()).find((x) => x.slug === idOrSlug);
        if (!b)
            throw new common_1.NotFoundException(`Story ${idOrSlug} not found`);
        return b;
    }
    create(dto) {
        const now = new Date().toISOString();
        return this.repo.create({
            id: (0, base_repository_1.newId)('blog'),
            slug: dto.slug || (0, base_repository_1.slugify)(dto.title),
            timeline: 'world',
            excerpt: dto.content.replace(/[#>*_`]/g, '').slice(0, 160),
            tags: [],
            relatedEventIds: [],
            coverImage: null,
            wikiTitle: null,
            author: 'History Bioscope Editorial',
            status: 'draft',
            ...dto,
            createdAt: now,
            updatedAt: now,
        });
    }
    async update(id, dto) {
        const b = await this.repo.update(id, { ...dto, updatedAt: new Date().toISOString() });
        if (!b)
            throw new common_1.NotFoundException(`Story ${id} not found`);
        return b;
    }
    async remove(id) {
        if (!(await this.repo.delete(id)))
            throw new common_1.NotFoundException(`Story ${id} not found`);
        return { deleted: true };
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [blog_repository_1.BlogRepository])
], BlogsService);
let BlogsController = class BlogsController {
    constructor(service) {
        this.service = service;
    }
    findAll(drafts, timeline) {
        return this.service.findAll(drafts === 'true', timeline);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.BlogsController = BlogsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiQuery)({ name: 'includeDrafts', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'timeline', required: false }),
    (0, swagger_1.ApiOperation)({ summary: 'List stories' }),
    __param(0, (0, common_1.Query)('includeDrafts')),
    __param(1, (0, common_1.Query)('timeline')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [blog_dto_1.CreateBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, blog_dto_1.UpdateBlogDto]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BlogsController.prototype, "remove", null);
exports.BlogsController = BlogsController = __decorate([
    (0, swagger_1.ApiTags)('Blogs & Stories'),
    (0, common_1.Controller)('blogs'),
    __metadata("design:paramtypes", [BlogsService])
], BlogsController);
let BlogsModule = class BlogsModule {
};
exports.BlogsModule = BlogsModule;
exports.BlogsModule = BlogsModule = __decorate([
    (0, common_1.Module)({ controllers: [BlogsController], providers: [BlogsService, blog_repository_1.BlogRepository], exports: [BlogsService] })
], BlogsModule);
//# sourceMappingURL=blogs.module.js.map