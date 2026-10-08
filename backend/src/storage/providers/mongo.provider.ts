import { NotImplementedException } from '@nestjs/common';
import { BaseEntity, StorageProvider } from '../storage.interfaces';

/**
 * MongoProvider – placeholder for a MongoDB-backed implementation.
 *
 * To enable:
 *   1. npm install mongodb
 *   2. Implement the methods below with a MongoClient (one Mongo collection per `collection`).
 *   3. Set STORAGE_DRIVER=mongo and MONGO_URI in .env
 * No service or repository code needs to change.
 */
export class MongoProvider implements StorageProvider {
  readonly name = 'mongo';
  constructor(private readonly uri: string) {}
  private ni(): never {
    throw new NotImplementedException(`MongoProvider is not implemented yet (uri: ${this.uri}). Use STORAGE_DRIVER=json.`);
  }
  async init(): Promise<void> { this.ni(); }
  async findAll<T extends BaseEntity>(_c: string): Promise<T[]> { return this.ni(); }
  async findById<T extends BaseEntity>(_c: string, _id: string): Promise<T | null> { return this.ni(); }
  async create<T extends BaseEntity>(_c: string, _i: T): Promise<T> { return this.ni(); }
  async update<T extends BaseEntity>(_c: string, _id: string, _p: Partial<T>): Promise<T | null> { return this.ni(); }
  async delete(_c: string, _id: string): Promise<boolean> { return this.ni(); }
  async reset(): Promise<void> { this.ni(); }
}
