import React, { useState, useEffect } from "react";
import { db } from "../../../lib/db";
const useInventory = () => {
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
    loadVendors();
  }, []);

  async function loadInventory() {
    try {
      const database = await db;
      const tx = await database.transaction("inventory", "readonly");
      const items = await tx.store.getAll();
      setItems(items);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVendors() {
    try {
      const database = await db;
      const tx = await database.transaction("vendors", "readonly");
      const vendors = await tx.store.getAll();
      setVendors(vendors);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["inventory", "transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("transactions");

      const item = {
        id: Date.now().toString(),
        ...newItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.add(item);
      await tstore.add({
        ...item,
        id: Date.now().toString(),
        itemId: item.id,
        type: "in",
        quantity: item.quantity,
        timestamp: new Date(),
        syncStatus: "synced",
      });
      await tx.done;

      await loadInventory();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }

  async function handleEditItem(updatedItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["inventory", "transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("transactions");

      const item = {
        ...updatedItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.put(item).then(() => {
        tstore.put({
          ...item,
          id: Date.now().toString(),
          itemId: item.id,
          type: "out",
          quantity: item.quantity,
          timestamp: new Date(),
          syncStatus: "synced",
        });
      });
      await tx.done;

      await loadInventory();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  return { items, vendors, loading, handleAddItem, handleEditItem };
};

export default useInventory;
