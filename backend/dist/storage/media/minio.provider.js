"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioProvider = void 0;
const common_1 = require("@nestjs/common");
class MinioProvider {
    constructor(config) {
        this.config = config;
        this.name = 'minio';
    }
    async save(_file) {
        throw new common_1.NotImplementedException('MinioProvider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
    async remove(_key) {
        throw new common_1.NotImplementedException('MinioProvider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
}
exports.MinioProvider = MinioProvider;
//# sourceMappingURL=minio.provider.js.map