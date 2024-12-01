import React, { useState, useEffect } from 'react';
import { usePOSStore } from '../stores/posStore';
import { db } from '../lib/db';
import { Search, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';

export function POS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState<any[]>([]);
  const { cart, addToCart, removeFromCart, updateQuantity, total, processSale } = usePOSStore();

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      const database = await db;
      const items = await database.getAll('inventory');
      setInventory(items);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      quantity: 1,
      price: item.price,
    });
  };

  const handleCheckout = async (paymentMethod: 'cash' | 'card') => {
    try {
      await processSale(paymentMethod);
      alert('Sale completed successfully!');
    } catch (error) {
      alert('Failed to process sale. Please try again.');
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Product List */}
      <div className="w-2/3 p-6 overflow-auto">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filteredInventory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAddToCart(item)}
            >
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                In Stock: {item.quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-1/3 bg-gray-50 p-6 border-l">
        <div className="flex items-center mb-6">
          <ShoppingCart className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-medium">Current Sale</h2>
        </div>

        <div className="flex-1 overflow-auto mb-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center mt-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="mx-4">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <span className="ml-auto font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-medium">Total</span>
            <span className="text-xl font-bold">${total().toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCheckout('cash')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Cash Payment
            </button>
            <button
              onClick={() => handleCheckout('card')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Card Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}