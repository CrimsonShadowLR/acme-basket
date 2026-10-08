import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health.module.js';

/** Root module. Only imports feature modules; each one owns its own wiring. */
@Module({
  imports: [HealthModule],
})
export class AppModule {}
