import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vendor } from "../types";
import { db } from "../lib/db";

interface VendorStore {
  vendors: Vendor[];
  setVendors: (vendors: Vendor[]) => void;
  loadVendors: () => Promise<void>;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
}

export const useVendorStore = create<VendorStore>()(
  persist(
    (set) => ({
      vendors: [],
      pendingSync: false,
      setVendors: (vendors) => set({ vendors }),
      loadVendors: async () => {
        try {
          console.log("loading vendors");
          const database = await db;
          const tx = database.transaction("vendors", "readonly");
          const store = tx.store;
          const rawVendors = await store.getAll();
          const vendors = rawVendors.map((v) => ({ ...v, id: Number(v.id) }));
          set({ vendors });
        } catch (error) {
          console.error("Failed to load vendors:", error);
        }
      },
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "vendor-storage",
    }
  )
);
