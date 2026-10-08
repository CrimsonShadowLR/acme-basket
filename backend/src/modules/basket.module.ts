import { Module } from '@nestjs/common';
import { BasketController } from '../controllers/basket.controller.js';
import { TieredDelivery } from '../domain/delivery/tiered-delivery.js';
import {
  acmeDeliveryTiers,
  acmeOffers,
} from '../infrastructure/acme-pricing.js';
import { PriceBasketHandler } from '../use-cases/basket/price-basket/price-basket.handler.js';
import {
  DELIVERY_RULE,
  OFFERS,
} from '../use-cases/basket/price-basket/price-basket.tokens.js';
import { CatalogueModule } from './catalogue.module.js';

@Module({
  imports: [CatalogueModule],
  controllers: [BasketController],
  providers: [
    {
      provide: DELIVERY_RULE,
      useFactory: () => new TieredDelivery(acmeDeliveryTiers),
    },
    { provide: OFFERS, useValue: acmeOffers },
    PriceBasketHandler,
  ],
})
export class BasketModule {}
