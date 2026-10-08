import { useQuery } from "@tanstack/react-query";
import { getHealth } from "../api/getHealth";

export function useHealth() {
  return useQuery({
    queryKey: ["healthcheck"],
    queryFn: getHealth,
    refetchInterval: 10_000,
    retry: false,
  });
}
