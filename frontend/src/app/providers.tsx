"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HttpError } from "@/shared/httpClient";

/**
 * Retry once, and never on a 4xx: a 400 or 422 gives the same answer every
 * time. React Query's default of three retries with backoff kept a stale
 * total on screen for about seven seconds when the API went down.
 */
function shouldRetry(failureCount: number, error: Error): boolean {
  if (error instanceof HttpError && error.status < 500) return false;
  return failureCount < 1;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: shouldRetry } },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  // A fresh client per server render keeps requests isolated; the browser
  // reuses one so the cache survives re-renders.
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  );
}
