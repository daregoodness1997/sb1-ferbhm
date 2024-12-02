import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StockReceipt } from "../types";
import { db } from "../lib/db";

interface StockReceiptStore {
  receipts: StockReceipt[];
  setReceipts: (receipts: StockReceipt[]) => void;
  loadReceipts: () => Promise<void>;
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
      loadReceipts: async () => {
        try {
          const database = await db;
          const tx = database.transaction("stockReceipts", "readonly");
          const store = tx.store;
          const receipts = await store.getAll();
          set({ receipts: receipts.map((r) => ({ ...r, id: Number(r.id) })) });
        } catch (error) {
          console.error("Failed to load stock receipts:", error);
        }
      },
      addReceipt: async (receipt) => {
        try {
          const database = await db;
          const tx = database.transaction("stockReceipts", "readwrite");
          const store = tx.store;
          await store.add(receipt);
          await tx.done;

          // Update local state after successful DB operation
          set((state) => ({
            receipts: [...state.receipts, receipt],
          }));
        } catch (error) {
          console.error("Failed to add stock receipt:", error);
          throw error;
        }
      },
      updateReceipt: async (receipt) => {
        try {
          const database = await db;
          const tx = database.transaction("stockReceipts", "readwrite");
          const store = tx.store;
          await store.put(receipt);

          // Reload receipts after updating
          const newTx = database.transaction("stockReceipts", "readonly");
          const newStore = newTx.store;
          const receipts = await newStore.getAll();
          set({ receipts, pendingSync: true });
        } catch (error) {
          console.error("Failed to update stock receipt:", error);
        }
      },
      setPendingSync: (status) => set({ pendingSync: status }),
    }),
    {
      name: "stock-receipts-storage",
    }
  )
);
