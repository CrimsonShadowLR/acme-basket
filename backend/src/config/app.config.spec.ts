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

  it('treats empty values as unset', () => {
    expect(loadAppConfig({ PORT: '', CORS_ORIGINS: ' ' })).toEqual({
      port: 8000,
      corsOrigins: ['http://localhost:3000'],
    });
  });

  it.each(['abc', '0', '-1', '65536', '80.5'])('rejects PORT=%s', (port) => {
    expect(() => loadAppConfig({ PORT: port })).toThrow(
      'PORT must be an integer between 1 and 65535',
    );
  });

  it('rejects a CORS_ORIGINS list with no origins in it', () => {
    expect(() => loadAppConfig({ CORS_ORIGINS: ' , ' })).toThrow(
      'CORS_ORIGINS has no origins',
    );
  });
});
