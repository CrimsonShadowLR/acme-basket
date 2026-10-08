import { BuyOneGetSecondHalfPrice } from './buy-one-get-second-half-price.js';

const red = { code: 'R01', name: 'Red Widget', price: 3295 };
const green = { code: 'G01', name: 'Green Widget', price: 2495 };
const redOffer = new BuyOneGetSecondHalfPrice('R01');

describe('BuyOneGetSecondHalfPrice', () => {
  it('gives nothing for a single red', () => {
    expect(redOffer.discountFor([red])).toBe(0);
  });

  it('takes half off the second red, rounding the half cent to the customer', () => {
    expect(redOffer.discountFor([red, red])).toBe(1648);
  });

  it('discounts once for three reds', () => {
    expect(redOffer.discountFor([red, red, red])).toBe(1648);
  });

  it('discounts every pair', () => {
    expect(redOffer.discountFor([red, red, red, red])).toBe(2 * 1648);
  });

  it('ignores other products', () => {
    expect(redOffer.discountFor([green, green, red])).toBe(0);
  });
});
