import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { unlink, writeFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { MediaStorageProvider, StoredFile, UploadInput } from '../storage.interfaces';

/** Saves uploaded files to the local `uploads/` folder, served at /uploads/* */
export class LocalMediaProvider implements MediaStorageProvider {
  readonly name = 'local';
  constructor(
    private readonly uploadDir: string,
    private readonly publicUrl: string,
  ) {
    mkdirSync(resolve(uploadDir), { recursive: true });
  }

  async save(file: UploadInput): Promise<StoredFile> {
    const ext = extname(file.originalName).toLowerCase().replace(/[^.\w]/g, '');
    const key = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    await writeFile(join(resolve(this.uploadDir), key), file.buffer);
    return {
      key,
      url: `${this.publicUrl.replace(/\/$/, '')}/uploads/${key}`,
      size: file.size,
      mimeType: file.mimeType,
      originalName: file.originalName,
    };
  }

  async remove(key: string): Promise<void> {
    if (key.includes('/') || key.includes('..')) return;
    await unlink(join(resolve(this.uploadDir), key)).catch(() => undefined);
  }
}
