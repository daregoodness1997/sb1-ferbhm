export const inventoryFields = (products: any[], categories: any[]) => [
  {
    label: "Product",
    type: "select",
    name: "productID",
    options: products.map((item) => ({
      value: item.productID,
      label: item.productName || item.name,
    })),
  },

  { label: "Quantity", type: "number", name: "quantity" },
  {
    label: "Minimum Quantity",
    type: "number",
    name: "minQuantity",
  },
];
