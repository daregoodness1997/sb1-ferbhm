import React, { useState, useEffect } from "react";
import { usePOSStore } from "../stores/posStore";
import { db } from "../lib/db";
import { Search, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { printReceipt } from "../components/ReceiptPrinter";

interface Item {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ReceiptData {
  items: Item[];
  total: number;
  cash: number;
  change: number;
}

export function POS() {
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState<any[]>([]);
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    processSale,
    emptyCart,
  } = usePOSStore();

  useEffect(() => {
    loadInventory();
  }, []);

  const handlePrint = async () => {
    if (cart.length === 0) {
      console.log("Please add items to the receipt");
      return;
    }

    // if (cash < total) {
    //   console.log("Insufficient cash provided");
    //   return;
    // }

    try {
      const receiptData: ReceiptData = {
        items: cart,
        total: 100,
        cash: 100,
        change: 0,
      };

      // Check if running in Electron and if electronAPI and printReceipt are defined
      if (typeof window !== "undefined") {
        const result = await window.electronAPI.printReceipt(receiptData);
        console.log(result.message);
      } else {
        console.error("electronAPI or printReceipt is not defined");
        alert("Printing is not available in this environment.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  async function loadInventory() {
    try {
      const database = await db;
      const items = await database.getAll("inventory");
      const forSaleItems = items.filter((item) => item.forSale);
      setInventory(forSaleItems);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    }
  }

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (item: any) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      addToCart({
        id: item.id,
        name: item.name,
        quantity: 1,
        price: item.price || 0,
      });
    }
  };

  const handleEmptyCart = () => {
    emptyCart();
  };

  const handleCheckout = async (paymentMethod: "cash" | "card") => {
    try {
      await processSale(paymentMethod);
      handlePrint();
      // printReceipt({
      //   items: cart,
      //   total: total(),
      //   timestamp: new Date(),
      // });
      alert("Sale completed successfully!");
    } catch (error) {
      alert("Failed to process sale. Please try again.");
    }
  };

  console.log(cart, filteredInventory, ">>> debugger");

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
          {filteredInventory?.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleAddToCart(item)}
            >
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
              <p className="text-lg font-bold mt-2">₦{item?.price || 0}</p>
              <p className="text-sm text-gray-500">In Stock: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-1/3 bg-gray-50 p-6 border-l">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-medium">Current Sale</h2>
          </div>
          {cart.length > 0 && (
            <button
              onClick={handleEmptyCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Empty Cart
            </button>
          )}
        </div>

        <div className="flex-1 overflow-auto mb-6">
          {cart?.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item?.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₦{item?.price?.toFixed(2) || 0} each
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
                  onClick={() =>
                    updateQuantity(item.id, Math.max(0, item.quantity - 1))
                  }
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
                  ₦{(Number(item.price || 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-medium">Total</span>
            <span className="text-xl font-bold">₦{total().toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleCheckout("cash")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Cash Payment
            </button>
            <button
              onClick={() => handleCheckout("card")}
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
