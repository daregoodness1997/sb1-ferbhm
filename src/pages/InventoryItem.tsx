import React from "react";
import { useParams } from "react-router-dom";
import { InventoryAnalytic } from "../components/InventoryAnalytics";

export function InventoryItem() {
  const { id } = useParams();

  return (
    <div>
      <InventoryAnalytic itemId={id || ""} />
    </div>
  );
}
