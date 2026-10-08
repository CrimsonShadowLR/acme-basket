import type { Cents } from '../money.js';

export interface Product {
  readonly code: string;
  readonly name: string;
  readonly price: Cents;
}

export class UnknownProductError extends Error {
  constructor(readonly code: string) {
    super(`Unknown product code: ${code}`);
    this.name = 'UnknownProductError';
  }
}

/** The products a basket can hold, looked up by code. */
export class Catalogue {
  private readonly byCode: ReadonlyMap<string, Product>;

  constructor(products: readonly Product[]) {
    const byCode = new Map<string, Product>();
    for (const product of products) {
      if (byCode.has(product.code)) {
        throw new Error(`Duplicate product code: ${product.code}`);
      }
      byCode.set(product.code, product);
    }
    this.byCode = byCode;
  }

  get(code: string): Product {
    const product = this.byCode.get(code);
    if (!product) throw new UnknownProductError(code);
    return product;
  }

  all(): Product[] {
    return [...this.byCode.values()];
  }
}
