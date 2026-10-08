import { get } from "@/shared/httpClient";

export interface Health {
  status: "ok";
}

export function getHealth(): Promise<Health> {
  return get<Health>("/healthcheck");
}
