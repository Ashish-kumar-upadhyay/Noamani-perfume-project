"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import LazyLoader from "@/components/ui/LazyLoader";
import NotFound from "../../not-found";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const defaultSizes = [
    { label: "25 mL", value: 25, priceFactor: 0.25 },
    { label: "50 mL", value: 50, priceFactor: 0.5 },
    { label: "100 mL", value: 100, priceFactor: 1 },
  ];
  const sizes = product?.sizes || defaultSizes;
  const [selectedSize, setSelectedSize] = useState(sizes[2]); // default 100ml
  const [activeTab, setActiveTab] = useState("Description");

  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const getPrice = () => {
    if (product?.sizes) {
      return selectedSize.price;
    }
    // fallback: scale price by factor
    return Math.round(product.price * selectedSize.priceFactor);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Error fetching product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        <LazyLoader />
      </div>
    );
  if (error) return <NotFound />;
  if (!product) return <NotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-12 px-4 mt-24">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/2 flex items-center justify-center bg-gray-50 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full h-full flex items-center justify-center"
            >
              <Image
                src={
                  isHovered && product.image2 ? product.image2 : product.image
                }
                alt={product.name}
                width={400}
                height={500}
                className="rounded-2xl object-cover shadow-lg transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
          >
            {product.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mb-6"
          >
            {product.description}
          </motion.p>
          {/* Size selector */}
          <div className="flex space-x-2 mb-4">
            {sizes.map((size: any) => (
              <button
                key={size.label}
                className={clsx(
                  "px-4 py-2 border rounded-full text-sm font-medium focus:outline-none transition-all",
                  selectedSize.label === size.label
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-300 hover:bg-gray-100"
                )}
                onClick={() => setSelectedSize(size)}
              >
                {size.label}
              </button>
            ))}
          </div>
          {/* Price and category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <span className="text-2xl font-semibold text-black">
              ₹{getPrice()}
            </span>
            <span className="ml-4 px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-700">
              {product.category}
            </span>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto bg-black text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-gray-800 transition-colors mb-6"
            onClick={async () => {
              setIsAdding(true);
              await addToCart({
                id: product.id || params.id,
                name: product.name,
                price: getPrice(),
                image: product.image,
                quantity: 1,
                size: selectedSize.label,
                category: product.category,
                description: product.description,
              });
              setIsAdding(false);
            }}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add to Cart"}
          </motion.button>
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <span className="pb-2 text-base font-medium border-b-2 border-black text-black">
              Description
            </span>
          </div>
          <div className="min-h-[80px] text-gray-700 text-base">
            {product.description || "No description available."}
          </div>
        </div>
      </div>
    </div>
  );
}
