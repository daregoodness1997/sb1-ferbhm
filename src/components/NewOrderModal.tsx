import React, { useState } from "react";
import { Button } from "./ui/Button";
import { db } from "../lib/db";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "./ui/Dialog";

interface NewOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

export function NewOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
}: NewOrderProps) {
  const [formData, setFormData] = useState({
    vendorId: "",
    vendorName: "",
    items: [] as Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
    }>,
    expectedDelivery: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const database = await db;
    const tx = database.transaction(["purchaseOrders"], "readwrite");
    const store = tx.objectStore("purchaseOrders");

    try {
      await store.add({
        ...formData,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date(),
        totalAmount: formData.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      });
      onOrderCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), name: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Purchase Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vendor Name
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.vendorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vendorName: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expected Delivery
              </label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={formData.expectedDelivery}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    expectedDelivery: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-700">Items</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="Item name"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  min="1"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", parseInt(e.target.value))
                  }
                />
                <input
                  type="number"
                  placeholder="Price"
                  min="0"
                  step="0.01"
                  className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, "price", parseFloat(e.target.value))
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      items: prev.items.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Order</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
