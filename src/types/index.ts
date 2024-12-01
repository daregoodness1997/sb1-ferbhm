export interface Vendor {
  id: number;
  name: string;
}

export interface InventoryItem {
  id: number;
  name: string;
}

export interface StockReceipt {
  id?: number;
  vendorId: number;
  vendorName?: string;
  invoiceNumber: string;
  items: {
    itemId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  notes: string;
  totalAmount: number;
}
