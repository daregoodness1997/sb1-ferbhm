export const menusFields = (categories: any[]) => [
  { label: "Menu Name", type: "text", name: "menuName", required: true },
  { label: "Description", type: "text", name: "description", required: true },
  { label: "Price", type: "number", name: "price", required: true },
  { label: "No of Serving Left", type: "number", name: "noOfServingsLeft" },
  { label: "Out of Stock", type: "checkbox", name: "outOfStock" },
  { label: "Minimum Serving", type: "number", name: "minServing" },

  {
    label: "Menu Category",
    type: "select",
    name: "menuCategoryID",
    options: categories.map((item) => ({
      value: item.menuCategoryID,
      label: item.menuCategoryName,
    })),

    required: true,
  },
];

export const menuCategoriesFields = [
  {
    label: "Menu Category",
    type: "text",
    name: "menuCategoryName",
    required: true,
  },
];
