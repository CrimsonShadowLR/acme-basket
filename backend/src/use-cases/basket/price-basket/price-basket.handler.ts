import { Inject, Injectable } from '@nestjs/common';
import { Basket } from '../../../domain/basket/basket.js';
import { Catalogue } from '../../../domain/catalogue/catalogue.js';
import type { DeliveryRule } from '../../../domain/delivery/delivery-rule.js';
import type { Offer } from '../../../domain/offers/offer.js';
import type { Handler } from '../../shared/handler.js';
import type { PriceBasketRequest } from './price-basket.request.js';
import type { PriceBasketResponse } from './price-basket.response.js';
import { DELIVERY_RULE, OFFERS } from './price-basket.tokens.js';

/**
 * Builds a basket from the requested codes and prices it. The API is
 * stateless: the client sends the whole basket each time.
 */
@Injectable()
export class PriceBasketHandler implements Handler<
  PriceBasketRequest,
  PriceBasketResponse
> {
  constructor(
    @Inject(Catalogue) private readonly catalogue: Catalogue,
    @Inject(DELIVERY_RULE) private readonly delivery: DeliveryRule,
    @Inject(OFFERS) private readonly offers: readonly Offer[],
  ) {}

  execute(request: PriceBasketRequest): PriceBasketResponse {
    const basket = new Basket(this.catalogue, this.delivery, this.offers);
    request.items.forEach((code) => basket.add(code));
    // Pick the fields explicitly: a spread would let any field added to
    // BasketBreakdown later leak into the API unnoticed.
    const { subtotal, discount, delivery, total } = basket.breakdown();
    return { subtotal, discount, delivery, total };
  }
}
