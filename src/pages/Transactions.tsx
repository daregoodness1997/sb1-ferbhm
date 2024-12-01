import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    try {
      const database = await db;
      const tx = await database.transaction(['transactions', 'inventory'], 'readonly');
      const transactions = await tx.objectStore('transactions').getAll();
      
      const enrichedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const item = await tx.objectStore('inventory').get(transaction.itemId);
          return {
            ...transaction,
            itemName: item?.name || 'Unknown Item',
          };
        })
      );

      setTransactions(enrichedTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredTransactions = transactions.filter((t) => 
    filter === 'all' ? true : t.type === filter
  );

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
          <h1 className="text-2xl font-semibold text-gray-900">Stock Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Track all inventory movements</p>
        </div>
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            className="bg-white border border-gray-200 rounded-lg text-sm py-1.5 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">All Transactions</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
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
                    {format(new Date(transaction.timestamp), 'MMM d, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={transaction.type === 'in' ? 'success' : 'error'}
                      className="gap-1"
                    >
                      {transaction.type === 'in' ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {transaction.type === 'in' ? 'Stock In' : 'Stock Out'}
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
                        transaction.syncStatus === 'synced'
                          ? 'success'
                          : transaction.syncStatus === 'pending'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {transaction.syncStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}