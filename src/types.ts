export interface POSTransaction {
  id: string;
  amount: number;
  timestamp: Date;
  // Add other relevant fields your POS transaction needs
}

export interface StockReceipt {
  id: number;
  date: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
  supplierId: number;
  totalAmount: number;
}
