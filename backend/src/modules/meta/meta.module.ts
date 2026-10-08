import { Controller, Get, Inject, Module, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistoricalEvent } from '../../common/types';
import { MEDIA_STORAGE_PROVIDER, MediaStorageProvider, STORAGE_PROVIDER, StorageProvider } from '../../storage/storage.interfaces';

@ApiTags('Meta')
@Controller()
export class MetaController {
  constructor(
    @Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider,
    @Inject(MEDIA_STORAGE_PROVIDER) private readonly media: MediaStorageProvider,
  ) {}

  @Get('health')
  health() {
    return { status: 'ok', storage: this.storage.name, media: this.media.name, time: new Date().toISOString() };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Counts by timeline, era, category and century' })
  async stats() {
    const events = await this.storage.findAll<HistoricalEvent>('events');
    const count = (f: (e: HistoricalEvent) => string) =>
      events.reduce<Record<string, number>>((acc, e) => ((acc[f(e)] = (acc[f(e)] ?? 0) + 1), acc), {});
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

  @Post('admin/reset')
  @ApiOperation({ summary: 'Reset all data to the original seed (destructive)' })
  async reset() {
    await this.storage.reset();
    return { reset: true };
  }
}

@Module({ controllers: [MetaController] })
export class MetaModule {}
