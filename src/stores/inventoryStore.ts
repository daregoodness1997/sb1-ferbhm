import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryItem } from "../types";
import { db } from "../lib/db";

interface InventoryStore {
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  loadItems: () => Promise<void>;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      items: [],
      pendingSync: false,
      setItems: (items) => set({ items }),
      loadItems: async () => {
        try {
          const database = await db;
          const tx = database.transaction("inventory", "readonly");
          const store = tx.store;
          const items = await store.getAll();
          set({
            items: items.map((item) => ({
              ...item,
              id: Number(item.id),
            })),
          });
        } catch (error) {
          console.error("Failed to load inventory:", error);
        }
      },
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "inventory-storage",
    }
  )
);
