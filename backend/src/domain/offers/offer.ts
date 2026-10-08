import type { Product } from '../catalogue/catalogue.js';
import type { Cents } from '../money.js';

/**
 * A special offer. Each offer looks at the basket's items and returns its own
 * discount. Offers don't see each other's discounts; the basket adds them up.
 */
export interface Offer {
  discountFor(items: readonly Product[]): Cents;
}

/** Injection token for the list of active offers. */
export const OFFERS = Symbol('Offers');
