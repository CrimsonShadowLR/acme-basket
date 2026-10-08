/** An amount of money in integer cents. Dollars only exist at the edges. */
export type Cents = number;

/**
 * Money comes from our own pricing data and offers, so a value that isn't
 * a whole, non-negative number of cents is a programming error. Failing here
 * stops it turning into a float total that the UI would format as valid.
 */
export function assertCents(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      `${label} must be a whole, non-negative number of cents, got ${value}`,
    );
  }
}
