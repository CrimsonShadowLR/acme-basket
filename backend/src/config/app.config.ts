/** Runtime settings read from the environment, with local-dev defaults. */
export interface AppConfig {
  port: number;
  corsOrigins: string[];
}

export function loadAppConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  return {
    port: Number(env.PORT ?? 8000),
    corsOrigins: (env.CORS_ORIGINS ?? 'http://localhost:3000')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
}
