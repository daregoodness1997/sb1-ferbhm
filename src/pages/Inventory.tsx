import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { AlertTriangle, Plus } from 'lucide-react';

export function Inventory() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const database = await db;
      const tx = await database.transaction('inventory', 'readonly');
      const items = await tx.store.getAll();
      setItems(items);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Current Stock</h3>
          <p className="text-sm text-gray-500">Manage your inventory items and stock levels</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}