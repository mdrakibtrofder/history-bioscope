import { Logger } from '@nestjs/common';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { writeFile, rename } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { BaseEntity, StorageProvider } from '../storage.interfaces';

type Db = Record<string, BaseEntity[]>;

/**
 * LocalStorageProvider – persists every collection in a single JSON file.
 * On first start it is seeded from the JSON files in SEED_DIR (data/seed).
 * Writes are atomic (write temp file → rename) and serialised through a queue.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly name = 'json';
  private readonly logger = new Logger('LocalStorageProvider');
  private db: Db = {};
  private writeQueue: Promise<void> = Promise.resolve();

  constructor(
    private readonly dbPath: string,
    private readonly seedDir: string,
  ) {}

  async init(): Promise<void> {
    const file = resolve(this.dbPath);
    if (existsSync(file)) {
      this.db = JSON.parse(readFileSync(file, 'utf8'));
      this.logger.log(`Loaded database from ${file}`);
      // Add any new seed collections that do not exist yet
      const seed = this.readSeed();
      let added = false;
      for (const [k, v] of Object.entries(seed)) {
        if (!this.db[k]) {
          this.db[k] = v;
          added = true;
        }
      }
      if (added) await this.persist();
    } else {
      this.db = this.readSeed();
      await this.persist();
      this.logger.log(`Seeded new database at ${file}`);
    }
  }

  private readSeed(): Db {
    const dir = resolve(this.seedDir);
    const db: Db = {};
    if (!existsSync(dir)) {
      this.logger.warn(`Seed directory not found: ${dir}`);
      return db;
    }
    for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
      db[f.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    }
    return db;
  }

  private persist(): Promise<void> {
    this.writeQueue = this.writeQueue.then(async () => {
      const file = resolve(this.dbPath);
      mkdirSync(dirname(file), { recursive: true });
      const tmp = `${file}.tmp`;
      await writeFile(tmp, JSON.stringify(this.db, null, 2));
      await rename(tmp, file);
    });
    return this.writeQueue;
  }

  private col<T extends BaseEntity>(name: string): T[] {
    if (!this.db[name]) this.db[name] = [];
    return this.db[name] as T[];
  }

  async findAll<T extends BaseEntity>(collection: string): Promise<T[]> {
    return [...this.col<T>(collection)];
  }

  async findById<T extends BaseEntity>(collection: string, id: string): Promise<T | null> {
    return this.col<T>(collection).find((x) => x.id === id) ?? null;
  }

  async create<T extends BaseEntity>(collection: string, item: T): Promise<T> {
    this.col<T>(collection).push(item);
    await this.persist();
    return item;
  }

  async update<T extends BaseEntity>(collection: string, id: string, patch: Partial<T>): Promise<T | null> {
    const list = this.col<T>(collection);
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...patch, id };
    await this.persist();
    return list[idx];
  }

  async delete(collection: string, id: string): Promise<boolean> {
    const list = this.col(collection);
    const idx = list.findIndex((x) => x.id === id);
    if (idx === -1) return false;
    list.splice(idx, 1);
    await this.persist();
    return true;
  }

  async reset(): Promise<void> {
    this.db = this.readSeed();
    await this.persist();
  }
}
