"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_factory_1 = require("./storage.factory");
const storage_interfaces_1 = require("./storage.interfaces");
let StorageModule = class StorageModule {
};
exports.StorageModule = StorageModule;
exports.StorageModule = StorageModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            { provide: storage_interfaces_1.STORAGE_PROVIDER, inject: [config_1.ConfigService], useFactory: (c) => storage_factory_1.StorageFactory.createStorage(c) },
            { provide: storage_interfaces_1.MEDIA_STORAGE_PROVIDER, inject: [config_1.ConfigService], useFactory: (c) => storage_factory_1.StorageFactory.createMedia(c) },
        ],
        exports: [storage_interfaces_1.STORAGE_PROVIDER, storage_interfaces_1.MEDIA_STORAGE_PROVIDER],
    })
], StorageModule);
//# sourceMappingURL=storage.module.js.map