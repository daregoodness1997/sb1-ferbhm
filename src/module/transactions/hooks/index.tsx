import React, { useState, useEffect } from "react";
import { db } from "@/lib/db";
import useFetch from "@/hooks/use-fetch";
import { v4 as uuidv4 } from "uuid";

const useTransaction = () => {
  const {
    items: transactions,
    loading,
    error,
    refetch,
  } = useFetch("inventory_transactions", db);

  const [filter, setFilter] = useState<"all" | "in" | "out" | "sales">("all");
  const [startDate, setStartDate] = useState<string>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const locationID = localStorage.getItem("locationID") || "";
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59); // Include the entire end date

    const matchesType = filter === "all" ? true : t.type === filter;
    const matchesDateRange = transactionDate >= start && transactionDate <= end;

    return matchesType && matchesDateRange;
  });

  return {
    transactions: filteredTransactions,
    loading,
    error,
    refetch,
    filter,
    setFilter,
    setStartDate,
    setEndDate,
    startDate,
    endDate,
  };
};

export default useTransaction;
