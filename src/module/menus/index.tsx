import AppLayout from "@/components/app-layout";
import Modal from "@/components/ui/Modal";
import {
  AlertTriangle,
  BarChart2,
  Edit2,
  Eye,
  Plus,
  Search,
} from "lucide-react";
import React, { useState, memo } from "react";
import { Table } from "@/components/ui/Table";
import { Link } from "react-router-dom";
import Form from "@/components/ui/Form";
import DetailedVew from "@/components/detailed-vew";
import useProduct from "./hooks";
import { productsFields } from "./constant";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

type View = "create" | "view" | "edit";

const MenusModule = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { items, categories, loading, handleAddItem, handleEditItem } =
    useProduct();
  const [selectedItem, setSelectedItem] = useState<any>({
    categoryID: "",
  });
  const [view, setView] = useState<View>("create");

  const columns = [
    { key: "name", label: "Item" },
    { key: "sku", label: "SKU" },
    {
      key: "status",
      label: "Status",
      render: (item) =>
        item.status === "in-active" ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Inactive
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ),
    },
    {
      key: "lastUpdated",
      label: "Last Updated",
      render: (item) => new Date(item.lastUpdated).toLocaleDateString(),
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
    {
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="text-left text-sm font-medium space-x-3">
          <button
            onClick={() => {
              setView("view");
              setSelectedItem(item);
              setIsOpen(true);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            <Eye className="h-4 w-4 inline" />
          </button>
          <button
            onClick={() => {
              setSelectedItem(item);
              setIsOpen(true);
              setView("edit");
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            <Edit2 className="h-4 w-4 inline" />
          </button>
          <Link
            to={`/inventory/${item.id}`}
            className="text-purple-600 hover:text-purple-900"
          >
            <BarChart2 className="h-4 w-4 inline" />
          </Link>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  const reformedSelectedItem = {
    ...selectedItem,
    ...(selectedItem?.categoryID && {
      categoryID: categories.find(
        (category) => category.categoryID === selectedItem?.categoryID
      )?.categoryName,
    }),
  };
  console.log(reformedSelectedItem);

  return (
    <div>
      <AppLayout title="Menus" description="Manage your menus" actions={<></>}>
        <div>
          <div className="grid grid-cols-2 gap-8 p-4">
            <Card className="bg-gray-100 p-2">
              <div className="flex justify-between mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedItem({});
                    setView("create");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Menu
                </button>
              </div>
              <Table data={items} columns={columns} />
            </Card>
            <Card className="bg-gray-100 p-2">
              <div className="flex justify-between mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu category..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setSelectedItem({});
                    setView("create");
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Menu Category
                </button>
              </div>
              <Table data={items} columns={columns} />
            </Card>
          </div>
          <Modal
            title="Add New Item"
            handleClose={() => {
              setIsOpen(false);
              setSelectedItem(null);
            }}
            isOpen={isOpen}
          >
            {view === "view" ? (
              <DetailedVew selectedItem={reformedSelectedItem} />
            ) : (
              <Form
                fields={productsFields(categories)}
                onSubmit={
                  view === "create"
                    ? handleAddItem
                    : (data) => handleEditItem(data, selectedItem.productID)
                }
                onCancel={() => setIsOpen(false)}
                initialData={view === "edit" ? selectedItem : []}
              />
            )}
          </Modal>
        </div>
      </AppLayout>
    </div>
  );
};

export default memo(MenusModule);
