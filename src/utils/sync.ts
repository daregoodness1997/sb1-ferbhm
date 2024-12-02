import { useStockReceiptStore } from "../stores/stockReceiptStore";
import { useInventoryStore } from "../stores/inventoryStore";
import { useVendorStore } from "../stores/vendorStore";

export async function syncStockReceipts(): Promise<void> {
  const stockStore = useStockReceiptStore.getState();
  const inventoryStore = useInventoryStore.getState();
  const vendorStore = useVendorStore.getState();

  const { receipts, setReceipts, pendingSync, setPendingSync } = stockStore;

  if (!pendingSync) {
    // Just load from local storage, no server sync needed
    return;
  }

  // Update any vendor names and inventory details from local stores
  const updatedReceipts = receipts.map((receipt) => ({
    ...receipt,
    vendorName: vendorStore.vendors.find((v) => v.id === receipt.vendorId)
      ?.name,
    items: receipt.items.map((item) => ({
      ...item,
      itemName: inventoryStore.items.find((i) => i.id === item.itemId)?.name,
    })),
  }));

  setReceipts(updatedReceipts);
  setPendingSync(false);
}
