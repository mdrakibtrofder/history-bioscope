import { NotImplementedException } from '@nestjs/common';
import { BaseEntity, StorageProvider } from '../storage.interfaces';

/**
 * PostgresProvider – placeholder for a PostgreSQL implementation
 * (e.g. one JSONB table per collection, or proper relational tables).
 *
 * To enable: npm install pg, implement the methods, set STORAGE_DRIVER=postgres.
 */
export class PostgresProvider implements StorageProvider {
  readonly name = 'postgres';
  constructor(private readonly url: string) {}
  private ni(): never {
    throw new NotImplementedException(`PostgresProvider is not implemented yet (${this.url}). Use STORAGE_DRIVER=json.`);
  }
  async init(): Promise<void> { this.ni(); }
  async findAll<T extends BaseEntity>(_c: string): Promise<T[]> { return this.ni(); }
  async findById<T extends BaseEntity>(_c: string, _id: string): Promise<T | null> { return this.ni(); }
  async create<T extends BaseEntity>(_c: string, _i: T): Promise<T> { return this.ni(); }
  async update<T extends BaseEntity>(_c: string, _id: string, _p: Partial<T>): Promise<T | null> { return this.ni(); }
  async delete(_c: string, _id: string): Promise<boolean> { return this.ni(); }
  async reset(): Promise<void> { this.ni(); }
}
