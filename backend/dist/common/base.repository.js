"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newId = exports.slugify = exports.BaseRepository = void 0;
class BaseRepository {
    constructor(storage) {
        this.storage = storage;
    }
    findAll() {
        return this.storage.findAll(this.collection);
    }
    findById(id) {
        return this.storage.findById(this.collection, id);
    }
    create(item) {
        return this.storage.create(this.collection, item);
    }
    update(id, patch) {
        return this.storage.update(this.collection, id, patch);
    }
    delete(id) {
        return this.storage.delete(this.collection, id);
    }
}
exports.BaseRepository = BaseRepository;
const slugify = (s) => s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
exports.slugify = slugify;
const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
exports.newId = newId;
//# sourceMappingURL=base.repository.js.map