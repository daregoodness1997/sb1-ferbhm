import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

const useProduct = () => {
  const { items, loading, error, refetch } = useFetch("products", db);
  const { items: categories } = useFetch("categories", db);

  const locationID = localStorage.getItem("locationID") || "";

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(["products", "activities"], "readwrite");
      const store = tx.objectStore("products");
      const aStore = tx.objectStore("activities");

      const item = {
        ...newItem,
        productID: uuidv4(),
        lastUpdated: new Date().toISOString(),
        status: "active",
        syncStatus: "pending",
      };

      const activity = {
        locationID: locationID,
        activityID: uuidv4(),
        actionType: "product addition",
        createdAt: new Date(),
        actionedBy: "",
        syncStatus: "pending",
      };

      await store.add(item);
      await aStore.add(activity);

      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }

  async function handleEditItem(updatedItem: any, id: string) {
    try {
      const database = await db;
      const tx = database.transaction(["products", "activities"], "readwrite");
      const store = tx.objectStore("products");
      const aStore = tx.objectStore("activities");

      const item = {
        ...updatedItem,
        productID: id,
        lastUpdated: new Date().toISOString(),
        status: "active",
        syncStatus: "pending" as "pending" | "synced" | "error",
      };

      console.log(item, "form items");

      const activity = {
        locationID: locationID,
        activityID: uuidv4(),
        actionType: "product editing",
        createdAt: new Date(),
        actionedBy: "",
        syncStatus: "pending" as "pending" | "synced" | "error",
      };

      await store.put(item);
      await aStore.add(activity);

      await tx.done;

      await refetch();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  return { items, categories, loading, handleAddItem, handleEditItem };
};

export default useProduct;
