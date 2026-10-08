import type { Cents } from '../money.js';
import type { DeliveryRule } from './delivery-rule.js';

export interface DeliveryTier {
  /** Lowest subtotal this tier applies to, inclusive. */
  readonly from: Cents;
  readonly charge: Cents;
}

/** Delivery gets cheaper as the subtotal grows. The highest matching tier wins. */
export class TieredDelivery implements DeliveryRule {
  private readonly tiers: readonly DeliveryTier[];

  constructor(tiers: readonly DeliveryTier[]) {
    this.tiers = [...tiers].sort((a, b) => b.from - a.from);
    if (!this.tiers.some((tier) => tier.from === 0)) {
      throw new Error('Delivery tiers must include one starting at 0');
    }
  }

  chargeFor(subtotal: Cents): Cents {
    // The constructor guarantees a tier from 0, so a match always exists.
    return this.tiers.find((tier) => subtotal >= tier.from)!.charge;
  }
}
