import { Module } from '@nestjs/common';
import { BasketModule } from './modules/basket.module.js';
import { CatalogueModule } from './modules/catalogue.module.js';
import { HealthModule } from './modules/health.module.js';

/** Root module. Only imports feature modules; each one owns its own wiring. */
@Module({
  imports: [HealthModule, CatalogueModule, BasketModule],
})
export class AppModule {}
