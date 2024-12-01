import { create } from "zustand";
import { persist } from "zustand/middleware";
import { InventoryItem } from "../types";

interface InventoryStore {
  items: InventoryItem[];
  setItems: (items: InventoryItem[]) => void;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
}

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set) => ({
      items: [],
      pendingSync: false,
      setItems: (items) => set({ items }),
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "inventory-storage",
    }
  )
);
