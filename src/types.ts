export interface POSTransaction {
  id: string;
  amount: number;
  timestamp: Date;
  // Add other relevant fields your POS transaction needs
}

export interface StockReceipt {
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
}
