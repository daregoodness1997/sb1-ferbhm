import { openDB, DBSchema } from 'idb';

interface InventoryDB extends DBSchema {
  inventory: {
    key: string;
    value: {
      id: string;
      name: string;
      sku: string;
      quantity: number;
      minQuantity: number;
      price: number;
      cost: number;
      lastUpdated: Date;
      vendorId: string;
    };
    indexes: { 'by-sku': string };
  };
  vendors: {
    key: string;
    value: {
      id: string;
      name: string;
      contact: string;
      email: string;
      phone: string;
      lastOrder: Date;
    };
  };
  transactions: {
    key: string;
    value: {
      id: string;
      type: 'in' | 'out' | 'sale';
      itemId: string;
      quantity: number;
      price: number;
      timestamp: Date;
      syncStatus: 'pending' | 'synced' | 'error';
    };
    indexes: { 'by-status': string; 'by-date': string };
  };
  sales: {
    key: string;
    value: {
      id: string;
      items: Array<{
        itemId: string;
        quantity: number;
        price: number;
      }>;
      total: number;
      paymentMethod: 'cash' | 'card';
      timestamp: Date;
      syncStatus: 'pending' | 'synced' | 'error';
    };
    indexes: { 'by-date': string };
  };
}

export const initDB = async () => {
  const db = await openDB<InventoryDB>('inventory-system', 1, {
    upgrade(db) {
      const inventoryStore = db.createObjectStore('inventory', { keyPath: 'id' });
      inventoryStore.createIndex('by-sku', 'sku', { unique: true });

      db.createObjectStore('vendors', { keyPath: 'id' });

      const transactionsStore = db.createObjectStore('transactions', { keyPath: 'id' });
      transactionsStore.createIndex('by-status', 'syncStatus');
      transactionsStore.createIndex('by-date', 'timestamp');

      const salesStore = db.createObjectStore('sales', { keyPath: 'id' });
      salesStore.createIndex('by-date', 'timestamp');
    },
  });
  return db;
};

export const db = initDB();