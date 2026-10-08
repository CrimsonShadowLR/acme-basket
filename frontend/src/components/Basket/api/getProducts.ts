import { get } from "@/shared/httpClient";

export interface Product {
  code: string;
  name: string;
  /** Cents. */
  price: number;
}

interface ProductsResponse {
  products: Product[];
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await get<ProductsResponse>("/products");
  return products;
}
