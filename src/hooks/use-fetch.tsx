import { useState, useEffect } from "react";

function useFetch<T>(
  storeName: string,
  db: Promise<IDBDatabase>,
  filters?: { [key: string]: any },
  sort?: (a: T, b: T) => number
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const database = await db;
      const tx = await database.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const items = await store.getAll();
      const filteredItems = items.filter((item) => {
        if (!filters) return true;
        for (const key in filters) {
          if (item[key] !== filters[key]) return false;
        }
        return true;
      });
      const sortedItems = filteredItems.sort(
        sort ||
          ((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      );
      setItems(sortedItems);
    } catch (error) {
      console.error(`Failed to load items from ${storeName}:`, error);
      setError(`Failed to load items from ${storeName}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [storeName, db, filters, sort]); // Fetch items when storeName, db, filters, or sort changes

  return { items, loading, error, refetch: fetchItems };
}

export default useFetch;
