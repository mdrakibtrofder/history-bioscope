import { NotImplementedException } from '@nestjs/common';
import { MediaStorageProvider, StoredFile, UploadInput } from '../storage.interfaces';

/**
 * S3Provider – placeholder for AWS S3 media storage.
 * To enable: npm install @aws-sdk/client-s3, implement save/remove, set MEDIA_DRIVER=s3 and S3_BUCKET/S3_REGION.
 */
export class S3Provider implements MediaStorageProvider {
  readonly name = 's3';
  constructor(private readonly config: Record<string, string | undefined>) {}
  async save(_file: UploadInput): Promise<StoredFile> {
    throw new NotImplementedException('S3Provider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
  async remove(_key: string): Promise<void> {
    throw new NotImplementedException('S3Provider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
}
