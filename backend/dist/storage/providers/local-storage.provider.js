"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class LocalStorageProvider {
    constructor(dbPath, seedDir) {
        this.dbPath = dbPath;
        this.seedDir = seedDir;
        this.name = 'json';
        this.logger = new common_1.Logger('LocalStorageProvider');
        this.db = {};
        this.writeQueue = Promise.resolve();
    }
    async init() {
        const file = (0, node_path_1.resolve)(this.dbPath);
        if ((0, node_fs_1.existsSync)(file)) {
            this.db = JSON.parse((0, node_fs_1.readFileSync)(file, 'utf8'));
            this.logger.log(`Loaded database from ${file}`);
            const seed = this.readSeed();
            let added = false;
            for (const [k, v] of Object.entries(seed)) {
                if (!this.db[k]) {
                    this.db[k] = v;
                    added = true;
                }
            }
            if (added)
                await this.persist();
        }
        else {
            this.db = this.readSeed();
            await this.persist();
            this.logger.log(`Seeded new database at ${file}`);
        }
    }
    readSeed() {
        const dir = (0, node_path_1.resolve)(this.seedDir);
        const db = {};
        if (!(0, node_fs_1.existsSync)(dir)) {
            this.logger.warn(`Seed directory not found: ${dir}`);
            return db;
        }
        for (const f of (0, node_fs_1.readdirSync)(dir).filter((x) => x.endsWith('.json'))) {
            db[f.replace(/\.json$/, '')] = JSON.parse((0, node_fs_1.readFileSync)((0, node_path_1.join)(dir, f), 'utf8'));
        }
        return db;
    }
    persist() {
        this.writeQueue = this.writeQueue.then(async () => {
            const file = (0, node_path_1.resolve)(this.dbPath);
            (0, node_fs_1.mkdirSync)((0, node_path_1.dirname)(file), { recursive: true });
            const tmp = `${file}.tmp`;
            await (0, promises_1.writeFile)(tmp, JSON.stringify(this.db, null, 2));
            await (0, promises_1.rename)(tmp, file);
        });
        return this.writeQueue;
    }
    col(name) {
        if (!this.db[name])
            this.db[name] = [];
        return this.db[name];
    }
    async findAll(collection) {
        return [...this.col(collection)];
    }
    async findById(collection, id) {
        return this.col(collection).find((x) => x.id === id) ?? null;
    }
    async create(collection, item) {
        this.col(collection).push(item);
        await this.persist();
        return item;
    }
    async update(collection, id, patch) {
        const list = this.col(collection);
        const idx = list.findIndex((x) => x.id === id);
        if (idx === -1)
            return null;
        list[idx] = { ...list[idx], ...patch, id };
        await this.persist();
        return list[idx];
    }
    async delete(collection, id) {
        const list = this.col(collection);
        const idx = list.findIndex((x) => x.id === id);
        if (idx === -1)
            return false;
        list.splice(idx, 1);
        await this.persist();
        return true;
    }
    async reset() {
        this.db = this.readSeed();
        await this.persist();
    }
}
exports.LocalStorageProvider = LocalStorageProvider;
//# sourceMappingURL=local-storage.provider.js.map