import { Body, Controller, Delete, Get, Inject, Injectable, Module, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseRepository, newId } from '../../common/base.repository';
import { LocationItem } from '../../common/types';
import { STORAGE_PROVIDER, StorageProvider } from '../../storage/storage.interfaces';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationRepository extends BaseRepository<LocationItem> {
  protected readonly collection = 'locations';
  constructor(@Inject(STORAGE_PROVIDER) storage: StorageProvider) {
    super(storage);
  }
}

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly repo: LocationRepository) {}

  @Get() findAll() {
    return this.repo.findAll();
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    const l = await this.repo.findById(id);
    if (!l) throw new NotFoundException();
    return l;
  }
  @Post() create(@Body() dto: CreateLocationDto) {
    const now = new Date().toISOString();
    return this.repo.create({ id: newId('loc'), eventIds: [], country: '', region: '', historicalTerritory: '', ...dto, createdAt: now, updatedAt: now });
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    const l = await this.repo.update(id, { ...dto, updatedAt: new Date().toISOString() });
    if (!l) throw new NotFoundException();
    return l;
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    if (!(await this.repo.delete(id))) throw new NotFoundException();
    return { deleted: true };
  }
}

@Module({ controllers: [LocationsController], providers: [LocationRepository] })
export class LocationsModule {}
