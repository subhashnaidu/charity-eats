import React from "react";

interface MenuItemCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAddToCart: () => void;
}

export default function MenuItemCard({
  name,
  description,
  price,
  imageUrl,
  onAddToCart,
}: MenuItemCardProps) {
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col items-center" tabIndex={0} aria-label={name}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="w-24 h-24 object-cover rounded mb-2"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded mb-2" aria-hidden="true" />
      )}
      <h2 className="font-semibold text-center">{name}</h2>
      <p className="text-sm text-gray-500 mb-2 text-center">{description}</p>
      <span className="font-bold mb-2">${price.toFixed(2)}</span>
      <button
        className="mt-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onAddToCart}
        aria-label={`Add ${name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
}
