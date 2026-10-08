import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CloudinaryProvider } from './media/cloudinary.provider';
import { LocalMediaProvider } from './media/local-media.provider';
import { MinioProvider } from './media/minio.provider';
import { S3Provider } from './media/s3.provider';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { MongoProvider } from './providers/mongo.provider';
import { PostgresProvider } from './providers/postgres.provider';
import { MediaDriver, MediaStorageProvider, StorageDriver, StorageProvider } from './storage.interfaces';

/** Factory Pattern – builds the configured storage engines at runtime. */
export class StorageFactory {
  private static readonly logger = new Logger('StorageFactory');

  static async createStorage(config: ConfigService): Promise<StorageProvider> {
    const driver = (config.get<string>('STORAGE_DRIVER') ?? 'json') as StorageDriver;
    let provider: StorageProvider;
    switch (driver) {
      case 'mongo':
        provider = new MongoProvider(config.get('MONGO_URI') ?? '');
        break;
      case 'postgres':
        provider = new PostgresProvider(config.get('POSTGRES_URL') ?? '');
        break;
      case 'json':
      default:
        provider = new LocalStorageProvider(
          config.get('JSON_DB_PATH') ?? 'storage/db.json',
          config.get('SEED_DIR') ?? '../data/seed',
        );
    }
    await provider.init();
    this.logger.log(`Document storage: ${provider.name}`);
    return provider;
  }

  static createMedia(config: ConfigService): MediaStorageProvider {
    const driver = (config.get<string>('MEDIA_DRIVER') ?? 'local') as MediaDriver;
    const all = process.env as Record<string, string | undefined>;
    let provider: MediaStorageProvider;
    switch (driver) {
      case 'minio':
        provider = new MinioProvider(all);
        break;
      case 'cloudinary':
        provider = new CloudinaryProvider(all);
        break;
      case 's3':
        provider = new S3Provider(all);
        break;
      case 'local':
      default:
        provider = new LocalMediaProvider(
          config.get('UPLOAD_DIR') ?? 'uploads',
          config.get('PUBLIC_URL') ?? `http://localhost:${config.get('PORT') ?? 4000}`,
        );
    }
    this.logger.log(`Media storage: ${provider.name}`);
    return provider;
  }
}
