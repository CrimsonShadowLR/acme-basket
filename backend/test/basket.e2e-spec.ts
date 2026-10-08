import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap.js';
import { loadAppConfig } from '../src/config/app.config.js';

describe('Basket API', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    configureApp(app, loadAppConfig({}));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('lists the Acme catalogue in cents', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect({
          products: [
            { code: 'R01', name: 'Red Widget', price: 3295 },
            { code: 'G01', name: 'Green Widget', price: 2495 },
            { code: 'B01', name: 'Blue Widget', price: 795 },
          ],
        });
    });
  });

  describe('POST /basket/total', () => {
    it.each([
      [['B01', 'G01'], 3785],
      [['R01', 'R01'], 5437],
      [['R01', 'G01'], 6085],
      [['B01', 'B01', 'R01', 'R01', 'R01'], 9827],
    ])('totals %j at %i cents', async (items, total) => {
      const response = await request(app.getHttpServer())
        .post('/basket/total')
        .send({ items })
        .expect(200);

      expect(response.body.total).toBe(total);
    });

    it('returns the breakdown', () => {
      return request(app.getHttpServer())
        .post('/basket/total')
        .send({ items: ['R01', 'R01'] })
        .expect(200)
        .expect({ subtotal: 6590, discount: 1648, delivery: 495, total: 5437 });
    });

    it('rejects an unknown product code with 422', () => {
      return request(app.getHttpServer())
        .post('/basket/total')
        .send({ items: ['R01', 'X99'] })
        .expect(422)
        .expect((response) => {
          expect(response.body.code).toBe('X99');
        });
    });

    it.each([
      ['no body', undefined],
      ['items missing', {}],
      ['items not an array', { items: 'R01' }],
      ['a code that is not a string', { items: ['R01', 1] }],
    ])('rejects %s with 400', async (_case, body) => {
      await request(app.getHttpServer())
        .post('/basket/total')
        .send(body)
        .expect(400);
    });

    it('rejects an oversized basket with 400', () => {
      return request(app.getHttpServer())
        .post('/basket/total')
        .send({ items: Array.from({ length: 1001 }, () => 'B01') })
        .expect(400);
    });
  });
});
