"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "../components/CartContext";
import MenuItemCard from "../components/MenuItemCard";
import Link from "next/link";
import CartDrawer from "../components/CartDrawer";

// Sample vendor data (should be replaced with real data or API in production)
const vendors = [
  {
    id: "vendor1",
    name: "Tasty Bites",
    description: "Delicious street food and snacks.",
    menu: [
      { id: "item1", name: "Veggie Burger", description: "A healthy veggie patty with fresh toppings.", price: 7.99 },
      { id: "item2", name: "Fries", description: "Crispy golden fries.", price: 2.99 },
    ],
  },
  {
    id: "vendor2",
    name: "Spice Corner",
    description: "Authentic Indian cuisine.",
    menu: [
      { id: "item3", name: "Chicken Curry", description: "Spicy and flavorful chicken curry.", price: 10.99 },
      { id: "item4", name: "Naan Bread", description: "Soft, fresh naan.", price: 1.99 },
    ],
  },
];

function VendorMenuHeader({ onCartClick }: { onCartClick: () => void }) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="w-full bg-blue-700 text-white shadow mb-6">
      <nav className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/customer" className="text-lg font-bold tracking-tight">CharityEats</Link>
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
      </nav>
    </header>
  );
}

export default function VendorMenuPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");
  const vendor = vendors.find((v) => v.id === vendorId);
  const { addItem } = useCart();
  const [cartOpen, setCartOpen] = React.useState(false);

  if (!vendor) {
    return (
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <Link href="/customer" className="text-blue-600 hover:underline">Back to Vendors</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VendorMenuHeader onCartClick={() => setCartOpen(true)} />
      <main className="max-w-2xl mx-auto p-4">
        <Link href="/customer" className="text-blue-600 hover:underline text-sm">&larr; Back to Vendors</Link>
        <h1 className="text-2xl font-bold mb-2 mt-2">{vendor.name}</h1>
        <p className="text-black mb-6">{vendor.description}</p>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </main>
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}