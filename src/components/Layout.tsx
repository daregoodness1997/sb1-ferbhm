import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Package,
  Users,
  ClipboardList,
  Activity,
  ShoppingCart,
  BarChart,
  BookCopy,
} from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export function Layout() {
  const location = useLocation();
  const { isOnline, isSyncing } = useOnlineStatus();

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Inventory Pro
          </h1>
        </div>
        <nav className="mt-8">
          <NavLink to="/" icon={<Package />} active={location.pathname === "/"}>
            Inventory
          </NavLink>
          <NavLink
            to="/"
            icon={<BookCopy />}
            active={location.pathname === "/products"}
          >
            Products
          </NavLink>
          <NavLink
            to="/vendors"
            icon={<Users />}
            active={location.pathname === "/vendors"}
          >
            Vendors
          </NavLink>
          <NavLink
            to="/transactions"
            icon={<Activity />}
            active={location.pathname === "/transactions"}
          >
            Transactions
          </NavLink>
          <NavLink
            to="/orders"
            icon={<ClipboardList />}
            active={location.pathname === "/orders"}
          >
            Purchase Orders
          </NavLink>

          <NavLink
            to="/menu"
            icon={<Package />}
            active={location.pathname === "/menu"}
          >
            Menu
          </NavLink>
          <NavLink
            to="/pos"
            icon={<ShoppingCart />}
            active={location.pathname === "/pos"}
          >
            Point of Sale
          </NavLink>
          <NavLink
            to="/analytics"
            icon={<BarChart />}
            active={location.pathname === "/analytics"}
          >
            Analytics
          </NavLink>
          <NavLink
            to="/stock-receipts"
            icon={<BarChart />}
            active={location.pathname === "/stock-receipts"}
          >
            Stock Receipts
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {getPageTitle(location.pathname)}
            </h2>
            <div className="flex items-center gap-3">
              {isSyncing && (
                <span className="text-yellow-600 flex items-center gap-1">
                  <Activity className="h-4 w-4 animate-spin" />
                  Syncing...
                </span>
              )}
              <span
                className={`flex items-center gap-1 ${
                  isOnline ? "text-green-600" : "text-red-600"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isOnline ? "bg-green-600" : "bg-red-600"
                  }`}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function NavLink({
  to,
  icon,
  children,
  active,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-3 text-sm ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function getPageTitle(pathname: string): string {
  switch (pathname) {
    case "/":
      return "Inventory";
    case "/vendors":
      return "Vendors";
    case "/transactions":
      return "Transactions";
    case "/orders":
      return "Purchase Orders";
    case "/pos":
      return "Point of Sale";
    case "/analytics":
      return "Analytics";
    default:
      return "Inventory Management";
  }
}
