import { assertCents } from './money.js';

describe('assertCents', () => {
  it.each([0, 1, 3295])('accepts %d', (value) => {
    expect(() => assertCents(value, 'Price')).not.toThrow();
  });

  it.each([32.95, -1, NaN, Infinity, 2 ** 53])('rejects %d', (value) => {
    expect(() => assertCents(value, 'Price')).toThrow(
      'Price must be a whole, non-negative number of cents',
    );
  });
});
