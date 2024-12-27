export const inventoryFields = (vendors: any[]) => [
  { label: "Name", type: "text", name: "name", required: true },
  { label: "SKU", type: "text", name: "sku", required: true },
  { label: "Quantity", type: "number", name: "quantity" },
  {
    label: "Minimum Quantity",
    type: "number",
    name: "minQuantity",
    required: true,
  },
  { label: "Price", type: "number", name: "price", required: true },
  {
    label: "Category",
    type: "select",
    name: "category",
    options: [
      { value: "Raw Materials", label: "Raw Materials" },
      { value: "Finished Goods", label: "Finished Goods" },
    ],
    required: true,
  },
  {
    label: "Vendors",
    type: "select",
    name: "vendors",
    options: vendors.map((item) => ({ value: item.name, label: item.name })),
  },
];
