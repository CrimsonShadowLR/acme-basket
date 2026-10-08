// NEXT_PUBLIC_ values are inlined at build time, so they must be read with
// the literal `process.env.NAME` expression.
export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
