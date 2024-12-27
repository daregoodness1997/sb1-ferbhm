import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
const useInventory = () => {
  const { items, loading, error, refetch } = useFetch("inventory", db);
  const { items: vendors } = useFetch("inventory", db);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(
        ["inventory", "inventory_transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("inventory_transactions");

      const item = {
        ...newItem,
        inventoryID: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      await store.add(item);
      await tstore.add({
        ...item,
        transactionID: Date.now().toString(),
        inventoryID: item.id,
        type: "purchase",
        quantity: item.quantity,
        lastUpdated: new Date(),
        createdAt: new Date(),
        syncStatus: "synced",
        productID: "",
      });
      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }

  async function handleEditItem(updatedItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["inventory", "inventory_transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("inventory_transactions");

      const item = {
        ...updatedItem,
        inventoryID: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      await store.put(item).then(() => {
        tstore.put({
          transactionID: Date.now().toString(),
          inventoryID: item.id,
          type: "purchase",
          quantity: item.quantity,
          lastUpdated: new Date(),
          createdAt: new Date(),
          syncStatus: "synced",
          productID: "",
        });
      });
      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  return { items, vendors, loading, handleAddItem, handleEditItem };
};

export default useInventory;
