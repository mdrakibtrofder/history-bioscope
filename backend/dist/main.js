"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const node_path_1 = require("node:path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = Number(process.env.PORT ?? 4000);
    const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map((s) => s.trim());
    app.enableCors({ origin: [...origins, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/], credentials: true });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: false } }));
    app.useStaticAssets((0, node_path_1.resolve)(process.env.UPLOAD_DIR ?? 'uploads'), { prefix: '/uploads/' });
    app.useBodyParser('json', { limit: '10mb' });
    const doc = new swagger_1.DocumentBuilder()
        .setTitle('History Bioscope API')
        .setDescription('Interactive historical timeline & geo-visualization platform. Storage engines are switchable through configuration.')
        .setVersion('1.0.0')
        .build();
    swagger_1.SwaggerModule.setup('api/docs', app, swagger_1.SwaggerModule.createDocument(app, doc));
    await app.listen(port);
    common_1.Logger.log(`API ready on http://localhost:${port}/api  ·  Swagger: http://localhost:${port}/api/docs`, 'Bootstrap');
}
bootstrap();
//# sourceMappingURL=main.js.map