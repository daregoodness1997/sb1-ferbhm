import { openDB, DBSchema } from "idb";

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
      lastUpdated: Date;
      category: string;
      uom: string;
      currentQuantity: number;
      reorderLevel: number;
      reorderQuantity: number;
      isPerishable: boolean;
      storageLocation: string;
      expiryDate?: Date;
      batchNumber: string;
      notes?: string;
      stockValue: string;
      // Procurement Details
      purchaseDate: Date;
      lastOrderQuantity: number;
      purchasePrice: number;
      supplierName: string;

      // Audit & Usage
      usageRate: number;
      wastage: number;
      auditDate: Date;
      auditNotes?: string;
      // Stock Change History
      stockChangeHistory: Array<{
        date: Date;
        previousQuantity: number;
        newQuantity: number;
        changeType: "purchase" | "sale" | "adjustment" | "wastage";
        reason?: string;
        documentReference?: string; // PO number, SO number, etc
        userId: string;
      }>;
    };
    indexes: { "by-sku": string };
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
    },
  });
  return db;
};

export const db = initDB();
