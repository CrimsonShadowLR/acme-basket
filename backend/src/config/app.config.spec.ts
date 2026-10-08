import { loadAppConfig } from './app.config.js';

describe('loadAppConfig', () => {
  it('falls back to local-dev defaults', () => {
    expect(loadAppConfig({})).toEqual({
      port: 8000,
      corsOrigins: ['http://localhost:3000'],
    });
  });

  it('reads PORT and a comma-separated CORS_ORIGINS list', () => {
    const config = loadAppConfig({
      PORT: '4000',
      CORS_ORIGINS: 'http://a.test, http://b.test',
    });

    expect(config).toEqual({
      port: 4000,
      corsOrigins: ['http://a.test', 'http://b.test'],
    });
  });
});
