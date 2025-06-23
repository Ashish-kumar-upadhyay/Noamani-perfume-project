'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';
import { useCart } from '@/context/CartContext';
import ProductQuickViewModal from '@/app/components/ProductQuickViewModal';
import { toast } from 'react-hot-toast';
import { Product } from '@/types/product';
import LazyLoader from '@/components/ui/LazyLoader';

export default function FragrancePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const country = useCountry();
  const { addToCart } = useCart();

  useEffect(() => {
    fetch('/api/products?page=Fragrance')
      .then(res => res.json())
      .then(data => {
        console.log('API DATA:', data);
        // Add hover images for each product and ensure proper type conversion
        const updatedData = data.map((product: any, index: number) => {
          const images = ['/product1.jpg', '/product2.jpg', '/product3.jpg', '/product4.jpg'];
          const nextIndex = (index + 1) % images.length;
          return {
            ...product,
            id: (product._id || product.id || '').toString(), // Ensure id is a string
            image: images[index % images.length],
            hoverImage: images[nextIndex]
          };
        });
        setProducts(updatedData);
        setLoading(false);
      });
  }, []);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Fragrance Hero"
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
            LUXURY FRAGRANCES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Discover our collection of exquisite scents
          </motion.p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-light mb-6">SIGNATURE COLLECTION</h2>
          <p className="text-gray-600">
            Each fragrance is carefully crafted using the finest ingredients from around the world,
            creating unique and memorable scents that leave a lasting impression.
          </p>
        </motion.div>

        {/* Fragrance Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center"><LazyLoader /></div>
          ) : products.length === 0 ? (
            <p>No fragrances found.</p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div 
                  className="relative aspect-[3/4] overflow-hidden mb-4 cursor-pointer"
                  onClick={() => handleQuickView(product)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:opacity-0"
                  />
                  <Image
                    src={product.hoverImage || product.image}
                    alt={`${product.name} hover`}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 opacity-0 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                      <p className="text-lg font-light mb-4">Quick View</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-light mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{formatPrice(product.price, country)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickView(product)}
                      className="flex-1 bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Quick View
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-black text-white px-4 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <h3 className="text-2xl font-light mb-6">DISCOVER YOUR SIGNATURE SCENT</h3>
          <Link
            href="/quiz"
            className="inline-block bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            TAKE THE QUIZ
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <ProductQuickViewModal
        open={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
} 