/**
 * Storage abstraction layer.
 *
 * Business logic (services, repositories) depends ONLY on these interfaces.
 * Concrete engines are chosen at runtime by StorageFactory from configuration,
 * so switching from JSON files to MongoDB/PostgreSQL or from local disk to
 * MinIO/Cloudinary/S3 requires no change to business logic.
 */

export const STORAGE_PROVIDER = Symbol('STORAGE_PROVIDER');
export const MEDIA_STORAGE_PROVIDER = Symbol('MEDIA_STORAGE_PROVIDER');

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Document / record storage (events, blogs, locations, routes …) */
export interface StorageProvider {
  readonly name: string;
  init(): Promise<void>;
  findAll<T extends BaseEntity>(collection: string): Promise<T[]>;
  findById<T extends BaseEntity>(collection: string, id: string): Promise<T | null>;
  create<T extends BaseEntity>(collection: string, item: T): Promise<T>;
  update<T extends BaseEntity>(collection: string, id: string, patch: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
  /** Restore collections to their seed state */
  reset(): Promise<void>;
}

export interface StoredFile {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  originalName: string;
}

export interface UploadInput {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
}

/** Binary / media storage (images, videos, PDFs) */
export interface MediaStorageProvider {
  readonly name: string;
  save(file: UploadInput): Promise<StoredFile>;
  remove(key: string): Promise<void>;
}

export type StorageDriver = 'json' | 'mongo' | 'postgres';
export type MediaDriver = 'local' | 'minio' | 'cloudinary' | 's3';
