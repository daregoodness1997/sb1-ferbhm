import React, { useState, useEffect } from "react";
import { db } from "../lib/db";
import { AlertTriangle, Plus, X, Eye, Edit2 } from "lucide-react";

export function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;
      const tx = database.transaction("inventory", "readwrite");
      const store = tx.store;

      const item = {
        id: Date.now(),
        ...newItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.add(item);
      await tx.done;

      // Reload the inventory to show the new item
      await loadInventory();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add item:", error);
    }
  }

  async function loadInventory() {
    try {
      const database = await db;
      const tx = await database.transaction("inventory", "readonly");
      const items = await tx.store.getAll();
      setItems(items);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditItem(updatedItem: any) {
    try {
      const database = await db;
      const tx = database.transaction("inventory", "readwrite");
      const store = tx.store;

      const item = {
        ...updatedItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.put(item);
      await tx.done;

      await loadInventory();
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Current Stock</h3>
          <p className="text-sm text-gray-500">
            Manage your inventory items and stock levels
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.sku}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.quantity <= item.minQuantity ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsViewModalOpen(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Item</h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <AddItemForm
                onSubmit={handleAddItem}
                onCancel={() => setIsAddModalOpen(false)}
              />
            </div>
          </div>
        )}

        {isEditModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Edit Item</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <AddItemForm
                onSubmit={handleEditItem}
                onCancel={() => {
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                initialData={selectedItem}
              />
            </div>
          </div>
        )}

        {isViewModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">View Item Details</h2>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedItem.name}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    SKU
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedItem.sku}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedItem.quantity}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Minimum Quantity
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedItem.minQuantity}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Updated
                  </label>
                  <div className="mt-1 text-sm text-gray-900">
                    {new Date(selectedItem.lastUpdated).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddItemForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (item: any) => void;
  onCancel: () => void;
  initialData?: any;
}) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    minQuantity: 0,
    ...initialData,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          className="mt-1  block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">SKU</label>
        <input
          type="text"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Minimum Quantity
        </label>
        <input
          type="number"
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.minQuantity}
          onChange={(e) =>
            setFormData({ ...formData, minQuantity: parseInt(e.target.value) })
          }
        />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>
    </form>
  );
}
