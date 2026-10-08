import { Module } from '@nestjs/common';
import { BasketController } from '../controllers/basket.controller.js';
import { DELIVERY_RULE } from '../domain/delivery/delivery-rule.js';
import { TieredDelivery } from '../domain/delivery/tiered-delivery.js';
import { OFFERS } from '../domain/offers/offer.js';
import {
  acmeDeliveryTiers,
  acmeOffers,
} from '../infrastructure/acme-pricing.js';
import { PriceBasketHandler } from '../use-cases/basket/price-basket/price-basket.handler.js';
import { CatalogueModule } from './catalogue.module.js';

@Module({
  imports: [CatalogueModule],
  controllers: [BasketController],
  providers: [
    {
      provide: DELIVERY_RULE,
      useFactory: () => new TieredDelivery(acmeDeliveryTiers),
    },
    { provide: OFFERS, useFactory: acmeOffers },
    PriceBasketHandler,
  ],
})
export class BasketModule {}
