import React, { useState, useEffect } from "react";
import { db } from "../lib/db";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
import { format } from "date-fns";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const database = await db;
      const tx = await database.transaction(
        ["transactions", "inventory"],
        "readonly"
      );
      const transactions = await tx.objectStore("transactions").getAll();

      const enrichedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const item = await tx
            .objectStore("inventory")
            .get(transaction.itemId);
          return {
            ...transaction,
            itemName: item?.name || "Unknown Item",
          };
        })
      );

      setTransactions(enrichedTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); // Include the entire end date

    const matchesType = filter === "all" ? true : t.type === filter;
    const matchesDateRange = transactionDate >= start && transactionDate <= end;

    return matchesType && matchesDateRange;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            View inventory and sales transactions
          </p>
        </div>
      </div>

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

      <div className="flex items-center gap-3">
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
            onChange={(e) => setFilter(e.target.value as "all" | "in" | "out")}
          >
            <option value="all">All Transactions</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        )}
      </div>

      <Card>
        <div className="overflow-x-auto">
          {filter !== "sales" ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {format(new Date(transaction?.date), "MMM d, yyyy HH:mm")}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          transaction.type === "in" ? "success" : "error"
                        }
                        className="gap-1"
                      >
                        {transaction.type === "in" ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : (
                          <ArrowUpRight className="h-3 w-3" />
                        )}
                        {transaction.type === "in" ? "Stock In" : "Stock Out"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">
                        {transaction.itemName}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          transaction.syncStatus === "synced"
                            ? "success"
                            : transaction.syncStatus === "pending"
                            ? "warning"
                            : "error"
                        }
                      >
                        {transaction.syncStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Sales transactions will be mapped here */}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
