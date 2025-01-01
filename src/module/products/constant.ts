export const productsFields = (categories: any[]) => [
  { label: "Name", type: "text", name: "name", required: true },
  { label: "SKU", type: "text", name: "sku", required: true },

  {
    label: "Category",
    type: "select",
    name: "categoryID",
    options: categories.map((item) => ({
      value: item.categoryID,
      label: item.categoryName,
    })),

    required: true,
  },
];
