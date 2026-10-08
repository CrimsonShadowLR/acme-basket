import { formatMoney } from "@/shared/formatMoney";
import type { Product } from "../api/getProducts";
import { ProductSwatch } from "./ProductSwatch";

interface ProductListProps {
  products: Product[];
  quantities: ReadonlyMap<string, number>;
  onAdd: (code: string) => void;
}

export function ProductList({ products, quantities, onAdd }: ProductListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {products.map((product) => {
        const quantity = quantities.get(product.code) ?? 0;
        return (
          <li
            key={product.code}
            className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <ProductSwatch code={product.code} />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="font-medium">{product.name}</span>
              <span className="text-sm text-zinc-500">
                {product.code} · {formatMoney(product.price)}
              </span>
            </div>
            {quantity > 0 && (
              <span className="hidden text-sm text-zinc-500 sm:inline">
                {quantity} in basket
              </span>
            )}
            <button
              type="button"
              onClick={() => onAdd(product.code)}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
              aria-label={`Add ${product.name}`}
            >
              Add
            </button>
          </li>
        );
      })}
    </ul>
  );
}
