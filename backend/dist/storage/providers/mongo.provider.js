"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoProvider = void 0;
const common_1 = require("@nestjs/common");
class MongoProvider {
    constructor(uri) {
        this.uri = uri;
        this.name = 'mongo';
    }
    ni() {
        throw new common_1.NotImplementedException(`MongoProvider is not implemented yet (uri: ${this.uri}). Use STORAGE_DRIVER=json.`);
    }
    async init() { this.ni(); }
    async findAll(_c) { return this.ni(); }
    async findById(_c, _id) { return this.ni(); }
    async create(_c, _i) { return this.ni(); }
    async update(_c, _id, _p) { return this.ni(); }
    async delete(_c, _id) { return this.ni(); }
    async reset() { this.ni(); }
}
exports.MongoProvider = MongoProvider;
//# sourceMappingURL=mongo.provider.js.map