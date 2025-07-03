"use client";

import React from "react";
import Link from "next/link";
import ProtectedRoute from "../auth/ProtectedRoute";

interface Vendor {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  metrics: {
    totalOrders: number;
    averageRating: number;
    revenue: number;
  };
}

const sampleVendors: Vendor[] = [
  {
    id: "vendor1",
    name: "Tasty Bites",
    description: "Delicious street food and snacks.",
    status: "active",
    metrics: {
      totalOrders: 125,
      averageRating: 4.5,
      revenue: 2500.00,
    },
  },
  {
    id: "vendor2",
    name: "Spice Corner",
    description: "Authentic Indian cuisine.",
    status: "active",
    metrics: {
      totalOrders: 85,
      averageRating: 4.8,
      revenue: 1800.00,
    },
  },
];

function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-blue-700 text-white shadow mb-6">
      <nav className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/admin" className="text-xl font-bold tracking-tight">CharityEats Admin</Link>
        <div className="flex gap-4 items-center">
          <Link href="/admin" className="hover:underline text-sm">Dashboard</Link>
          <Link href="/admin/vendors" className="hover:underline text-sm">Vendors</Link>
          <Link href="/admin/customers" className="hover:underline text-sm">Customers</Link>
          <Link href="/admin/reports" className="hover:underline text-sm">Reports</Link>
        </div>
      </nav>
    </header>
  );
}

function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{vendor.name}</h3>
          <p className="text-gray-600">{vendor.description}</p>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              vendor.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {vendor.status === "active" ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-sm text-gray-600">Total Orders: {vendor.metrics.totalOrders}</p>
          <p className="text-sm text-gray-600">Average Rating: {vendor.metrics.averageRating}</p>
          <p className="text-sm text-gray-600">Revenue: ${vendor.metrics.revenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
          Edit
        </button>
        <button className="px-4 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">
          Remove
        </button>
      </div>
    </div>
  );
}

const AdminPage = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <AdminHeader />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Add New Vendor
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Generate Report
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Vendor Performance</h2>
            <div className="space-y-4">
              {sampleVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
