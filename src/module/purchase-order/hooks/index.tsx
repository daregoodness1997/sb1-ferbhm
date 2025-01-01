import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import shortid from "shortid";
import useInventory from "@/module/inventory/hooks";

const usePurchaseOrder = () => {
  const { items, loading, error, refetch } = useFetch("purchase_orders", db);
  const { items: vendors } = useFetch("suppliers", db);
  const { items: products } = useFetch("products", db);
  const { handleEditItem: updateIventory, items: inventory } = useInventory();

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

  async function handleEditItem(
    updatedItem: any,
    id: string,
    type: "cancel" | "approve" | "recieve" | "paid"
  ) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["purchase_orders", "activities"],
        "readwrite"
      );
      const store = tx.objectStore("purchase_orders");
      const aStore = tx.objectStore("activities");

      const selectedType = {
        cancel: "cancelled",
        approve: "approved",
        recieve: "recieved",
        paid: "paid",
      };

      const item = {
        ...updatedItem,
        purchaseOrderID: id,
        lastUpdated: new Date().toISOString(),
        status: selectedType[type],
        syncStatus: "pending" as "pending" | "synced" | "error",
      };

      const activity = {
        locationID: locationID,
        activityID: shortid.generate(),
        actionType: selectedType[type] + " purchase order editing",
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
