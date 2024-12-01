import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Vendor } from "../types";

interface VendorStore {
  vendors: Vendor[];
  setVendors: (vendors: Vendor[]) => void;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
}

export const useVendorStore = create<VendorStore>()(
  persist(
    (set) => ({
      vendors: [],
      pendingSync: false,
      setVendors: (vendors) => set({ vendors }),
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "vendor-storage",
    }
  )
);
