import type { Product } from '../domain/catalogue/catalogue.js';
import type { DeliveryTier } from '../domain/delivery/tiered-delivery.js';
import { BuyOneGetSecondHalfPrice } from '../domain/offers/buy-one-get-second-half-price.js';
import type { Offer } from '../domain/offers/offer.js';

/**
 * Acme Widget Co's products, delivery charges and offers, as given in the
 * brief. Prices are in cents. A database or pricing service would replace
 * this file and the factories in modules/ that read it.
 */
export const acmeProducts: readonly Product[] = [
  { code: 'R01', name: 'Red Widget', price: 3295 },
  { code: 'G01', name: 'Green Widget', price: 2495 },
  { code: 'B01', name: 'Blue Widget', price: 795 },
];

export const acmeDeliveryTiers: readonly DeliveryTier[] = [
  { from: 0, charge: 495 },
  { from: 5000, charge: 295 },
  { from: 9000, charge: 0 },
];

export const acmeOffers: readonly Offer[] = [
  new BuyOneGetSecondHalfPrice('R01'),
];
