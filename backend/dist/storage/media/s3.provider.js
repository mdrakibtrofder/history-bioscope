"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Provider = void 0;
const common_1 = require("@nestjs/common");
class S3Provider {
    constructor(config) {
        this.config = config;
        this.name = 's3';
    }
    async save(_file) {
        throw new common_1.NotImplementedException('S3Provider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
    async remove(_key) {
        throw new common_1.NotImplementedException('S3Provider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
}
exports.S3Provider = S3Provider;
//# sourceMappingURL=s3.provider.js.map