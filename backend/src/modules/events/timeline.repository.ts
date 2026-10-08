import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base.repository';
import { HistoricalEvent } from '../../common/types';
import { STORAGE_PROVIDER, StorageProvider } from '../../storage/storage.interfaces';

export interface TimelineDef {
  id: string;
  name: string;
  nameBn?: string;
  color: string;
  description: string;
  eras: string[];
}

@Injectable()
export class TimelineRepository extends BaseRepository<HistoricalEvent> {
  protected readonly collection = 'events';
  constructor(@Inject(STORAGE_PROVIDER) storage: StorageProvider) {
    super(storage);
  }

  findTimelines(): Promise<TimelineDef[]> {
    return this.storage.findAll<TimelineDef>('timelines');
  }
}
