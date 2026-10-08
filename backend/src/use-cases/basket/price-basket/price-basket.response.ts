/** All amounts are in cents. */
export interface PriceBasketResponse {
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
}
