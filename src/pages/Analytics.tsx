import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, DollarSign, Package, ArrowUpRight } from 'lucide-react';

export function Analytics() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalSales: 0,
    averageOrderValue: 0,
    totalItems: 0,
    growth: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const database = await db;
      const last30Days = subDays(new Date(), 30);
      
      // Get sales for the last 30 days
      const tx = database.transaction(['sales', 'transactions'], 'readonly');
      const salesIndex = tx.store.index('by-date');
      const sales = await salesIndex.getAll(IDBKeyRange.lowerBound(last30Days));

      // Process daily sales
      const dailySales = sales.reduce((acc: any, sale: any) => {
        const date = format(new Date(sale.timestamp), 'MM/dd');
        acc[date] = (acc[date] || 0) + sale.total;
        return acc;
      }, {});

      setSalesData(
        Object.entries(dailySales).map(([date, total]) => ({
          date,
          total,
        }))
      );

      // Calculate summary
      const totalSales = sales.reduce((sum: number, sale: any) => sum + sale.total, 0);
      const averageOrderValue = totalSales / sales.length || 0;
      const totalItems = sales.reduce(
        (sum: number, sale: any) => sum + sale.items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0),
        0
      );

      // Calculate top products
      const productSales: Record<string, { quantity: number; revenue: number }> = {};
      sales.forEach((sale: any) => {
        sale.items.forEach((item: any) => {
          if (!productSales[item.id]) {
            productSales[item.id] = { quantity: 0, revenue: 0 };
          }
          productSales[item.id].quantity += item.quantity;
          productSales[item.id].revenue += item.quantity * item.price;
        });
      });

      const topProductsList = await Promise.all(
        Object.entries(productSales)
          .sort(([, a], [, b]) => b.revenue - a.revenue)
          .slice(0, 5)
          .map(async ([id, stats]) => {
            const item = await database.get('inventory', id);
            return {
              name: item?.name || 'Unknown Product',
              ...stats,
            };
          })
      );

      setTopProducts(topProductsList);
      setSummary({
        totalSales,
        averageOrderValue,
        totalItems,
        growth: 0, // Calculate actual growth rate
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  }

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Sales"
          value={`$${summary.totalSales.toFixed(2)}`}
          icon={<DollarSign />}
          trend="+12.5%"
        />
        <SummaryCard
          title="Average Order"
          value={`$${summary.averageOrderValue.toFixed(2)}`}
          icon={<TrendingUp />}
          trend="+5.2%"
        />
        <SummaryCard
          title="Items Sold"
          value={summary.totalItems.toString()}
          icon={<Package />}
          trend="+8.1%"
        />
        <SummaryCard
          title="Growth"
          value={`${summary.growth}%`}
          icon={<ArrowUpRight />}
          trend="+2.4%"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Daily Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Top Products</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Top Performing Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.revenue.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, trend }: any) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 bg-blue-50 rounded-lg">
          {React.cloneElement(icon, { className: 'h-6 w-6 text-blue-600' })}
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-600 text-sm font-medium">{trend}</span>
        <span className="text-gray-500 text-sm ml-1">vs last month</span>
      </div>
    </div>
  );
}