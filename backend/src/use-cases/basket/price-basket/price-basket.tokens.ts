/**
 * Injection tokens for the handler's interface-typed dependencies. They exist
 * only for Nest's container, so they live here rather than in the domain.
 */
export const DELIVERY_RULE = Symbol('DeliveryRule');
export const OFFERS = Symbol('Offers');
