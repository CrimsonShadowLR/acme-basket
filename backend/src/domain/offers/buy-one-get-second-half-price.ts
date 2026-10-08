import type { Product } from '../catalogue/catalogue.js';
import type { Cents } from '../money.js';
import type { Offer } from './offer.js';

/** Every second unit of one product costs half price. */
export class BuyOneGetSecondHalfPrice implements Offer {
  constructor(private readonly productCode: string) {}

  discountFor(items: readonly Product[]): Cents {
    const matching = items.filter((item) => item.code === this.productCode);
    const pairs = Math.floor(matching.length / 2);
    if (pairs === 0) return 0;

    // Catalogue holds one price per code, so every matching unit costs the same.
    const price = matching[0].price;
    // The half-price unit rounds down, so the half cent goes to the customer:
    // R01 at 3295 cents costs 1647 the second time, which gives the expected
    // $54.37 for R01, R01.
    const halfPrice = Math.floor(price / 2);
    return pairs * (price - halfPrice);
  }
}
