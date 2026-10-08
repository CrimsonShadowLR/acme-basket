import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from '../src/app.module.js';
import { configureApp } from '../src/bootstrap.js';
import { loadAppConfig } from '../src/config/app.config.js';

describe('GET /healthcheck', () => {
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

  it('reports the service as up', () => {
    return request(app.getHttpServer())
      .get('/healthcheck')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
