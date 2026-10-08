"use client";

import { useHealth } from "./hooks/useHealth";

/** Small badge that shows whether the frontend can reach the backend. */
export function ApiStatus() {
  const { isPending, isError } = useHealth();

  const { label, dot } = isPending
    ? { label: "Connecting to API", dot: "bg-amber-400" }
    : isError
      ? { label: "API unreachable", dot: "bg-red-500" }
      : { label: "API online", dot: "bg-emerald-500" };

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-600">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
      {label}
    </span>
  );
}
