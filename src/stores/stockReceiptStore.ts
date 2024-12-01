import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StockReceipt } from "../types";

interface StockReceiptStore {
  receipts: StockReceipt[];
  setReceipts: (receipts: StockReceipt[]) => void;
  addReceipt: (receipt: StockReceipt) => void;
  updateReceipt: (receipt: StockReceipt) => void;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
}

export const useStockReceiptStore = create<StockReceiptStore>()(
  persist(
    (set) => ({
      receipts: [],
      pendingSync: false,
      setReceipts: (receipts) => set({ receipts }),
      addReceipt: (receipt) =>
        set((state) => ({
          receipts: [...state.receipts, receipt],
          pendingSync: true,
        })),
      updateReceipt: (receipt) =>
        set((state) => ({
          receipts: state.receipts.map((r) =>
            r.id === receipt.id ? receipt : r
          ),
          pendingSync: true,
        })),
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "stock-receipts-storage",
    }
  )
);
