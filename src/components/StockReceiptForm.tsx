import React, { useState } from "react";
import { StockReceipt } from "../types";
import { Vendor } from "../types";
import { InventoryItem } from "../types";

interface StockReceiptFormProps {
  vendors: Vendor[];
  inventoryItems: InventoryItem[];
  initialData?: StockReceipt | null;
  onSubmit: (receipt: StockReceipt) => void;
  onCancel: () => void;
}

export function StockReceiptForm({
  vendors,
  inventoryItems,
  initialData,
  onSubmit,
  onCancel,
}: StockReceiptFormProps) {
  const [formData, setFormData] = useState<Partial<StockReceipt>>({
    vendorId: initialData?.vendorId || vendors[0]?.id,
    invoiceNumber: initialData?.invoiceNumber || "",
    items: initialData?.items || [],
    notes: initialData?.notes || "",
    totalAmount: initialData?.totalAmount || 0,
  });

  const [currentItem, setCurrentItem] = useState({
    itemId: inventoryItems[0]?.id,
    quantity: 1,
    unitPrice: 0,
  });

  function addItem() {
    const subtotal = currentItem.quantity * currentItem.unitPrice;
    const newItems = [...(formData.items || []), { ...currentItem, subtotal }];

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: newItems.reduce((sum, item) => sum + item.subtotal, 0),
    });

    setCurrentItem({
      itemId: inventoryItems[0]?.id,
      quantity: 1,
      unitPrice: 0,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (formData.vendorId && formData.items?.length) {
      onSubmit(formData as StockReceipt);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vendor
          </label>
          <select
            required
            value={formData.vendorId}
            onChange={(e) =>
              setFormData({ ...formData, vendorId: Number(e.target.value) })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Invoice Number
          </label>
          <input
            type="text"
            required
            value={formData.invoiceNumber}
            onChange={(e) =>
              setFormData({ ...formData, invoiceNumber: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Add Items</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Item
            </label>
            <select
              value={currentItem.itemId}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  itemId: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {inventoryItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={currentItem.quantity}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  quantity: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={currentItem.unitPrice}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  unitPrice: Number(e.target.value),
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addItem}
              className="w-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-md"
            >
              Add Item
            </button>
          </div>
        </div>

        {formData.items && formData.items.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                  Item
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Unit Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {formData.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    {inventoryItems.find((i) => i.id === item.itemId)?.name}
                  </td>
                  <td className="px-4 py-2 text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    ${item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="font-medium">
                <td colSpan={3} className="px-4 py-2 text-right">
                  Total:
                </td>
                <td className="px-4 py-2 text-right">
                  ${formData.totalAmount?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Record Receipt
        </button>
      </div>
    </form>
  );
}
