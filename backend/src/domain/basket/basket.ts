import type { Catalogue, Product } from '../catalogue/catalogue.js';
import type { DeliveryRule } from '../delivery/delivery-rule.js';
import { assertCents, type Cents } from '../money.js';
import type { Offer } from '../offers/offer.js';

export interface BasketBreakdown {
  readonly subtotal: Cents;
  readonly discount: Cents;
  readonly delivery: Cents;
  readonly total: Cents;
}

export class Basket {
  private readonly items: Product[] = [];

  constructor(
    private readonly catalogue: Catalogue,
    private readonly delivery: DeliveryRule,
    private readonly offers: readonly Offer[],
  ) {}

  /** Throws `UnknownProductError` when the code is not in the catalogue. */
  add(productCode: string): void {
    this.items.push(this.catalogue.get(productCode));
  }

  total(): Cents {
    return this.breakdown().total;
  }

  breakdown(): BasketBreakdown {
    // Read literally, an empty basket is "under $50" and pays delivery.
    // Charging delivery on nothing is wrong, so it totals zero.
    if (this.items.length === 0) {
      return { subtotal: 0, discount: 0, delivery: 0, total: 0 };
    }

    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    const offered = this.offers.reduce((sum, offer) => {
      const discount = offer.discountFor(this.items);
      assertCents(discount, `Discount from ${offer.constructor.name}`);
      return sum + discount;
    }, 0);
    const discount = Math.min(offered, subtotal);
    // Delivery is charged on the subtotal after offers. Charging it on the
    // full subtotal gives $52.37 for R01, R01 instead of the expected $54.37.
    const delivery = this.delivery.chargeFor(subtotal - discount);

    return {
      subtotal,
      discount,
      delivery,
      total: subtotal - discount + delivery,
    };
  }
}
