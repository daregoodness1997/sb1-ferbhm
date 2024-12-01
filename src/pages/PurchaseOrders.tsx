import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Plus, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

type OrderStatus = 'pending' | 'approved' | 'received' | 'cancelled';

interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  status: OrderStatus;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  createdAt: Date;
  expectedDelivery: Date;
}

export function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    // Simulated data - in a real app, this would come from IndexedDB
    const mockOrders: PurchaseOrder[] = [
      {
        id: '1',
        vendorId: 'v1',
        vendorName: 'Tech Supplies Inc',
        status: 'pending',
        items: [
          { id: '1', name: 'Laptop', quantity: 5, price: 999.99 },
          { id: '2', name: 'Mouse', quantity: 10, price: 29.99 }
        ],
        totalAmount: 5299.95,
        createdAt: new Date('2024-03-15'),
        expectedDelivery: new Date('2024-03-25')
      },
      {
        id: '2',
        vendorId: 'v2',
        vendorName: 'Office Solutions',
        status: 'approved',
        items: [
          { id: '3', name: 'Desk Chair', quantity: 3, price: 199.99 }
        ],
        totalAmount: 599.97,
        createdAt: new Date('2024-03-14'),
        expectedDelivery: new Date('2024-03-24')
      }
    ];

    setOrders(mockOrders);
    setLoading(false);
  }

  const getStatusDetails = (status: OrderStatus) => {
    const config = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        variant: 'warning' as const,
      },
      approved: {
        icon: <CheckCircle className="h-4 w-4" />,
        variant: 'success' as const,
      },
      received: {
        icon: <Package className="h-4 w-4" />,
        variant: 'info' as const,
      },
      cancelled: {
        icon: <XCircle className="h-4 w-4" />,
        variant: 'error' as const,
      },
    };

    return config[status];
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track purchase orders</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => {
          const statusDetails = getStatusDetails(order.status);
          
          return (
            <Card key={order.id}>
              <Card.Header>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      PO-{order.id}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{order.vendorName}</p>
                  </div>
                  <Badge variant={statusDetails.variant} className="gap-1.5">
                    {statusDetails.icon}
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                </div>
              </Card.Header>

              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Item
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/50">
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 text-right">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-sm text-gray-900 text-right">
                            ${(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50/50">
                        <td colSpan={3} className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                          Total Amount:
                        </td>
                        <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                  <div>Created: {format(new Date(order.createdAt), 'MMM d, yyyy')}</div>
                  <div>Expected Delivery: {format(new Date(order.expectedDelivery), 'MMM d, yyyy')}</div>
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </div>
  );
}