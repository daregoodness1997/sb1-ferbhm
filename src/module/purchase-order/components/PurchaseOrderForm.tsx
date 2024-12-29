import { Input } from "@/components/ui/Input";
import React, { FC, useState } from "react";
import usePurchaseOrder from "../hooks";
import Select from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Trash } from "lucide-react";

interface Props {
  refetch: () => void;
}

const PurchaseOrderForm: FC<Props> = ({ refetch }) => {
  const [formData, setFormData] = useState({
    vendorId: "",
    items: [] as Array<{
      inventoryID: string;
      productID: string;
      quantity: number;
      amount: number;
    }>,
    expectedDelivery: new Date().toISOString().split("T")[0],
  });

  const { vendors, inventory, products, handleAddItem } = usePurchaseOrder();
  const getProduct = (id) => products.find((item) => item.productID === id);

  const addItem = () => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      items: [
        ...prev.items,
        { inventoryID: "", productID: "", quantity: 0, amount: 0 },
      ],
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData((prev: typeof formData) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddItem(formData);
    refetch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            label="Supplier"
            required
            value={formData.vendorId}
            onChange={(e) =>
              setFormData((prev: typeof formData) => ({
                ...prev,
                vendorId: e.target.value,
              }))
            }
            options={vendors.map((item) => ({
              value: item.supplierID,
              label: item.supplierName,
            }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Delivery
          </label>
          <Input
            type="date"
            required
            value={formData.expectedDelivery}
            onChange={(e) =>
              setFormData((prev: typeof formData) => ({
                ...prev,
                expectedDelivery: e.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="space-y-2 my-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-700">Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>

        {formData.items.length > 0 && (
          <Card className="p-1.5">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <Select
                        required
                        value={item.name}
                        onChange={(e) => {
                          updateItem(index, "inventoryID", e.target.value);
                          updateItem(index, "productID", e.target.value);
                        }}
                        options={inventory.map((item) => ({
                          value: item.productID,
                          label:
                            getProduct(item?.productID || "")?.productName ||
                            getProduct(item?.productID || "")?.name,
                        }))}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        placeholder="Quantity"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        placeholder="Price"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "amount",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td className="text-center text-sm font-medium space-x-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setFormData((prev: typeof formData) => ({
                            ...prev,
                            items: prev.items.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash style={{ color: "red" }} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
