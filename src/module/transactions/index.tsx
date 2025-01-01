import AppLayout from "@/components/app-layout";
import { AlertTriangle, Filter, TrendingDown, TrendingUp } from "lucide-react";
import React, { useState, memo } from "react";
import { Table } from "@/components/ui/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import useTransaction from "./hooks";
import useFetch from "@/hooks/use-fetch";
import { db } from "@/lib/db";

const TransactionModule = () => {
  const { items: products } = useFetch("products", db);
  const {
    transactions,
    loading,
    setFilter,
    setStartDate,
    setEndDate,
    filter,
    startDate,
    endDate,
  } = useTransaction();

  const columns = [
    {
      key: "createdAt",
      label: "Date & Time",
      render: (transaction) =>
        format(new Date(transaction?.createdAt), "MMM d, yyyy HH:mm"),
    },
    {
      key: "name",
      label: "Item",
      render: (item: any) => {
        const productName = products.find(
          (product: any) => product.productID === item.productID
        );
        return productName?.name || "";
      },
    },
    {
      key: "type",
      label: "Type",
      render: (item) =>
        item.type === "requisition" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <TrendingDown className="h-3 w-3 mr-1" />
            requisition
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            purchase
          </span>
        ),
    },

    {
      key: "quantity",
      label: "Quantity",
    },

    {
      key: "status",
      label: "Sync Status",
      render: (item) => (
        <Badge
          variant={
            item.syncStatus === "synced"
              ? "success"
              : item.syncStatus === "pending"
              ? "warning"
              : "error"
          }
        >
          {item.syncStatus}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div>
      <AppLayout
        title="Transactions"
        description="View inventory and sales transactions"
        actions={<></>}
      >
        <div className="p-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setFilter("all")}
                className={`${
                  filter === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Inventory Transactions
              </button>
              <button
                onClick={() => setFilter("sales")}
                className={`${
                  filter === "sales"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Sales Transactions
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-3 my-6">
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg text-sm py-1.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-gray-200 rounded-lg text-sm py-1.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Filter className="h-4 w-4 text-gray-400" />
            {filter !== "sales" && (
              <select
                className="bg-white border border-gray-200 rounded-lg text-sm py-1.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filter}
                onChange={(e) =>
                  setFilter(e.target.value as "all" | "in" | "out")
                }
              >
                <option value="all">All Transactions</option>
                <option value="purchase">Stock In</option>
                <option value="requisition">Stock Out</option>
              </select>
            )}
          </div>

          <Table data={transactions} columns={columns} />
        </div>
      </AppLayout>
    </div>
  );
};

export default memo(TransactionModule);
