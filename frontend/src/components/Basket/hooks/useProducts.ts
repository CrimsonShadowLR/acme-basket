import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/getProducts";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: Infinity,
  });
}
