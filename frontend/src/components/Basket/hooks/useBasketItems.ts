import { useCallback, useState } from "react";

/**
 * The basket's product codes, one entry per unit, in the order added. The
 * API keeps no baskets, so this list is the basket.
 */
export function useBasketItems() {
  const [items, setItems] = useState<string[]>([]);

  const add = useCallback((code: string) => {
    setItems((current) => [...current, code]);
  }, []);

  const removeOne = useCallback((code: string) => {
    setItems((current) => {
      const index = current.lastIndexOf(code);
      return index === -1 ? current : current.toSpliced(index, 1);
    });
  }, []);

  const removeAll = useCallback((code: string) => {
    setItems((current) => current.filter((item) => item !== code));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, removeOne, removeAll, clear };
}
