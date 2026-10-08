import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { createApp } from './create-app.js';

describe('GET /healthcheck', () => {
  let app: INestApplication<App>;

  // The app keeps no state between requests (ADR-005), so one instance
  // serves the whole file.
  beforeAll(async () => {
    app = await createApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('reports the service as up', () => {
    return request(app.getHttpServer())
      .get('/healthcheck')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
