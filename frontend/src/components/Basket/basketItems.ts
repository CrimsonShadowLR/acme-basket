/**
 * The basket as the UI holds it: product codes, one entry per unit, in the
 * order added. The API keeps no baskets, so this list is the basket. These
 * are plain functions so they can be tested without React.
 */

export function addItem(items: string[], code: string): string[] {
  return [...items, code];
}

/**
 * Removes the most recently added unit of `code`. Returns the same list if
 * there is none, so React skips the re-render.
 */
export function removeOneItem(items: string[], code: string): string[] {
  const index = items.lastIndexOf(code);
  // filter rather than toSpliced: toSpliced needs Firefox 115, and Next
  // supports browsers back to Firefox 111.
  return index === -1 ? items : items.filter((_, i) => i !== index);
}

export function removeAllItems(items: string[], code: string): string[] {
  return items.filter((item) => item !== code);
}

export function countByCode(items: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const code of items) {
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return counts;
}
