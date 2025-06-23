"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import { useCart } from '@/context/CartContext';
import ProductQuickViewModal from '@/app/components/ProductQuickViewModal';
import LazyLoader from '@/components/ui/LazyLoader';

export default function BestsellersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const country = useCountry();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?page=Bestsellers');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (product: any) => {
    await addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[60vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Bestsellers Hero"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6"
          >
            BESTSELLERS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Our most loved fragrances, chosen by you
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-light mb-6">CUSTOMER FAVORITES</h2>
          <p className="text-gray-600">
            Discover our most iconic fragrances that have captured hearts worldwide.
            Each scent tells a unique story of luxury and sophistication.
          </p>
        </motion.div>

        {/* Bestsellers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {products.length === 0 ? (
            <p>No bestsellers found.</p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product._id || product.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 cursor-pointer rounded-xl border border-gray-100 bg-gray-50"
                  onClick={() => handleQuickView(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{product.subtext}</p>
                  <p className="text-xl font-extrabold text-pink-600 mb-2">
                    {typeof product.price === 'number'
                      ? formatPrice(product.price, country)
                      : product.price}
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(product.rating || 5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-current text-yellow-400"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleQuickView(product)}
                      className="flex-1 bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-full"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 text-sm font-bold rounded-full shadow-lg transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <ProductQuickViewModal open={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={selectedProduct} />
    </div>
  );
} 