"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const common_1 = require("@nestjs/common");
class CloudinaryProvider {
    constructor(config) {
        this.config = config;
        this.name = 'cloudinary';
    }
    async save(_file) {
        throw new common_1.NotImplementedException('CloudinaryProvider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
    async remove(_key) {
        throw new common_1.NotImplementedException('CloudinaryProvider is not implemented yet. Use MEDIA_DRIVER=local.');
    }
}
exports.CloudinaryProvider = CloudinaryProvider;
//# sourceMappingURL=cloudinary.provider.js.map