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

  it('lists every product', () => {
    expect(new Catalogue([red, blue]).all()).toEqual([red, blue]);
  });
});
