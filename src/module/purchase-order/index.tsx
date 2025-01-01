import AppLayout from "@/components/app-layout";
import Modal from "@/components/ui/Modal";
import {
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Plus,
  Badge,
  View,
} from "lucide-react";
import React, { useState, memo } from "react";
import usePurchaseOrder from "./hooks";
import { Card } from "@/components/ui/Card";
import { format } from "date-fns";
import PurchaseOrderForm from "./components/PurchaseOrderForm";
import CancelOrder from "./components/CancelOrder";

type View = "create" | "cancel" | "approve" | "recieve";

type OrderStatus = "requested" | "approved" | "received" | "cancelled" | "paid";

const PurchaseOrderModule = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState({ purchaseOrderID: "" });
  const [view, setView] = useState<View>("create");
  const {
    items: orders,
    products,
    vendors,
    loading,
    refetch,
    handleEditItem,
  } = usePurchaseOrder();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }
  const getStatusDetails = (status: OrderStatus) => {
    const config = {
      requested: {
        icon: <Clock className="h-4 w-4" />,
        variant: "orange" as const,
        text: "Pending",
      },
      approved: {
        icon: <CheckCircle className="h-4 w-4" />,
        variant: "green" as const,
        text: "Approved",
      },
      recieved: {
        icon: <Package className="h-4 w-4" />,
        variant: "blue" as const,
        text: "Recieved",
      },
      cancelled: {
        icon: <XCircle className="h-4 w-4" />,
        variant: "red" as const,
        text: "Cancelled",
      },
      paid: {
        icon: <CheckCircle className="h-4 w-4" />,
        variant: "purple" as const,
        text: "Paid",
      },
    };

    return config[status];
  };

  const handleCancelOrder = () => {
    handleEditItem(selectedItem, selectedItem.purchaseOrderID, "cancel");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <AppLayout
        title="Purchase Order"
        description="Manage and track purchase orders"
        actions={
          <button
            onClick={() => {
              setIsOpen(true);
              setView("create");
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Order
          </button>
        }
      >
        <div>
          <div className="flex flex-col ">
            {orders &&
              orders.map((order: any) => {
                console.log(order?.status, "status");
                const statusDetails = getStatusDetails(order?.status);
                const getVendor = (id: string) =>
                  vendors.find((item: any) => item.supplierID === id);

                return (
                  <div className="p-4">
                    <Card key={order?.purchaseOrderID} className="bg-gray-100">
                      <Card.Header>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              PO-{order?.purchaseOrderID}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {getVendor(order?.vendorId)?.supplierName}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 gap-2 rounded-full text-xs font-medium bg-${statusDetails?.variant}-100 text-${statusDetails?.variant}-800`}
                            >
                              {statusDetails?.icon}
                              <span className="capitalize">
                                {statusDetails?.text}
                              </span>
                            </span>
                          </div>
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
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                  Quantity Recieved
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
                              {order &&
                                order?.items.map((item: any) => {
                                  const getProduct = (id: string) =>
                                    products.find(
                                      (item: any) => item.productID === id
                                    );

                                  return (
                                    <tr
                                      key={item?.inventoryID}
                                      className="hover:bg-gray-50/50"
                                    >
                                      <td className="px-3 py-2 text-sm text-gray-900">
                                        {getProduct(item?.productID || "")
                                          ?.name || ""}
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900">
                                        {item?.quantity}
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900">
                                        {item?.quantityRecieved || "-"}
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                                        ₦{item?.amount.toFixed(2)}
                                      </td>
                                      <td className="px-3 py-2 text-sm text-gray-900 text-right">
                                        ₦
                                        {(
                                          item?.quantity * item?.amount
                                        ).toFixed(2)}
                                      </td>
                                    </tr>
                                  );
                                })}
                              <tr className="bg-gray-50/50 ">
                                <td
                                  colSpan={4}
                                  className="px-3 py-2 text-right text-sm font-medium text-gray-900"
                                >
                                  Total Amount:
                                </td>
                                <td className="px-3 py-2 text-right text-sm font-medium text-gray-900">
                                  ₦
                                  {order?.items
                                    .reduce(
                                      (total: number, item: any) =>
                                        total + item.quantity * item.amount,
                                      0
                                    )
                                    .toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                          <div>
                            Created:{" "}
                            {format(
                              new Date(order?.lastUpdated),
                              "MMM d, yyyy hh:mm:ss"
                            )}
                          </div>
                          <div>
                            Expected Delivery:{" "}
                            {format(
                              new Date(order?.expectedDelivery),
                              "MMM d, yyyy"
                            )}
                          </div>
                        </div>
                      </Card.Content>
                      <div className="flex justify-end space-x-3 p-4">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(true);
                            setView("cancel");
                            setSelectedItem(order);
                          }}
                          disabled={
                            order?.status === "cancelled" ? true : false
                          }
                          className={`px-3 py-1 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-gray-50 ${
                            order?.status === "cancelled"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Cancel Order
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleEditItem(
                              order,
                              order.purchaseOrderID,
                              "approve"
                            );
                          }}
                          disabled={order?.status === "approved" ? true : false}
                          className={`px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
                            order?.status === "approved"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Mark as Approved
                        </button>
                        <button
                          type="button"
                          disabled={order?.status === "recieved" ? true : false}
                          onClick={() => {
                            setIsOpen(true);
                            setView("recieve");
                            setSelectedItem(order);
                          }}
                          className={`px-3 py-1 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 ${
                            order?.status === "recieved"
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Recieve Order
                        </button>
                      </div>{" "}
                    </Card>
                  </div>
                );
              })}
          </div>

          <Modal
            isOpen={isOpen}
            title={`${view} Purchase Order`}
            handleClose={(e) => setIsOpen(false)}
          >
            {view === "create" && <PurchaseOrderForm refetch={refetch} />}
            {view === "recieve" && (
              <PurchaseOrderForm
                refetch={refetch}
                isEditing={true}
                initialData={selectedItem}
              />
            )}
            {view === "cancel" && (
              <CancelOrder onClick={handleCancelOrder} onClose={handleClose} />
            )}
          </Modal>
        </div>
      </AppLayout>
    </div>
  );
};

export default memo(PurchaseOrderModule);
