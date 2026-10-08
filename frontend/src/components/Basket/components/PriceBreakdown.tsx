import { formatMoney } from "@/shared/formatMoney";
import type { BasketPrice } from "../api/priceBasket";

export function PriceBreakdown({
  price,
  isUpdating,
}: {
  price: BasketPrice;
  isUpdating: boolean;
}) {
  return (
    <dl
      className={`flex flex-col gap-2 text-sm transition-opacity ${isUpdating ? "opacity-60" : ""}`}
      aria-busy={isUpdating}
    >
      <Row label="Subtotal" value={formatMoney(price.subtotal)} />
      {price.discount > 0 && (
        <Row
          label="Offers"
          value={`−${formatMoney(price.discount)}`}
          valueClass="text-emerald-600"
        />
      )}
      <Row
        label="Delivery"
        value={price.delivery === 0 ? "Free" : formatMoney(price.delivery)}
      />
      <div className="mt-2 flex items-baseline justify-between border-t border-zinc-200 pt-3">
        <dt className="font-medium">Total</dt>
        <dd className="text-xl font-semibold tabular-nums">
          {formatMoney(price.total)}
        </dd>
      </div>
    </dl>
  );
}

function Row({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <dt className="text-zinc-500">{label}</dt>
      <dd className={`tabular-nums ${valueClass}`}>{value}</dd>
    </div>
  );
}
