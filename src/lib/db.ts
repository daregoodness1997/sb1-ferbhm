import { openDB, DBSchema } from "idb";

interface InventoryDB extends DBSchema {
  location: {
    key: string;
    value: {
      locationID: string;
      location: string;
      invId: string;
      email: string;
      address: string;
      status: "active" | "in-active";
      createdAt: string;
    };
    indexes: { "by-locationID": string };
  };
  userAvtivity: {
    key: string;
    value: {
      locationID: string;
      activityID: string;
      actionedBy: string;
      createdAt: string;
      actionType: string;
    };
    indexes: { "by-activityID": string };
  };

  inventory: {
    key: string;
    value: {
      id: string;
      name: string;
      quantity: number;
      price: number;
      lastUpdated: Date;
      category: string;
      currentQuantity: number;
      reorderLevel: number;
      reorderQuantity: number;
      isPerishable: boolean;
      storageLocation: string;
      expiryDate?: Date;
      batchNumber: string;
      notes?: string;
      stockValue: string;

      // Sales
      forSale: boolean;
      // Audit & Usage
      usageRate: number;
      wastage: number;
      auditDate: Date;
      auditNotes?: string;
    };
    indexes: { "by-sku": string };
  };

  requisition: {};
  inventoryHistory: {
    key: string;
    value: {
      id: string;
      invId: string;
      state: "inflow" | "outflow";
      vendorId: string;
    };
    indexes: { "by-sku": string };
  };

  purchaseOrders: {
    key: string;
    value: {
      id: string;
      vendorId: string;
      vendorName: string;
      status: "pending" | "approved" | "received" | "cancelled";
      items: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
      }>;
      totalAmount: number;
      createdAt: Date;
      expectedDelivery: string;
    };
    indexes: { "by-status": string };
  };
  vendors: {
    key: string;
    value: {
      id: string;
      name: string;
      contactPerson: string;
      phone: string;
      email: string;
      address: string;
      website?: string;
      vendorType: string[];
      isPreferred: boolean;
      paymentTerms: string;
      discounts?: string;
      lastPurchasePrice?: number;
      transactionHistory: Array<{
        date: Date;
        amount: number;
        invoiceNumber: string;
      }>;
      averageDeliveryTime?: number;
      reliability: {
        timelyDelivery: number;
        qualityRating: number;
      };
      qualityFeedback: Array<{
        date: Date;
        feedback: string;
      }>;
      issues: Array<{
        date: Date;
        description: string;
        resolved: boolean;
      }>;
      lastUpdated: Date;
    };
  };
  transactions: {
    key: string;
    value: {
      id: string;
      type: "in" | "out" | "sale";
      itemId: string;
      quantity: number;
      price: number;
      timestamp: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-status": string; "by-date": string };
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
      paymentMethod: "cash" | "card";
      timestamp: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-date": string };
  };
  stockReceipts: {
    key: string;
    value: {
      id: string;
      vendorId: string;
      date: string;
      items: Array<{
        itemId: string;
        quantity: number;
        unitPrice: number;
        subtotal: number;
      }>;
      invoiceNumber: string;
      totalAmount: number;
      notes?: string;
    };
    indexes: { "by-date": string };
  };
  locations: {
    key: string;
    value: {
      id: string;
      name: string;
      organizationId: string;
      status: "active" | "in-active";
      timestamp: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-status": string; "by-date": string };
  };
}

export const initDB = async () => {
  const db = await openDB<InventoryDB>("inventory-system", 1, {
    upgrade(db) {
      // Create inventory store
      const inventoryStore = db.createObjectStore("inventory", {
        keyPath: "id",
      });
      inventoryStore.createIndex("by-sku", "sku", { unique: true });

      // Create vendors store
      const vendorsStore = db.createObjectStore("vendors", { keyPath: "id" });

      // Create stock receipts store
      const stockReceiptsStore = db.createObjectStore("stockReceipts", {
        keyPath: "id",
      });
      stockReceiptsStore.createIndex("by-date", "date");

      // Create transactions store
      const transactionsStore = db.createObjectStore("transactions", {
        keyPath: "id",
      });
      transactionsStore.createIndex("by-status", "syncStatus");
      transactionsStore.createIndex("by-date", "timestamp");

      // Create sales store
      const salesStore = db.createObjectStore("sales", { keyPath: "id" });
      salesStore.createIndex("by-date", "timestamp");

      // Create purchase orders store
      const purchaseOrdersStore = db.createObjectStore("purchaseOrders", {
        keyPath: "id",
      });
      purchaseOrdersStore.createIndex("by-status", "status");
    },
  });
  return db;
};

export const db = initDB();
