import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/base.repository';
import { Blog } from '../../common/types';
import { STORAGE_PROVIDER, StorageProvider } from '../../storage/storage.interfaces';

@Injectable()
export class BlogRepository extends BaseRepository<Blog> {
  protected readonly collection = 'blogs';
  constructor(@Inject(STORAGE_PROVIDER) storage: StorageProvider) {
    super(storage);
  }
}
