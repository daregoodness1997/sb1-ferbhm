import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

const useProduct = () => {
  const { items, loading, error, refetch } = useFetch("products", db);
  const { items: categories } = useFetch("categories", db);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(["products"], "readwrite");
      const store = tx.objectStore("products");

      const item = {
        ...newItem,
        productID: uuidv4(),
        lastUpdated: new Date().toISOString(),
        status: "active",
        syncStatus: "pending",
      };

      await store.add(item);

      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }

  async function handleEditItem(updatedItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(["products"], "readwrite");
      const store = tx.objectStore("products");

      const item = {
        ...updatedItem,
        lastUpdated: new Date().toISOString(),
        status: "active",
        syncStatus: "pending",
      };

      await store.put(item);
      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  return { items, categories, loading, handleAddItem, handleEditItem };
};

export default useProduct;
