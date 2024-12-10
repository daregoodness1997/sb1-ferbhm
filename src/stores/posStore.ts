import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "../lib/db";
import { POSTransaction } from "../types";

interface CartItem {
  id: string | number;
  price: number;
  quantity: number;
}

interface POSStore {
  transactions: POSTransaction[];
  setTransactions: (transactions: POSTransaction[]) => void;
  loadTransactions: () => Promise<void>;
  pendingSync: boolean;
  setPendingSync: (status: boolean) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string | number) => void;
  updateQuantity: (itemId: string | number, quantity: number) => void;
  total: () => number;
  processSale: (paymentMethod: "cash" | "card") => Promise<void>;
}

export const usePOSStore = create<POSStore>()(
  persist<POSStore>(
    (set, get) => ({
      transactions: [],
      pendingSync: false,
      setTransactions: (transactions) => set({ transactions }),
      loadTransactions: async () => {
        try {
          const database = await db;
          const tx = database.transaction("transactions", "readonly");
          const store = tx.store;
          const rawTransactions = await store.getAll();
          const transactions = rawTransactions.map((tx) => ({
            ...tx,
            amount: tx.price * tx.quantity,
          }));
          set({ transactions });
        } catch (error) {
          console.error("Failed to load POS transactions:", error);
        }
      },
      setPendingSync: (status) => set({ pendingSync: status }),
      cart: [],
      addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),
      emptyCart: () => set({ cart: [] }),
      updateQuantity: (itemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        })),
      total: () =>
        get().cart.reduce(
          (total, item) =>
            total + Number(item.price || 0) * Number(item.quantity),
          0
        ),
      processSale: async (paymentMethod) => {
        // Implementation for processing sale
      },
    }),
    {
      name: "pos-storage",
    }
  )
);
