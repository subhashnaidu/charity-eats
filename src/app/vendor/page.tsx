"use client";

import React from "react";
import Link from "next/link";

interface Order {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: string;
}

const sampleOrders: Order[] = [
  {
    id: "order1",
    customerName: "Alice",
    items: [
      { name: "Veggie Burger", quantity: 2 },
      { name: "Fries", quantity: 1 },
    ],
    status: "pending",
    createdAt: "2025-05-07T10:00:00Z",
  },
  {
    id: "order2",
    customerName: "Bob",
    items: [
      { name: "Chicken Curry", quantity: 1 },
    ],
    status: "preparing",
    createdAt: "2025-05-07T10:05:00Z",
  },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
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

export default function VendorHomePage() {
  const [orders, setOrders] = React.useState<Order[]>(sampleOrders);
  const [notification, setNotification] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'incoming' | 'completed'>('incoming');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOrders((prev) => [
        {
          id: "order3",
          customerName: "Charlie",
          items: [
            { name: "Naan Bread", quantity: 3 },
          ],
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNotification("New order received!");
      setTimeout(() => setNotification(null), 2000);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const incomingOrders = orders.filter(o => o.status !== 'completed');
  const completedOrders = orders.filter(o => o.status === 'completed');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-0">
      <VendorHeader />
      <main className="w-full max-w-2xl bg-white rounded shadow p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Order Management</h1>
          <Link
            href="/vendor/menu"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm font-medium"
          >
            Edit Menu
          </Link>
        </div>
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex gap-4" aria-label="Tabs">
            <button
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'incoming' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
              onClick={() => setTab('incoming')}
              aria-current={tab === 'incoming' ? 'page' : undefined}
            >
              Incoming Orders
            </button>
            <button
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${tab === 'completed' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-700'}`}
              onClick={() => setTab('completed')}
              aria-current={tab === 'completed' ? 'page' : undefined}
            >
              Completed Orders
            </button>
          </nav>
        </div>
        {tab === 'incoming' ? (
          <section>
            <h2 className="sr-only">Incoming Orders</h2>
            {incomingOrders.length === 0 ? (
              <p className="text-gray-500 text-center">No incoming orders.</p>
            ) : (
              <ul className="space-y-4">
                {incomingOrders.map((order) => (
                  <li key={order.id} className="border rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-black">Order #{order.id}</span>
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-black">Customer:</span> {order.customerName}
                    </div>
                    <ul className="mb-2 text-sm text-black">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} <span className="text-gray-500">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 mt-2">
                      <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-black">Status:</label>
                      <select
                        id={`status-${order.id}`}
                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${order.status === "ready" ? "bg-green-200 text-green-800" : order.status === "preparing" ? "bg-yellow-100 text-yellow-800" : order.status === "pending" ? "bg-gray-200 text-gray-800" : "bg-gray-100 text-gray-400"}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section>
            <h2 className="sr-only">Completed Orders</h2>
            {completedOrders.length === 0 ? (
              <p className="text-gray-500 text-center">No completed orders.</p>
            ) : (
              <ul className="space-y-4">
                {completedOrders.map((order) => (
                  <li key={order.id} className="border rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-black">Order #{order.id}</span>
                      <span className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-black">Customer:</span> {order.customerName}
                    </div>
                    <ul className="mb-2 text-sm text-black">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} <span className="text-gray-500">x{item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-400">Completed</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-blue-700 text-white px-4 py-2 rounded shadow-lg z-50 text-sm animate-fade-in">
          {notification}
        </div>
      )}
    </div>
  );
}