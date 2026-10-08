const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** The API speaks integer cents; this is the only place they become dollars. */
export function formatMoney(cents: number): string {
  return dollars.format(cents / 100);
}
