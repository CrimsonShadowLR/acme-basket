import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: Infinity,
    // One retry, so a stopped API shows an error in about a second, not seven.
    retry: 1,
  });
}
