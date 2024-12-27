import AppLayout from "@/components/app-layout";
import Modal from "@/components/ui/Modal";
import { AlertTriangle, BarChart2, Edit2, Eye, Plus } from "lucide-react";
import React, { useState, memo } from "react";
import { Table } from "@/components/ui/Table";
import { Link } from "react-router-dom";
import Form from "@/components/ui/Form";
import DetailedVew from "@/components/detailed-vew";
import useProduct from "./hooks";
import { locationsFields } from "./constant";

type View = "create" | "view" | "edit";

const LocationsModule = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { items, loading, handleAddItem, handleEditItem } = useProduct();
  const [selectedItem, setSelectedItem] = useState<any>({
    categoryID: "",
  });
  const [view, setView] = useState<View>("create");

  const columns = [
    { key: "locationName", label: "Location" },
    { key: "email", label: "email" },
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
      key: "actions",
      label: "Actions",
      render: (item) => (
        <div className="text-right text-sm font-medium space-x-3">
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
        title="Products"
        description="Manage your products"
        actions={
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Location
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
                fields={locationsFields}
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

export default memo(LocationsModule);
