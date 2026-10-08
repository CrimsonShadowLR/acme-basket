import type { Product } from "../api/getProducts";
import { useBasketPrice } from "../hooks/useBasketPrice";
import { LineItems, type Line } from "./LineItems";
import { PriceBreakdown } from "./PriceBreakdown";

interface BasketPanelProps {
  items: string[];
  products: Product[];
  onAdd: (code: string) => void;
  onRemoveOne: (code: string) => void;
  onRemoveAll: (code: string) => void;
  onClear: () => void;
}

export function BasketPanel({
  items,
  products,
  onAdd,
  onRemoveOne,
  onRemoveAll,
  onClear,
}: BasketPanelProps) {
  const price = useBasketPrice(items);
  const lines = toLines(items, products);

  return (
    <section
      aria-labelledby="basket-heading"
      className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5"
    >
      <header className="flex items-center justify-between">
        <h2 id="basket-heading" className="font-semibold">
          Basket
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            Clear
          </button>
        )}
      </header>

      {lines.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          Your basket is empty. Add a widget to see the total.
        </p>
      ) : (
        <>
          <LineItems
            lines={lines}
            onAdd={onAdd}
            onRemoveOne={onRemoveOne}
            onRemoveAll={onRemoveAll}
          />
          {price.isError ? (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              Couldn&apos;t price the basket. Check that the API is running and
              try again.
            </p>
          ) : price.data ? (
            <PriceBreakdown price={price.data} isUpdating={price.isFetching} />
          ) : (
            <p className="text-sm text-zinc-500">Pricing…</p>
          )}
        </>
      )}
    </section>
  );
}

/** One line per product, in catalogue order, with how many are in the basket. */
function toLines(items: string[], products: Product[]): Line[] {
  return products
    .map((product) => ({
      product,
      quantity: items.filter((code) => code === product.code).length,
    }))
    .filter((line) => line.quantity > 0);
}
