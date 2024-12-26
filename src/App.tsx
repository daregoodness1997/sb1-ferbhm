import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Inventory } from "./pages/Inventory";
import { Vendors } from "./pages/Vendors";
import { Transactions } from "./pages/Transactions";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { POS } from "./pages/POS";
import { Analytics } from "./pages/Analytics";
import { StockReceiptList } from "./components/StockReceiptList";
import { StockReceiptFormWrapper } from "./components/StockReceiptFormWrapper";
import { InventoryItem } from "./pages/InventoryItem";
import { Menu } from "./pages/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="inventory/:id" element={<InventoryItem />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="orders" element={<PurchaseOrders />} />
          <Route path="pos" element={<POS />} />
          <Route path="menu" element={<Menu />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="stock-receipts" element={<StockReceiptList />} />
          <Route
            path="stock-receipts/new"
            element={<StockReceiptFormWrapper />}
          />
          <Route
            path="stock-receipts/:id"
            element={<StockReceiptFormWrapper />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
