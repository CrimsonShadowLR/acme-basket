import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { configureApp } from './bootstrap.js';
import { loadAppConfig } from './config/app.config.js';

async function bootstrap() {
  const config = loadAppConfig();
  const app = await NestFactory.create(AppModule);
  configureApp(app, config);
  await app.listen(config.port);
}
await bootstrap();
