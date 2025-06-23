"use client";

import Image from "next/image";
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import Link from 'next/link';

export default function VelvetOrchidPage() {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const country = useCountry();

  // Product data for Velvet Orchid
  const product = {
    id: 'velvet-orchid',
    name: 'Velvet Orchid',
    basePrice: 95,
    image: '/product1.jpg', // Update this if the image is different in your data
    description: `A luxurious and sensual fragrance, Velvet Orchid blends rich florals, creamy vanilla, and a touch of spice for a scent that is both elegant and captivating.`,
    notes: {
      top: 'Orchid, Bergamot',
      heart: 'Rose, Jasmine',
      base: 'Vanilla, Sandalwood',
    },
    sizes: [
      { label: '25 mL', value: 25, priceFactor: 0.25 },
      { label: '50 mL', value: 50, priceFactor: 0.5 },
      { label: '100 mL', value: 100, priceFactor: 1 },
    ],
  };

  const [selectedSize, setSelectedSize] = useState(product.sizes[2]); // default 100ml

  const getPrice = () => {
    return Math.round(product.basePrice * selectedSize.priceFactor);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    await addToCart({
      id: product.id,
      name: `${product.name} (${selectedSize.label})`,
      price: getPrice(),
      image: product.image,
      quantity: 1,
      size: selectedSize.label,
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-yellow-50 px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-yellow-100 flex flex-col md:flex-row items-center p-8 gap-8 animate-fade-in-card">
        {/* Product Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-gray-50 shadow-lg border border-yellow-200">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-yellow-600 text-center md:text-left">{product.name}</h2>
          {/* Size Selector */}
          <div className="flex gap-2 mb-4">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${selectedSize.label === size.label ? 'bg-black text-white' : 'bg-white text-black border-gray-300'}`}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="text-xl font-bold text-pink-700 mb-4">{formatPrice(getPrice(), country)}</div>
          <p className="text-gray-700 mb-4 text-base leading-relaxed text-center md:text-left">{product.description}</p>
          <ul className="mb-4 space-y-1 text-sm">
            <li><span className="font-semibold text-gray-900">Top Notes:</span> {product.notes.top}</li>
            <li><span className="font-semibold text-gray-900">Heart Notes:</span> {product.notes.heart}</li>
            <li><span className="font-semibold text-gray-900">Base Notes:</span> {product.notes.base}</li>
          </ul>
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-full shadow-lg transition-colors text-lg mt-2"
          >
            {loading ? 'Adding...' : `Add to Cart (${selectedSize.label})`}
          </button>
          <Link href="/shop" className="mt-4 text-pink-600 hover:underline text-sm">Back to Shop</Link>
        </div>
      </div>
      {/* Tailwind animation utility */}
      <style global>{`
        @keyframes fade-in-card {
          0% { opacity: 0; transform: translateY(40px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-card {
          animation: fade-in-card 1.1s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </div>
  );
} 