import AppLayout from "@/components/app-layout";
import Modal from "@/components/ui/Modal";
import { AlertTriangle, Edit2, Eye, Plus } from "lucide-react";
import React, { useState, memo } from "react";
import { Table } from "@/components/ui/Table";
import Form from "@/components/ui/Form";
import DetailedVew from "@/components/detailed-vew";
import useCategory from "./hooks";
import { categoriesFields } from "./constant";
import { Badge } from "@/components/ui/Badge";

type View = "create" | "view" | "edit";

const CategoriesModule = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { items, loading, handleAddItem, handleEditItem } = useCategory();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [view, setView] = useState<View>("create");

  const columns = [
    {
      key: "categoryName",
      label: "Category",
    },
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
        </div>
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
        title="Categories"
        description="Manage your categories"
        actions={
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        }
      >
        <div>
          <Table data={items} columns={columns} />
          <Modal
            title="Add New Item"
            handleClose={() => {
              setIsOpen(false);
              setSelectedItem(null);
            }}
            isOpen={isOpen}
          >
            {view === "view" ? (
              <DetailedVew selectedItem={selectedItem} />
            ) : (
              <Form
                fields={categoriesFields}
                onSubmit={view === "create" ? handleAddItem : handleEditItem}
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

export default memo(CategoriesModule);
