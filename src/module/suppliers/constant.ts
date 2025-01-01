export const customersFields = [
  {
    label: "Supplier",
    type: "text",
    name: "supplierName",
    required: true,
  },
  {
    label: "Contact Person",
    type: "text",
    name: "contactPerson",
    required: true,
  },
  {
    label: "Contact Email",
    type: "email",
    name: "email",
  },
  {
    label: "Contact Phone",
    type: "text",
    name: "phone",
  },
  {
    label: "Contact Address",
    type: "text",
    name: "address",
    required: true,
  },
  {
    label: "Website",
    type: "text",
    name: "website",
  },

  {
    label: "Payment Terms",
    type: "select",
    name: "paymentTerms",
    options: [
      { value: "Net 30", label: "Net 30" },
      { value: "Net 45", label: "Net 45" },
      { value: "Net 60", label: "Net 60" },
      { value: "Net 90", label: "Net 90" },
      { value: "Due on Receipt", label: "Due on Receipt" },
      { value: "2/10 Net 30", label: "2/10 Net 30" },
      { value: "COD", label: "COD (Cash on Delivery)" },
      { value: "Due When Consumed", label: "Due When Consumed" },
    ],
  },
];
