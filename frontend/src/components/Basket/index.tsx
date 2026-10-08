"use client";

import { countByCode } from "./basketItems";
import { BasketPanel } from "./components/BasketPanel";
import { ProductList } from "./components/ProductList";
import { useBasketItems } from "./hooks/useBasketItems";
import { useProducts } from "./hooks/useProducts";

/** Product list on the left, the priced basket on the right. */
export function Basket() {
  const products = useProducts();
  const basket = useBasketItems();

  if (products.isPending) {
    return <p className="text-zinc-500">Loading products…</p>;
  }
  if (products.isError) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        Couldn&apos;t load the products. Check that the API is running, then
        reload the page.
      </p>
    );
  }

  const quantities = countByCode(basket.items);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[minmax(0,1fr)_24rem]">
      <section
        aria-labelledby="products-heading"
        className="flex flex-col gap-4"
      >
        <h2 id="products-heading" className="font-semibold">
          Products
        </h2>
        <ProductList
          products={products.data}
          quantities={quantities}
          onAdd={basket.add}
        />
      </section>
      <BasketPanel
        items={basket.items}
        quantities={quantities}
        products={products.data}
        onAdd={basket.add}
        onRemoveOne={basket.removeOne}
        onRemoveAll={basket.removeAll}
        onClear={basket.clear}
      />
    </div>
  );
}
