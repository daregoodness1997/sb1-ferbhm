import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

const useProduct = () => {
  const { items, loading, error, refetch } = useFetch("locations", db);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(["locations"], "readwrite");
      const store = tx.objectStore("locations");

      const item = {
        ...newItem,
        locationID: uuidv4(),
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
      const tx = database.transaction(["locations"], "readwrite");
      const store = tx.objectStore("locations");

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

  return { items, loading, handleAddItem, handleEditItem };
};

export default useProduct;
