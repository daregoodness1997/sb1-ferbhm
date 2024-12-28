import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

const useInventory = () => {
  const { items, loading, error, refetch } = useFetch("inventory", db);
  const { items: products } = useFetch("products", db);
  const { items: categories } = useFetch("categories", db);
  const { items: inventory } = useFetch("inventory", db);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(
        ["inventory", "inventory_transactions", "activities"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("inventory_transactions");
      const aStore = tx.objectStore("activities");

      const existingItem = inventory.find(
        (item) => item.productID === newItem.productID
      );

      if (existingItem) {
        existingItem.quantity = Number(newItem.quantity)
          ? Number(existingItem.quantity) + Number(newItem.quantity)
          : Number(existingItem.quantity) || 0;
        existingItem.minQuantity = newItem.minQuantity
          ? newItem.minQuantity
          : existingItem.minQuantity;
        await store.put(existingItem);
        await tstore.add({
          transactionID: uuidv4(),
          inventoryID: existingItem.inventoryID,
          productID: existingItem.productID,
          quantity: existingItem.quantity,
          lastUpdated: new Date(),
          createdAt: new Date(),
          syncStatus: "synced",
          type: "purchase",
        });
        const activity = {
          locationID: "",
          activityID: uuidv4(),
          actionType: "inventory update",
          createdAt: new Date(),
          actionedBy: "",
          syncStatus: "pending",
        };
        await aStore.add(activity);
      } else {
        const item = {
          ...newItem,
          inventoryID: uuidv4(),
          lastUpdated: new Date().toISOString(),
        };

        await store.add(item);
        const activity = {
          locationID: "",
          activityID: uuidv4(),
          actionType: "inventory addition",
          createdAt: new Date(),
          actionedBy: "",
          syncStatus: "pending",
        };
        await aStore.add(activity);

        await tstore.add({
          ...item,
          transactionID: uuidv4(),
          inventoryID: item.id,
          type: "purchase",
          quantity: item.quantity,
          lastUpdated: new Date(),
          createdAt: new Date(),
          syncStatus: "synced",
        });
      }

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

  return {
    items,
    products,
    categories,
    loading,
    handleAddItem,
    handleEditItem,
  };
};

export default useInventory;
