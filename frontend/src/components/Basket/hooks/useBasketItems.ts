import { useCallback, useState } from "react";
import { addItem, removeAllItems, removeOneItem } from "../basketItems";

/** The basket's item list, with the operations the UI needs. */
export function useBasketItems() {
  const [items, setItems] = useState<string[]>([]);

  const add = useCallback((code: string) => {
    setItems((current) => addItem(current, code));
  }, []);

  const removeOne = useCallback((code: string) => {
    setItems((current) => removeOneItem(current, code));
  }, []);

  const removeAll = useCallback((code: string) => {
    setItems((current) => removeAllItems(current, code));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  return { items, add, removeOne, removeAll, clear };
}
