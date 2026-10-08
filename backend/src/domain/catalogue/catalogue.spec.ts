import { Catalogue, UnknownProductError } from './catalogue.js';

const red = { code: 'R01', name: 'Red Widget', price: 3295 };
const blue = { code: 'B01', name: 'Blue Widget', price: 795 };

describe('Catalogue', () => {
  it('finds a product by code', () => {
    expect(new Catalogue([red, blue]).get('B01')).toEqual(blue);
  });

  it('rejects an unknown code', () => {
    expect(() => new Catalogue([red]).get('X99')).toThrow(UnknownProductError);
  });

  it('rejects duplicate codes', () => {
    expect(() => new Catalogue([red, red])).toThrow('Duplicate product code');
  });

  it('rejects a price that is not whole cents', () => {
    expect(() => new Catalogue([{ ...red, price: 32.95 }])).toThrow(
      'Price of R01 must be a whole, non-negative number of cents',
    );
  });

  it('lists every product', () => {
    expect(new Catalogue([red, blue]).all()).toEqual([red, blue]);
  });
});
