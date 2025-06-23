import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';
import { formatPrice } from '@/lib/priceUtils';
import { useCountry } from '@/hooks/useCountry';
import { useCart } from '@/context/CartContext';
import { toast } from 'react-hot-toast';

interface ProductQuickViewModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price?: number;
    basePrice?: number;
    image: string;
    description?: string;
    notes?: { top?: string; heart?: string; base?: string };
    href?: string;
    sizes?: { label: string; value: number; priceFactor: number }[];
  } | null;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 18 } },
  exit: { opacity: 0, y: 40, scale: 0.98, transition: { duration: 0.2 } },
};

const defaultSizes = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

export default function ProductQuickViewModal({ open, onClose, product }: ProductQuickViewModalProps) {
  const country = useCountry();
  const { addToCart } = useCart();
  const sizes = product?.sizes || defaultSizes;
  const basePrice = product?.basePrice || product?.price || 0;
  const [selectedSize, setSelectedSize] = useState(sizes[2]); // default 100ml

  useEffect(() => {
    setSelectedSize(sizes[2]);
  }, [product]);

  if (!product) return null;

  const getPrice = () => {
    return Math.round(basePrice * selectedSize.priceFactor);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart({
        id: product.id,
        name: `${product.name} (${selectedSize.label})`,
        price: getPrice(),
        image: product.image,
        quantity: 1,
        size: selectedSize.label,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 flex flex-col md:flex-row gap-8 z-[9999]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-black transition-colors z-10"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Product Image */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden bg-gray-50 shadow-lg">
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
            <div className="flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-extrabold mb-2 text-gray-900">{product.name}</h2>
              {/* ml selection */}
              <div className="flex gap-2 mb-4">
                {sizes.map((size) => (
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
              {product.description && (
                <p className="text-gray-700 mb-4 text-base leading-relaxed line-clamp-5">{product.description}</p>
              )}
              {product.notes && (
                <ul className="mb-4 space-y-1 text-sm">
                  {product.notes.top && <li><span className="font-semibold text-gray-900">Top Notes:</span> {product.notes.top}</li>}
                  {product.notes.heart && <li><span className="font-semibold text-gray-900">Heart Notes:</span> {product.notes.heart}</li>}
                  {product.notes.base && <li><span className="font-semibold text-gray-900">Base Notes:</span> {product.notes.base}</li>}
                </ul>
              )}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-lg"
                >
                  Add to Cart ({selectedSize.label})
                </button>
                {product.href && (
                  <Link
                    href={product.href}
                    className="bg-pink-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-pink-800 transition-colors shadow-lg"
                  >
                    View Details
                  </Link>
                )}
                <button
                  className="bg-pink-100 text-pink-700 px-6 py-3 rounded-full font-semibold hover:bg-pink-200 transition-colors shadow-lg"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 