import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = Number(process.env.PORT ?? 4000);
  const origins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(',').map((s) => s.trim());

  app.enableCors({ origin: [...origins, /^http:\/\/(localhost|127\.0\.0\.1):\d+$/], credentials: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: false } }));
  app.useStaticAssets(resolve(process.env.UPLOAD_DIR ?? 'uploads'), { prefix: '/uploads/' });
  app.useBodyParser('json', { limit: '10mb' });

  const doc = new DocumentBuilder()
    .setTitle('History Bioscope API')
    .setDescription('Interactive historical timeline & geo-visualization platform. Storage engines are switchable through configuration.')
    .setVersion('1.0.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, doc));

  await app.listen(port);
  Logger.log(`API ready on http://localhost:${port}/api  ·  Swagger: http://localhost:${port}/api/docs`, 'Bootstrap');
}
bootstrap();
