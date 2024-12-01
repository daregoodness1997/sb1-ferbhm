import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Plus, Phone, Mail } from 'lucide-react';

export function Vendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  async function loadVendors() {
    try {
      const database = await db;
      const tx = await database.transaction('vendors', 'readonly');
      const vendors = await tx.store.getAll();
      setVendors(vendors);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Vendor Directory</h3>
          <p className="text-sm text-gray-500">Manage your supplier relationships</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{vendor.name}</h4>
                <p className="text-sm text-gray-500">{vendor.contact}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500">
                <Phone className="h-4 w-4 mr-2" />
                {vendor.phone}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Mail className="h-4 w-4 mr-2" />
                {vendor.email}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Last Order: {new Date(vendor.lastOrder).toLocaleDateString()}
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}