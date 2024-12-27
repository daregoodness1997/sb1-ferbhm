import { useState, useEffect } from "react";

function useFetch<T>(storeName: string, db: Promise<IDBDatabase>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const database = await db;
      const tx = await database.transaction(storeName, "readonly");
      const items = await tx.store.getAll();
      setItems(items);
    } catch (error) {
      console.error(`Failed to load items from ${storeName}:`, error);
      setError(`Failed to load items from ${storeName}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [storeName, db]); // Fetch items when storeName or db changes

  return { items, loading, error, refetch: fetchItems };
}

export default useFetch;
