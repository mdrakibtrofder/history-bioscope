"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageFactory = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_provider_1 = require("./media/cloudinary.provider");
const local_media_provider_1 = require("./media/local-media.provider");
const minio_provider_1 = require("./media/minio.provider");
const s3_provider_1 = require("./media/s3.provider");
const local_storage_provider_1 = require("./providers/local-storage.provider");
const mongo_provider_1 = require("./providers/mongo.provider");
const postgres_provider_1 = require("./providers/postgres.provider");
class StorageFactory {
    static { this.logger = new common_1.Logger('StorageFactory'); }
    static async createStorage(config) {
        const driver = (config.get('STORAGE_DRIVER') ?? 'json');
        let provider;
        switch (driver) {
            case 'mongo':
                provider = new mongo_provider_1.MongoProvider(config.get('MONGO_URI') ?? '');
                break;
            case 'postgres':
                provider = new postgres_provider_1.PostgresProvider(config.get('POSTGRES_URL') ?? '');
                break;
            case 'json':
            default:
                provider = new local_storage_provider_1.LocalStorageProvider(config.get('JSON_DB_PATH') ?? 'storage/db.json', config.get('SEED_DIR') ?? '../data/seed');
        }
        await provider.init();
        this.logger.log(`Document storage: ${provider.name}`);
        return provider;
    }
    static createMedia(config) {
        const driver = (config.get('MEDIA_DRIVER') ?? 'local');
        const all = process.env;
        let provider;
        switch (driver) {
            case 'minio':
                provider = new minio_provider_1.MinioProvider(all);
                break;
            case 'cloudinary':
                provider = new cloudinary_provider_1.CloudinaryProvider(all);
                break;
            case 's3':
                provider = new s3_provider_1.S3Provider(all);
                break;
            case 'local':
            default:
                provider = new local_media_provider_1.LocalMediaProvider(config.get('UPLOAD_DIR') ?? 'uploads', config.get('PUBLIC_URL') ?? `http://localhost:${config.get('PORT') ?? 4000}`);
        }
        this.logger.log(`Media storage: ${provider.name}`);
        return provider;
    }
}
exports.StorageFactory = StorageFactory;
//# sourceMappingURL=storage.factory.js.map