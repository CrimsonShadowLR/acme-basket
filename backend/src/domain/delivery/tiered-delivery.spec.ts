import { TieredDelivery } from './tiered-delivery.js';

const acmeDelivery = new TieredDelivery([
  { from: 0, charge: 495 },
  { from: 5000, charge: 295 },
  { from: 9000, charge: 0 },
]);

describe('TieredDelivery', () => {
  it.each([
    [0, 495],
    [4999, 495],
    [5000, 295],
    [8999, 295],
    [9000, 0],
    [25000, 0],
  ])('a %i cent subtotal pays %i cents delivery', (subtotal, charge) => {
    expect(acmeDelivery.chargeFor(subtotal)).toBe(charge);
  });

  it('accepts tiers in any order', () => {
    const delivery = new TieredDelivery([
      { from: 9000, charge: 0 },
      { from: 0, charge: 495 },
    ]);

    expect(delivery.chargeFor(9000)).toBe(0);
    expect(delivery.chargeFor(100)).toBe(495);
  });

  it('requires a tier starting at 0', () => {
    expect(() => new TieredDelivery([{ from: 5000, charge: 295 }])).toThrow(
      'starting at 0',
    );
  });
});
