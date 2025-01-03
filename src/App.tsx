import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Inventory } from "./pages/Inventory";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { POS } from "./pages/POS";
import { Analytics } from "./pages/Analytics";
import { StockReceiptList } from "./components/StockReceiptList";
import { StockReceiptFormWrapper } from "./components/StockReceiptFormWrapper";
import { InventoryItem } from "./pages/InventoryItem";
import Menu from "./pages/Menu";
import Products from "./pages/Products";
import { Categories } from "./pages/Categories";
import { Locations } from "./pages/Locations";
import { Activities } from "./pages/Activities";
import { Customers } from "./pages/Customers";
import { Suppliers } from "./pages/Suppliers";
import { Transactions } from "./pages/Transactions";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="locations" element={<Locations />} />
          <Route path="activities" element={<Activities />} />
          <Route path="customers" element={<Customers />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="inventory/:id" element={<InventoryItem />} />
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
