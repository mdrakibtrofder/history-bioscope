import { Controller, Get, Inject, Module, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseEntity, STORAGE_PROVIDER, StorageProvider } from '../../storage/storage.interfaces';

interface Timed extends BaseEntity {
  timeline: string;
  startYear: number;
  endYear: number;
}

@ApiTags('Map Layers')
@Controller('map')
export class MapController {
  constructor(@Inject(STORAGE_PROVIDER) private readonly storage: StorageProvider) {}

  private async filtered(col: string, timeline?: string, year?: string) {
    const y = year !== undefined && year !== '' ? Number(year) : undefined;
    return (await this.storage.findAll<Timed>(col))
      .filter((r) => !timeline || timeline === 'all' || r.timeline === timeline)
      .filter((r) => y === undefined || (r.startYear <= y && r.endYear >= y));
  }

  @Get('routes')
  @ApiQuery({ name: 'timeline', required: false })
  @ApiQuery({ name: 'year', required: false })
  routes(@Query('timeline') timeline?: string, @Query('year') year?: string) {
    return this.filtered('routes', timeline, year);
  }

  @Get('territories')
  @ApiQuery({ name: 'timeline', required: false })
  @ApiQuery({ name: 'year', required: false })
  territories(@Query('timeline') timeline?: string, @Query('year') year?: string) {
    return this.filtered('territories', timeline, year);
  }
}

@Module({ controllers: [MapController] })
export class MapModule {}
