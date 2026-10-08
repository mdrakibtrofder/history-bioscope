import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageFactory } from './storage.factory';
import { MEDIA_STORAGE_PROVIDER, STORAGE_PROVIDER } from './storage.interfaces';

/** Dependency Injection – exposes the configured engines under stable tokens. */
@Global()
@Module({
  providers: [
    { provide: STORAGE_PROVIDER, inject: [ConfigService], useFactory: (c: ConfigService) => StorageFactory.createStorage(c) },
    { provide: MEDIA_STORAGE_PROVIDER, inject: [ConfigService], useFactory: (c: ConfigService) => StorageFactory.createMedia(c) },
  ],
  exports: [STORAGE_PROVIDER, MEDIA_STORAGE_PROVIDER],
})
export class StorageModule {}
