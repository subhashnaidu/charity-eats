"use client";

import React, { useState } from "react";
import Link from "next/link";

// Simulated vendor data (replace with API integration as needed)
const initialVendor = {
  name: "Tasty Bites",
  description: "Delicious street food and snacks.",
};

function VendorHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-blue-700 text-white shadow mb-6">
      <nav className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/vendor" className="text-xl font-bold tracking-tight">CharityEats Vendor</Link>
        <div className="flex gap-4 items-center">
          <Link href="/vendor" className="hover:underline text-sm">Orders</Link>
          <Link href="/vendor/menu" className="hover:underline text-sm">Menu</Link>
          <Link href="/vendor/profile" className="hover:underline text-sm">Profile</Link>
        </div>
      </nav>
    </header>
  );
}

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState(initialVendor);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialVendor);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => {
    setEditing(true);
    setForm(vendor);
  };

  const handleCancel = () => {
    setEditing(false);
    setForm(vendor);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setVendor(form);
    setEditing(false);
    setSuccess("Profile updated successfully!");
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
      <VendorHeader />
      <main className="w-full max-w-2xl bg-white rounded shadow p-6 mt-8">
        <h1 className="text-2xl font-bold mb-4 text-black">Vendor Profile</h1>
        {editing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">Vendor Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-black mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium">Save</button>
              <button type="button" onClick={handleCancel} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 focus:outline-none text-sm font-medium">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="block text-sm font-medium text-black mb-1">Vendor Name</span>
              <span className="text-lg text-black">{vendor.name}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-black mb-1">Description</span>
              <span className="text-black">{vendor.description}</span>
            </div>
            <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium">Edit Profile</button>
          </div>
        )}
        {success && (
          <div className="mt-4 text-blue-700 bg-blue-100 px-4 py-2 rounded text-sm">{success}</div>
        )}
      </main>
    </div>
  );
}
