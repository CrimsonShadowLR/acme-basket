import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { priceBasket } from "../api/priceBasket";

/** Prices the whole basket on the server whenever its items change. */
export function useBasketPrice(items: string[]) {
  return useQuery({
    queryKey: ["basket-total", items],
    queryFn: () => priceBasket(items),
    // The panel shows an empty state instead of a $0.00 breakdown.
    enabled: items.length > 0,
    // Keep showing the last total while the next one loads, so the numbers
    // don't flash empty on every click.
    placeholderData: keepPreviousData,
  });
}
