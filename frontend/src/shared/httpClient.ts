import { apiBaseUrl } from "./env";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`Request failed with status ${status}`);
  }
}

/** A 2xx response whose body wasn't JSON. Every endpoint we call returns JSON. */
export class InvalidResponseError extends Error {
  constructor(readonly status: number) {
    super(`Expected a JSON body, got none (status ${status})`);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, init);
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) throw new HttpError(response.status, body);
  if (body === null) throw new InvalidResponseError(response.status);
  // The one deliberate cast: response shapes are declared per endpoint and
  // trusted, rather than validated at runtime.
  return body as T;
}

export function get<T>(path: string): Promise<T> {
  // No Content-Type on GET: it would turn a CORS "simple request" into one
  // that needs a preflight OPTIONS call first.
  return request<T>(path);
}

export function post<T, B>(path: string, body: B): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
