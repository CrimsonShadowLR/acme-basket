import { post } from "@/shared/httpClient";

/** All amounts are in cents. */
export interface BasketPrice {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}

interface PriceBasketRequest {
  items: string[];
}

export function priceBasket(items: string[]): Promise<BasketPrice> {
  return post<BasketPrice, PriceBasketRequest>("/basket/total", { items });
}
