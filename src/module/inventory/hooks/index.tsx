import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

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
        inventoryID: uuidv4(),
        lastUpdated: new Date().toISOString(),
      };

      await store.add(item);
      await tstore.add({
        ...item,
        transactionID: uuidv4(),
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
        lastUpdated: new Date().toISOString(),
      };

      await store.put(item).then(() => {
        tstore.put({
          transactionID: uuidv4(),
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
