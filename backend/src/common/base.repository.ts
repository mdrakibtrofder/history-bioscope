import { BaseEntity, StorageProvider } from '../storage/storage.interfaces';

/** Repository Pattern – generic CRUD over one collection of the storage provider. */
export abstract class BaseRepository<T extends BaseEntity> {
  protected abstract readonly collection: string;
  constructor(protected readonly storage: StorageProvider) {}

  findAll(): Promise<T[]> {
    return this.storage.findAll<T>(this.collection);
  }
  findById(id: string): Promise<T | null> {
    return this.storage.findById<T>(this.collection, id);
  }
  create(item: T): Promise<T> {
    return this.storage.create<T>(this.collection, item);
  }
  update(id: string, patch: Partial<T>): Promise<T | null> {
    return this.storage.update<T>(this.collection, id, patch);
  }
  delete(id: string): Promise<boolean> {
    return this.storage.delete(this.collection, id);
  }
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
