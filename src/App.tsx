import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Inventory } from './pages/Inventory';
import { Vendors } from './pages/Vendors';
import { Transactions } from './pages/Transactions';
import { PurchaseOrders } from './pages/PurchaseOrders';
import { POS } from './pages/POS';
import { Analytics } from './pages/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inventory />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="orders" element={<PurchaseOrders />} />
          <Route path="pos" element={<POS />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;