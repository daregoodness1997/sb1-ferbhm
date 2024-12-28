import { openDB, DBSchema } from "idb";

interface InventoryDB extends DBSchema {
  products: {
    key: string;
    value: {
      productID: string;
      name: string;
      catergoryID: string;
      sku: string;
      status: "active" | "in-active";
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-productID": string };
  };
  categories: {
    key: string;
    value: {
      categoryID: string;
      categoryName: string;
      status: "active" | "in-active";
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-categoryID": string };
  };

  locations: {
    key: string;
    value: {
      locationID: string;
      locationName: string;
      email: string;
      address: string;
      status: "active" | "in-active";
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-locationID": string };
  };
  activities: {
    key: string;
    value: {
      locationID: string;
      activityID: string;
      actionedBy: string;
      actionType: string;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-activityID": string };
  };

  customers: {
    key: string;
    value: {
      customerID: string;
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      status: "active" | "in-active";
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-customerID": string };
  };

  suppliers: {
    key: string;
    value: {
      supplierID: string;
      supplierName: string;
      contactPerson?: string;
      phone?: string;
      email?: string;
      address?: string;
      status: "active" | "in-active";
      website?: string;
      paymentTerms: string;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-supplierID": string };
  };

  inventory: {
    key: string;
    value: {
      inventoryID: string;
      productID: string;
      quantity: number;
      minQuantity: number;
      categoryID: string;
      locationID: string;
      createdBy: string;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-inventoryID": string };
  };

  purchaseOrders: {
    key: string;
    value: {
      id: string;
      vendorId: string;
      vendorName: string;
      status: "pending" | "approved" | "received" | "cancelled";
      products: { productID: string; quantity: number; amount: number }[];
      totalAmount: number;
      createdAt: Date;
      expectedDelivery: string;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-status": string };
  };

  inventory_transactions: {
    key: string;
    value: {
      transactionID: string;
      type: "purchase" | "requisition";
      inventoryID: string;
      productID: string;
      quantity: number;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-transactionID": string };
  };

  sales: {
    key: string;
    value: {
      saleId?: string;
      customerId?: string;
      salesDate: string;
      totalAmount: string;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-saleID": string };
  };
  sales_items: {
    key: string;
    value: {
      saleId?: string;
      saleItemId?: string;
      menuId?: string;
      quantity: number;
      price: number;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-saleItemId": string };
  };

  sales_transactions: {
    key: string;
    value: {
      transactionID: string;
      salesID: string;
      lastUpdated: Date;
      createdAt: Date;
      syncStatus: "pending" | "synced" | "error";
    };
    indexes: { "by-status": string; "by-date": string };
  };
}

export const initDB = async () => {
  const db = await openDB<InventoryDB>("inventory-system", 1, {
    upgrade(db) {
      // Create products store
      const productsStore = db.createObjectStore("products", {
        keyPath: "productID",
      });
      productsStore.createIndex("by-productID", "productID", { unique: true });

      // Create categories store
      const categoriesStore = db.createObjectStore("categories", {
        keyPath: "categoryID",
      });
      categoriesStore.createIndex("by-categoryID", "categoryID", {
        unique: true,
      });

      // Create locations store
      const locationsStore = db.createObjectStore("locations", {
        keyPath: "locationID",
      });
      locationsStore.createIndex("by-locationID", "locationID", {
        unique: true,
      });

      // Create activities store
      const activitiesStore = db.createObjectStore("activities", {
        keyPath: "activityID",
      });
      activitiesStore.createIndex("by-activityID", "activityID", {
        unique: true,
      });

      // Create customers store
      const customersStore = db.createObjectStore("customers", {
        keyPath: "customerID",
      });
      customersStore.createIndex("by-customerID", "customerID", {
        unique: true,
      });

      // Create suppliers store
      const suppliersStore = db.createObjectStore("suppliers", {
        keyPath: "supplierID",
      });
      suppliersStore.createIndex("by-supplierID", "supplierID", {
        unique: true,
      });

      // Create sales store
      const salesStore = db.createObjectStore("sales", {
        keyPath: "saleId",
      });
      salesStore.createIndex("by-saleID", "saleId", {
        unique: true,
      });

      // Create sales_items store
      const salesItemsStore = db.createObjectStore("sales_items", {
        keyPath: "saleItemId",
      });
      salesItemsStore.createIndex("by-saleItemId", "saleItemId", {
        unique: true,
      });

      // Create inventory store
      const inventoryStore = db.createObjectStore("inventory", {
        keyPath: "inventoryID",
      });
      inventoryStore.createIndex("by-inventoryID", "inventoryID", {
        unique: true,
      });

      // Create purchaseOrders store
      const purchaseOrdersStore = db.createObjectStore("purchaseOrders", {
        keyPath: "id",
      });
      purchaseOrdersStore.createIndex("by-status", "status");

      // Create inventory_transactions store
      const inventoryTransactionsStore = db.createObjectStore(
        "inventory_transactions",
        {
          keyPath: "transactionID",
        }
      );
      inventoryTransactionsStore.createIndex(
        "by-transactionID",
        "transactionID"
      );

      // Create sales_transactions store
      const salesTransactionsStore = db.createObjectStore(
        "sales_transactions",
        {
          keyPath: "transactionID",
        }
      );
      salesTransactionsStore.createIndex("by-status", "syncStatus");
      salesTransactionsStore.createIndex("by-date", "createdAt");
    },
  });
  return db;
};

export const db = initDB();
