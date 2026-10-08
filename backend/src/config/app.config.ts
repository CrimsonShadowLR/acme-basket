/** Runtime settings read from the environment, with local-dev defaults. */
export interface AppConfig {
  port: number;
  corsOrigins: string[];
}

export function loadAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: parsePort(valueOf(env.PORT) ?? '8000'),
    corsOrigins: parseOrigins(
      valueOf(env.CORS_ORIGINS) ?? 'http://localhost:3000',
    ),
  };
}

/** `PORT=` in a .env file means "not set", not "port 0". */
function valueOf(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  return value ? value : undefined;
}

function parsePort(raw: string): number {
  const port = Number(raw);
  // Port 0 would make Node pick a random port while the healthcheck polls
  // the expected one, so it is rejected along with anything non-numeric.
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      `PORT must be an integer between 1 and 65535, got "${raw}"`,
    );
  }
  return port;
}

function parseOrigins(raw: string): string[] {
  const origins = raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) {
    throw new Error(`CORS_ORIGINS has no origins in it, got "${raw}"`);
  }
  return origins;
}
