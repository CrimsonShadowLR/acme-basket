import type { INestApplication } from '@nestjs/common';
import type { AppConfig } from './config/app.config.js';

/**
 * App-wide HTTP setup. Shared by main.ts and the integration tests so both run the
 * same configuration.
 */
export function configureApp(app: INestApplication, config: AppConfig): void {
  app.enableCors({ origin: config.corsOrigins });
  app.enableShutdownHooks();
}
