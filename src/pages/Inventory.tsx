import React, { useState, useEffect } from "react";
import { db } from "../lib/db";
import { AlertTriangle, Plus, X, Eye, Edit2, BarChart2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadInventory();
    loadVendors();
  }, []);

  async function handleAddItem(newItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["inventory", "transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("transactions");

      const item = {
        id: Date.now().toString(),
        ...newItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.add(item);
      await tstore.add({
        id: Date.now().toString(),
        itemId: item.id,
        type: "in",
        quantity: item.quantity,
        date: new Date().toISOString(),
        timestamp: new Date(),
        syncStatus: "synced",
      });
      await tx.done;

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
  async function loadVendors() {
    try {
      const database = await db;
      const tx = await database.transaction("vendors", "readonly");
      const vendors = await tx.store.getAll();
      setVendors(vendors);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditItem(updatedItem: any) {
    try {
      const database = await db;
      const tx = database.transaction(
        ["inventory", "transactions"],
        "readwrite"
      );
      const store = tx.objectStore("inventory");
      const tstore = tx.objectStore("transactions");

      const item = {
        ...updatedItem,
        lastUpdated: new Date().toISOString(),
      };

      await store.put(item).then(() => {
        tstore.put({
          id: Date.now().toString(),
          itemId: item.id,
          type: "out",
          quantity: item.quantity,
          date: new Date().toISOString(),
          timestamp: new Date(),
          syncStatus: "synced",
        });
      });
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
                  <Link
                    to={`/inventory/${item.id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    <BarChart2 className="h-4 w-4 inline" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
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
                vendors={vendors}
              />
            </div>
          </div>
        )}

        {isEditModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
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
                vendors={vendors}
              />
            </div>
          </div>
        )}

        {isViewModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
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
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(selectedItem)
                  .filter(
                    ([key]) =>
                      !["id", "stockChangeHistory"].includes(key) &&
                      selectedItem[key] !== undefined
                  )
                  .map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </label>
                      <div className="mt-1 text-sm text-gray-900">
                        {key.toLowerCase().includes("date")
                          ? new Date(value as string).toLocaleString()
                          : typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : String(value)}
                      </div>
                    </div>
                  ))}
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
  vendors,
}: {
  vendors: any[];
  onSubmit: (item: {
    name: string;
    sku: string;
    quantity: number;
    minQuantity: number;
    price: number;
    cost: number;
    vendorId: string;
    category: string;
    uom: string;
    reorderLevel: number;
    reorderQuantity: number;
    isPerishable: boolean;
    storageLocation: string;
    expiryDate?: Date;
    batchNumber: string;
    notes?: string;
    stockValue: string;
    purchaseDate: Date;
    lastOrderQuantity: number;
    purchasePrice: number;
    supplierName: string;
    usageRate: number;
    wastage: number;
    auditDate: Date;
    auditNotes?: string;
  }) => void;
  onCancel: () => void;
  initialData?: Partial<{
    name: string;
    sku: string;
    quantity: number;
    minQuantity: number;
    price: number;
    cost: number;
    vendorId: string;
    category: string;
    uom: string;
    reorderLevel: number;
    reorderQuantity: number;
    isPerishable: boolean;
    storageLocation: string;
    expiryDate?: Date;
    batchNumber: string;
    notes?: string;
    stockValue: string;
    purchaseDate: Date;
    lastOrderQuantity: number;
    purchasePrice: number;
    supplierName: string;
    usageRate: number;
    wastage: number;
    auditDate: Date;
    auditNotes?: string;
  }>;
}) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    quantity: 0,
    minQuantity: 0,
    price: 0,
    cost: 0,
    vendorId: "",
    category: "",
    uom: "",
    reorderLevel: 0,
    reorderQuantity: 0,
    isPerishable: false,
    storageLocation: "",
    batchNumber: "",
    stockValue: "0",
    purchaseDate: new Date(),
    lastOrderQuantity: 0,
    purchasePrice: 0,
    supplierName: "",
    usageRate: 0,
    wastage: 0,
    auditDate: new Date(),
    ...initialData,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <div className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm">
            {formData.quantity}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Minimum Quantity
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.minQuantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                minQuantity: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            <option value="Raw Materials">Raw Materials</option>
            <option value="Finished Goods">Finished Goods</option>
            <option value="Packaging">Packaging</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Safety Equipment">Safety Equipment</option>
            <option value="Cleaning Supplies">Cleaning Supplies</option>
            <option value="Tools">Tools</option>
            <option value="Spare Parts">Spare Parts</option>
            <option value="Fresh Produce">Fresh Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Meat & Seafood">Meat & Seafood</option>
            <option value="Bakery">Bakery</option>
            <option value="Frozen Foods">Frozen Foods</option>
            <option value="Beverages">Beverages</option>
            <option value="Snacks">Snacks</option>
            <option value="Canned Goods">Canned Goods</option>
            <option value="Condiments">Condiments</option>
            <option value="Dry Goods">Dry Goods</option>
            <option value="Kitchen Equipment">Kitchen Equipment</option>
            <option value="Disposables">Disposables</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Unit of Measure
          </label>
          <select
            required
            value={formData.uom}
            onChange={(e) => setFormData({ ...formData, uom: e.target.value })}
            className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a unit</option>
            <option value="ea">Each (ea)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="g">Gram (g)</option>
            <option value="lb">Pound (lb)</option>
            <option value="oz">Ounce (oz)</option>
            <option value="l">Liter (l)</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="gal">Gallon (gal)</option>
            <option value="qt">Quart (qt)</option>
            <option value="pt">Pint (pt)</option>
            <option value="fl oz">Fluid Ounce (fl oz)</option>
            <option value="box">Box</option>
            <option value="case">Case</option>
            <option value="pack">Pack</option>
            <option value="bag">Bag</option>
            <option value="roll">Roll</option>
            <option value="sheet">Sheet</option>
            <option value="pair">Pair</option>
            <option value="nylon">Nylon</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reorder Level
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.reorderLevel}
            onChange={(e) =>
              setFormData({
                ...formData,
                reorderLevel: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reorder Quantity
          </label>
          <input
            type="number"
            required
            min="0"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.reorderQuantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                reorderQuantity: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Storage Location
          </label>
          <input
            type="text"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.storageLocation}
            onChange={(e) =>
              setFormData({ ...formData, storageLocation: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Batch Number
          </label>
          <input
            type="text"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.batchNumber}
            onChange={(e) =>
              setFormData({ ...formData, batchNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Supplier Name
          </label>
          <select
            required
            className="mt-1 p-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.supplierName}
            onChange={(e) =>
              setFormData({ ...formData, supplierName: e.target.value })
            }
          >
            <option value="">Select a supplier</option>
            {vendors.map((vendor) => (
              <option key={vendor.id} value={vendor.name}>
                {vendor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Usage Rate
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.usageRate}
            onChange={(e) =>
              setFormData({
                ...formData,
                usageRate: parseFloat(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Wastage
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.wastage}
            onChange={(e) =>
              setFormData({ ...formData, wastage: parseFloat(e.target.value) })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Is Perishable
          </label>
          <input
            type="checkbox"
            className="mt-1 p-1 rounded bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            checked={formData.isPerishable}
            onChange={(e) =>
              setFormData({ ...formData, isPerishable: e.target.checked })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Date
          </label>
          <input
            type="date"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.purchaseDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({
                ...formData,
                purchaseDate: new Date(e.target.value),
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Audit Date
          </label>
          <input
            type="date"
            required
            className="mt-1 p-1  block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.auditDate.toISOString().split("T")[0]}
            onChange={(e) =>
              setFormData({ ...formData, auditDate: new Date(e.target.value) })
            }
          />
        </div>
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
