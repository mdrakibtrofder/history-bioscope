import { NotImplementedException } from '@nestjs/common';
import { MediaStorageProvider, StoredFile, UploadInput } from '../storage.interfaces';

/**
 * CloudinaryProvider – placeholder for Cloudinary media storage.
 * To enable: npm install cloudinary, implement save/remove, set MEDIA_DRIVER=cloudinary and CLOUDINARY_URL.
 */
export class CloudinaryProvider implements MediaStorageProvider {
  readonly name = 'cloudinary';
  constructor(private readonly config: Record<string, string | undefined>) {}
  async save(_file: UploadInput): Promise<StoredFile> {
    throw new NotImplementedException('CloudinaryProvider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
  async remove(_key: string): Promise<void> {
    throw new NotImplementedException('CloudinaryProvider is not implemented yet. Use MEDIA_DRIVER=local.');
  }
}
