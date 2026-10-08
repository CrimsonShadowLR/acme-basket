export interface ProductResponse {
  code: string;
  name: string;
  /** Cents. */
  price: number;
}

export interface ListProductsResponse {
  products: ProductResponse[];
}
