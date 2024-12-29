import AppLayout from "@/components/app-layout";
import Modal from "@/components/ui/Modal";
import { AlertTriangle, BarChart2, Edit2, Eye, Plus } from "lucide-react";
import React, { useState, memo } from "react";
import { Table } from "@/components/ui/Table";
import { Link } from "react-router-dom";
import Form from "@/components/ui/Form";
import DetailedVew from "@/components/detailed-vew";
import { locationsFields } from "./constant";
import useFetch from "@/hooks/use-fetch";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";

type View = "create" | "view" | "edit";

const ActivityModule = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { items, loading } = useFetch("activities", db);
  const [selectedItem, setSelectedItem] = useState<any>({
    categoryID: "",
  });
  const [view, setView] = useState<View>("create");

  const columns = [
    { key: "actionType", label: "Action Type" },
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
      key: "createdAt",
      label: "Created At",
      render: (item) => new Date(item.createdAt).toLocaleString(),
    },
    { key: "locationID", label: "Location" },
    { key: "actionedBy", label: "actionedBy" },

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
        title="Activities"
        description="Keep track of all your activities"
        actions={<div></div>}
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
            <DetailedVew selectedItem={selectedItem} />
          </Modal>
        </div>
      </AppLayout>
    </div>
  );
};

export default memo(ActivityModule);
