import type { Cents } from '../money.js';

/** Works out the delivery charge from the subtotal after offers. */
export interface DeliveryRule {
  chargeFor(subtotal: Cents): Cents;
}

export const DELIVERY_RULE = Symbol('DeliveryRule');
