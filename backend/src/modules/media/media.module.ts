import {
  BadRequestException, Body, Controller, Delete, Get, Inject, Injectable, Module, NotFoundException, Param, Patch, Post,
  UploadedFile, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { BaseRepository, newId } from '../../common/base.repository';
import { MediaItem } from '../../common/types';
import {
  MEDIA_STORAGE_PROVIDER, MediaStorageProvider, STORAGE_PROVIDER, StorageProvider,
} from '../../storage/storage.interfaces';

@Injectable()
export class MediaRepository extends BaseRepository<MediaItem> {
  protected readonly collection = 'media';
  constructor(@Inject(STORAGE_PROVIDER) storage: StorageProvider) {
    super(storage);
  }
}

const kind = (mime: string): MediaItem['type'] =>
  mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : mime === 'application/pdf' ? 'document' : 'other';

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    @Inject(MEDIA_STORAGE_PROVIDER) private readonly files: MediaStorageProvider,
  ) {}

  async findAll() {
    return (await this.repo.findAll()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async upload(file: Express.Multer.File, caption?: string, eventId?: string) {
    if (!file) throw new BadRequestException('No file uploaded (field name must be "file")');
    const stored = await this.files.save({ buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, size: file.size });
    const now = new Date().toISOString();
    return this.repo.create({
      id: newId('media'), ...stored, type: kind(file.mimetype), caption: caption ?? '', eventId: eventId || null, createdAt: now, updatedAt: now,
    });
  }

  async update(id: string, patch: { caption?: string; eventId?: string | null }) {
    const m = await this.repo.update(id, { ...patch, updatedAt: new Date().toISOString() });
    if (!m) throw new NotFoundException();
    return m;
  }

  async remove(id: string) {
    const m = await this.repo.findById(id);
    if (!m) throw new NotFoundException();
    await this.files.remove(m.key);
    await this.repo.delete(id);
    return { deleted: true };
  }
}

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly service: MediaService) {}

  @Get() findAll() {
    return this.service.findAll();
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload an image, video or PDF (max 50 MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' }, caption: { type: 'string' }, eventId: { type: 'string' } } } })
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } }))
  upload(@UploadedFile() file: Express.Multer.File, @Body('caption') caption?: string, @Body('eventId') eventId?: string) {
    return this.service.upload(file, caption, eventId);
  }

  @Patch(':id') update(@Param('id') id: string, @Body() body: { caption?: string; eventId?: string | null }) {
    return this.service.update(id, body);
  }

  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

@Module({ controllers: [MediaController], providers: [MediaService, MediaRepository] })
export class MediaModule {}
