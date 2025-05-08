"use client";

import React, { useState } from "react";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const initialMenu: MenuItem[] = [
  {
    id: "item1",
    name: "Veggie Burger",
    description: "A healthy veggie patty with fresh toppings.",
    price: 7.99,
  },
  {
    id: "item2",
    name: "Fries",
    description: "Crispy golden fries.",
    price: 2.99,
  },
  {
    id: "item3",
    name: "Chicken Curry",
    description: "Spicy and flavorful chicken curry.",
    price: 10.99,
  },
];

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

export default function VendorMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [form, setForm] = useState<MenuItem | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEdit = (idx: number) => {
    setEditIdx(idx);
    setForm(menu[idx]);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setForm(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSave = (idx: number) => {
    if (!form) return;
    setMenu((prev) => prev.map((item, i) => (i === idx ? form : item)));
    setEditIdx(null);
    setForm(null);
    setSuccess("Menu item updated!");
    setTimeout(() => setSuccess(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
      <VendorHeader />
      <main className="w-full max-w-2xl bg-white rounded shadow p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Edit Menu</h1>
          <Link
            href="/vendor"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium"
          >
            Back to Orders
          </Link>
        </div>
        <ul className="space-y-6">
          {menu.map((item, idx) => (
            <li key={item.id} className="border rounded p-4 bg-gray-50">
              {editIdx === idx && form ? (
                <form
                  className="space-y-2"
                  onSubmit={e => {
                    e.preventDefault();
                    handleSave(idx);
                  }}
                >
                  <div>
                    <label htmlFor={`name-${item.id}`} className="block text-sm font-medium text-black mb-1">Name</label>
                    <input
                      id={`name-${item.id}`}
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`desc-${item.id}`} className="block text-sm font-medium text-black mb-1">Description</label>
                    <textarea
                      id={`desc-${item.id}`}
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={2}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`price-${item.id}`} className="block text-sm font-medium text-black mb-1">Price ($)</label>
                    <input
                      id={`price-${item.id}`}
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm font-medium">Save</button>
                    <button type="button" onClick={handleCancel} className="bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 focus:outline-none text-sm font-medium">Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-black text-lg">{item.name}</h2>
                    <p className="text-black text-sm mb-1">{item.description}</p>
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => handleEdit(idx)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm font-medium"
                    aria-label={`Edit ${item.name}`}
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {success && (
          <div className="mt-4 text-green-700 bg-green-100 px-4 py-2 rounded text-sm">{success}</div>
        )}
      </main>
    </div>
  );
}
