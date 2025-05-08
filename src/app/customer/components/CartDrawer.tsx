import React from "react";
import { useCart } from "./CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black bg-opacity-30">
      <aside className="w-80 bg-white h-full shadow-lg p-4 flex flex-col transform transition-transform duration-300 translate-x-0 right-0 fixed">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart" className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {items.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto mb-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="block text-xs text-gray-500">x{item.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} aria-label={`Remove ${item.name}`} className="text-red-500 hover:text-red-700">🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto">
          <div className="flex justify-between font-semibold mb-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded mb-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={items.length === 0}
          >
            Checkout
          </button>
          <button
            className="w-full text-sm text-gray-600 hover:underline"
            onClick={clearCart}
            disabled={items.length === 0}
          >
            Clear Cart
          </button>
        </div>
      </aside>
      <button className="flex-1" onClick={onClose} aria-label="Close cart overlay" tabIndex={-1} />
    </div>
  );
}
