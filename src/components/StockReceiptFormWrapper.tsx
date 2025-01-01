import { useParams, useNavigate } from "react-router-dom";
import { useStockReceiptStore } from "../stores/stockReceiptStore";
import { useVendorStore } from "../stores/vendorStore";
import { useInventoryStore } from "../stores/inventoryStore";
import { generateTempId } from "../utils/tempId";

import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { StockReceipt } from "../types";
import { StockReceiptForm } from "./StockReceiptForm";
import React, { useEffect } from "react";

export function StockReceiptFormWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOnline } = useOnlineStatus();

  const { receipts, addReceipt, updateReceipt, loadReceipts } =
    useStockReceiptStore();
  const { vendors, loadVendors } = useVendorStore();
  const { items, loadItems } = useInventoryStore();

  useEffect(() => {
    loadReceipts();
    loadVendors();
    loadItems();
  }, []);

  const receipt = id ? receipts.find((r) => r.id === id) : null;

  // console.log(vendors, receipts, items, "ventors>>>>");

  const handleSubmit = async (formData: StockReceipt) => {
    if (id) {
      updateReceipt({ ...formData, id: id });
    } else {
      addReceipt({ ...formData, id: generateTempId() });
    }
    navigate("/stock-receipts");
  };

  if (!vendors.length || !items.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {!isOnline && (
        <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
          Working offline - changes will sync when back online
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">
        {id ? "Edit Stock Receipt" : "New Stock Receipt"}
      </h1>

      <StockReceiptForm
        vendors={vendors}
        inventoryItems={items}
        initialData={receipt}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/stock-receipts")}
      />
    </div>
  );
}
