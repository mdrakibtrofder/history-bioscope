import { NotImplementedException } from '@nestjs/common';
import { MediaStorageProvider, StoredFile, UploadInput } from '../storage.interfaces';

/**
 * MinioProvider – placeholder for MinIO media storage.
 * To enable: npm install minio, implement save/remove, set MEDIA_DRIVER=minio and MINIO_ENDPOINT/MINIO_BUCKET.
 */
export class MinioProvider implements MediaStorageProvider {
  readonly name = 'minio';
  constructor(private readonly config: Record<string, string | undefined>) {}
  async save(_file: UploadInput): Promise<StoredFile> {
    throw new NotImplementedException('MinioProvider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
  async remove(_key: string): Promise<void> {
    throw new NotImplementedException('MinioProvider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
}
