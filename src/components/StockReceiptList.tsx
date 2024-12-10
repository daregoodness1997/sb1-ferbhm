import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStockReceiptStore } from "../stores/stockReceiptStore";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { syncStockReceipts } from "../utils/sync";

export function StockReceiptList() {
  const { receipts } = useStockReceiptStore();
  const isOnline = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (isOnline) {
        await syncStockReceipts();
      }
      setIsLoading(false);
    };
    loadData();
  }, [isOnline]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Stock Receipts</h1>
        <Link
          to="/stock-receipts/new"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Receipt
        </Link>
      </div>

      {!isOnline && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          Working offline - changes will sync when back online
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left">Invoice #</th>
            <th className="px-4 py-2 text-left">Vendor</th>
            <th className="px-4 py-2 text-right">Total Amount</th>
            <th className="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {receipts.map((receipt) => (
            <tr key={receipt.id}>
              <td className="px-4 py-2">{receipt.invoiceNumber}</td>
              <td className="px-4 py-2">{receipt.vendorName}</td>
              <td className="px-4 py-2 text-right">
                ${receipt.totalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-2 text-right">
                <Link
                  to={`/stock-receipts/${receipt.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View/Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
