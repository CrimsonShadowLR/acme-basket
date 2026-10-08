import { Catalogue } from '../../../domain/catalogue/catalogue.js';
import { ListProductsHandler } from './list-products.handler.js';

describe('ListProductsHandler', () => {
  it('returns only the fields the API promises', () => {
    const product = { code: 'A', name: 'A', price: 100, cost: 40 };
    const handler = new ListProductsHandler(new Catalogue([product]));

    expect(handler.execute()).toEqual({
      products: [{ code: 'A', name: 'A', price: 100 }],
    });
  });
});
