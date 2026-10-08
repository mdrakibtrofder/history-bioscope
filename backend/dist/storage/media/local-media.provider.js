"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalMediaProvider = void 0;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class LocalMediaProvider {
    constructor(uploadDir, publicUrl) {
        this.uploadDir = uploadDir;
        this.publicUrl = publicUrl;
        this.name = 'local';
        (0, node_fs_1.mkdirSync)((0, node_path_1.resolve)(uploadDir), { recursive: true });
    }
    async save(file) {
        const ext = (0, node_path_1.extname)(file.originalName).toLowerCase().replace(/[^.\w]/g, '');
        const key = `${Date.now()}-${(0, node_crypto_1.randomUUID)().slice(0, 8)}${ext}`;
        await (0, promises_1.writeFile)((0, node_path_1.join)((0, node_path_1.resolve)(this.uploadDir), key), file.buffer);
        return {
            key,
            url: `${this.publicUrl.replace(/\/$/, '')}/uploads/${key}`,
            size: file.size,
            mimeType: file.mimeType,
            originalName: file.originalName,
        };
    }
    async remove(key) {
        if (key.includes('/') || key.includes('..'))
            return;
        await (0, promises_1.unlink)((0, node_path_1.join)((0, node_path_1.resolve)(this.uploadDir), key)).catch(() => undefined);
    }
}
exports.LocalMediaProvider = LocalMediaProvider;
//# sourceMappingURL=local-media.provider.js.map