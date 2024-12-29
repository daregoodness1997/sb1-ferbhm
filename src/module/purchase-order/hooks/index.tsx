import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import shortid from "shortid";

const usePurchaseOrder = () => {
  const { items, loading, error, refetch } = useFetch("purchase_orders", db);
  const { items: vendors } = useFetch("suppliers", db);
  const { items: inventory } = useFetch("inventory", db);
  const { items: products } = useFetch("products", db);

  const locationID = localStorage.getItem("locationID") || "";

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;

      const tx = database.transaction(
        ["purchase_orders", "activities"],
        "readwrite"
      );
      const store = tx.objectStore("purchase_orders");
      const aStore = tx.objectStore("activities");

      const item = {
        ...newItem,
        purchaseOrderID: shortid.generate(),
        lastUpdated: new Date().toISOString(),
        status: "requested",
        syncStatus: "pending",
      };

      const activity = {
        locationID: locationID,
        activityID: shortid.generate(),
        actionType: "purchase order addition",
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
      const tx = database.transaction(
        ["purchase_orders", "activities"],
        "readwrite"
      );
      const store = tx.objectStore("purchase_orders");
      const aStore = tx.objectStore("activities");

      const item = {
        ...updatedItem,
        supplierID: id,
        lastUpdated: new Date().toISOString(),
        status: "active",
        syncStatus: "pending" as "pending" | "synced" | "error",
      };

      const activity = {
        locationID: locationID,
        activityID: shortid.generate(),
        actionType: "purchase order editing",
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

  return {
    items,
    vendors,
    inventory,
    products,
    loading,
    handleAddItem,
    handleEditItem,
    refetch,
  };
};

export default usePurchaseOrder;
