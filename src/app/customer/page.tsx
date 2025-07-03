"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./components/CartContext";
import CartDrawer from "./components/CartDrawer";
import MenuItemCard from "./components/MenuItemCard";
import ProtectedRoute from "../auth/ProtectedRoute";

// Header and navigation bar component
function CustomerHeader({ onCartClick }: { onCartClick: () => void }) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="w-full bg-blue-700 text-white shadow mb-6">
      <nav className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/customer" className="text-xl font-bold tracking-tight">CharityEats</Link>
        <div className="flex gap-4 items-center">
          <Link href="/customer/orders" className="hover:underline text-sm">Orders</Link>
          <Link href="/customer/favorites" className="hover:underline text-sm">Favorites</Link>
          <button
            className="relative bg-blue-600 px-3 py-1 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            onClick={onCartClick}
            aria-label="Open cart"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center" aria-label={`${itemCount} items in cart`}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CustomerHomePage() {
  const { addItem } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/vendors`);
        if (!response.ok) {
          throw new Error("Failed to fetch vendors");
        }
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <CustomerHeader onCartClick={() => setCartOpen(true)} />
        <main className="max-w-3xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-left text-black">Vendors</h1>
          <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
          <div className="space-y-8">
            {vendors.map((vendor) => (
              <section key={vendor.id} className="bg-white rounded shadow p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-black">{vendor.name}</h2>
                    <p className="text-black text-sm">{vendor.description}</p>
                  </div>
                  <Link href={`/customer/menu?vendor=${vendor.id}`} className="mt-2 sm:mt-0 text-blue-600 hover:underline text-sm font-medium">View Menu</Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  {vendor.menu.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      name={item.name}
                      description={item.description}
                      price={item.price}
                      onAddToCart={() => addItem({ id: item.id, name: item.name, price: item.price })}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
