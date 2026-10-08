import { formatMoney } from "@/shared/formatMoney";
import type { Product } from "../api/getProducts";
import { ProductSwatch } from "./ProductSwatch";

export interface Line {
  product: Product;
  quantity: number;
}

interface LineItemsProps {
  lines: Line[];
  onAdd: (code: string) => void;
  onRemoveOne: (code: string) => void;
  onRemoveAll: (code: string) => void;
}

const stepper =
  "flex h-7 w-7 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-100";

export function LineItems({
  lines,
  onAdd,
  onRemoveOne,
  onRemoveAll,
}: LineItemsProps) {
  return (
    <ul className="flex flex-col divide-y divide-zinc-100">
      {lines.map(({ product, quantity }) => (
        <li key={product.code} className="flex items-center gap-3 py-3">
          <ProductSwatch code={product.code} size="sm" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-medium">{product.name}</span>
            <button
              type="button"
              onClick={() => onRemoveAll(product.code)}
              className="self-start text-xs text-zinc-500 hover:text-red-600"
            >
              Remove
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onRemoveOne(product.code)}
              className={stepper}
              aria-label={`One less ${product.name}`}
            >
              −
            </button>
            <span className="w-5 text-center text-sm tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onAdd(product.code)}
              className={stepper}
              aria-label={`One more ${product.name}`}
            >
              +
            </button>
          </div>
          <span className="w-20 text-right text-sm tabular-nums">
            {formatMoney(product.price * quantity)}
          </span>
        </li>
      ))}
    </ul>
  );
}
