import create from 'zustand';
import { db } from '../lib/db';
import Decimal from 'decimal.js';

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface POSStore {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  processSale: (paymentMethod: 'cash' | 'card') => Promise<void>;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  cart: [],
  
  addToCart: (item) => {
    set((state) => {
      const existingItem = state.cart.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { cart: [...state.cart, item] };
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },

  total: () => {
    const { cart } = get();
    return cart.reduce((sum, item) => {
      return new Decimal(sum)
        .plus(new Decimal(item.price).times(item.quantity))
        .toNumber();
    }, 0);
  },

  processSale: async (paymentMethod) => {
    const { cart, total, clearCart } = get();
    const saleId = crypto.randomUUID();
    
    const database = await db;
    const tx = database.transaction(['sales', 'inventory', 'transactions'], 'readwrite');
    
    try {
      // Create sale record
      await tx.objectStore('sales').add({
        id: saleId,
        items: cart,
        total: total(),
        paymentMethod,
        timestamp: new Date(),
        syncStatus: 'pending',
      });

      // Update inventory and create transaction records
      for (const item of cart) {
        const inventoryItem = await tx.objectStore('inventory').get(item.id);
        if (inventoryItem) {
          await tx.objectStore('inventory').put({
            ...inventoryItem,
            quantity: inventoryItem.quantity - item.quantity,
            lastUpdated: new Date(),
          });

          await tx.objectStore('transactions').add({
            id: crypto.randomUUID(),
            type: 'sale',
            itemId: item.id,
            quantity: item.quantity,
            price: item.price,
            timestamp: new Date(),
            syncStatus: 'pending',
          });
        }
      }

      await tx.done;
      clearCart();
    } catch (error) {
      console.error('Failed to process sale:', error);
      throw error;
    }
  },
}));