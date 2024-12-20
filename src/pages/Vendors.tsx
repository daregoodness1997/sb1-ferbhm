import { useState, useEffect } from "react";
import { db } from "../lib/db";
import { Plus, X, Eye, Edit2 } from "lucide-react";

interface Vendor {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    try {
      const database = await db;
      const tx = database.transaction("vendors", "readonly");
      const store = tx.store;
      const rawVendors = await store.getAll();
      const transformedVendors = rawVendors.map((v) => ({
        id: Number(v.id),
        name: v.name,
        email: v.email,
        phone: v.phone,
        address: "",
        notes: "",
      }));
      setVendors(transformedVendors);
    } catch (error) {
      console.error("Failed to load vendors:", error);
    }
  }

  async function handleAddVendor(newVendor: Vendor) {
    try {
      const database = await db;
      const tx = database.transaction("vendors", "readwrite");
      const store = tx.store;

      const vendor = {
        id: String(Date.now()),
        name: newVendor.name,
        contact: newVendor.name,
        email: newVendor.email,
        phone: newVendor.phone,
        lastOrder: new Date(),
      };

      await store.add(vendor);
      await tx.done;

      await loadVendors();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add vendor:", error);
    }
  }

  async function handleEditVendor(updatedVendor: Vendor) {
    try {
      const database = await db;
      const tx = database.transaction("vendors", "readwrite");
      const store = tx.store;

      const vendor = {
        ...updatedVendor,
        lastUpdated: new Date().toISOString(),
      };

      await store.put(vendor);
      await tx.done;

      await loadVendors();
      setIsEditModalOpen(false);
      setSelectedVendor(null);
    } catch (error) {
      console.error("Failed to update vendor:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td className="px-6 py-4 whitespace-nowrap">{vendor.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vendor.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{vendor.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setIsViewModalOpen(true);
                    }}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Eye className="h-4 w-4 inline" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVendor(vendor);
                      setIsEditModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditModalOpen ? "Edit Vendor" : "Add Vendor"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedVendor(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <VendorForm
              onSubmit={isEditModalOpen ? handleEditVendor : handleAddVendor}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedVendor(null);
              }}
              initialData={selectedVendor}
            />
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vendor Details</h2>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedVendor(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedVendor.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedVendor.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedVendor.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedVendor.address}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1 text-sm text-gray-900">
                  {selectedVendor.notes}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VendorForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (vendor: Vendor) => void;
  onCancel: () => void;
  initialData?: Vendor | null;
}) {
  const [formData, setFormData] = useState<Vendor>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
    ...initialData,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <textarea
          required
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          {initialData ? "Update" : "Add"} Vendor
        </button>
      </div>
    </form>
  );
}
