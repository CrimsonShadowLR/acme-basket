import { Catalogue, UnknownProductError } from '../catalogue/catalogue.js';
import { TieredDelivery } from '../delivery/tiered-delivery.js';
import { BuyOneGetSecondHalfPrice } from '../offers/buy-one-get-second-half-price.js';
import type { Offer } from '../offers/offer.js';
import { Basket } from './basket.js';

const catalogue = new Catalogue([
  { code: 'R01', name: 'Red Widget', price: 3295 },
  { code: 'G01', name: 'Green Widget', price: 2495 },
  { code: 'B01', name: 'Blue Widget', price: 795 },
]);

const delivery = new TieredDelivery([
  { from: 0, charge: 495 },
  { from: 5000, charge: 295 },
  { from: 9000, charge: 0 },
]);

function basketWith(
  codes: string[],
  offers: Offer[] = [new BuyOneGetSecondHalfPrice('R01')],
): Basket {
  const basket = new Basket(catalogue, delivery, offers);
  codes.forEach((code) => basket.add(code));
  return basket;
}

describe('Basket', () => {
  describe('example totals from the brief', () => {
    it.each([
      [['B01', 'G01'], 3785],
      [['R01', 'R01'], 5437],
      [['R01', 'G01'], 6085],
      [['B01', 'B01', 'R01', 'R01', 'R01'], 9827],
    ])('%j totals %i cents', (codes, total) => {
      expect(basketWith(codes).total()).toBe(total);
    });
  });

  it('totals zero when empty, with no delivery', () => {
    expect(basketWith([]).breakdown()).toEqual({
      subtotal: 0,
      discount: 0,
      delivery: 0,
      total: 0,
    });
  });

  it('charges delivery on the subtotal after offers', () => {
    // 6590 before the offer would pay 295; 4942 after it pays 495.
    expect(basketWith(['R01', 'R01']).breakdown()).toEqual({
      subtotal: 6590,
      discount: 1648,
      delivery: 495,
      total: 5437,
    });
  });

  it('ships free from $90', () => {
    // 4 × 2495 = 9980.
    expect(basketWith(['G01', 'G01', 'G01', 'G01']).breakdown().delivery).toBe(
      0,
    );
  });

  it('applies the red offer to every pair', () => {
    // 2 × (3295 + 1647) = 9884, free delivery.
    expect(basketWith(['R01', 'R01', 'R01', 'R01']).total()).toBe(9884);
  });

  it('works with no offers', () => {
    expect(basketWith(['R01', 'R01'], []).total()).toBe(6590 + 295);
  });

  it('adds up the discounts of several offers', () => {
    const tenOff: Offer = { discountFor: () => 1000 };

    expect(
      basketWith(
        ['R01', 'R01'],
        [new BuyOneGetSecondHalfPrice('R01'), tenOff],
      ).breakdown().discount,
    ).toBe(2648);
  });

  it('never discounts more than the subtotal', () => {
    const everything: Offer = { discountFor: () => 1_000_000 };

    expect(basketWith(['B01'], [everything]).breakdown()).toEqual({
      subtotal: 795,
      discount: 795,
      delivery: 495,
      total: 495,
    });
  });

  it('rejects an unknown product code', () => {
    const basket = basketWith([]);

    expect(() => basket.add('X99')).toThrow(UnknownProductError);
  });
});
