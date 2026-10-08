import { Catalogue } from '../../../domain/catalogue/catalogue.js';
import type { DeliveryRule } from '../../../domain/delivery/delivery-rule.js';
import type { Offer } from '../../../domain/offers/offer.js';
import { PriceBasketHandler } from './price-basket.handler.js';

const catalogue = new Catalogue([
  { code: 'A', name: 'A', price: 1000 },
  { code: 'B', name: 'B', price: 500 },
]);
const flatDelivery: DeliveryRule = { chargeFor: () => 300 };
const twoOff: Offer = { discountFor: () => 200 };

describe('PriceBasketHandler', () => {
  it('prices the requested codes with the injected rules', () => {
    const handler = new PriceBasketHandler(catalogue, flatDelivery, [twoOff]);

    expect(handler.execute({ items: ['A', 'B', 'B'] })).toEqual({
      subtotal: 2000,
      discount: 200,
      delivery: 300,
      total: 2100,
    });
  });

  it('starts from an empty basket on every call', () => {
    const handler = new PriceBasketHandler(catalogue, flatDelivery, []);
    handler.execute({ items: ['A'] });

    expect(handler.execute({ items: ['B'] }).subtotal).toBe(500);
  });
});
