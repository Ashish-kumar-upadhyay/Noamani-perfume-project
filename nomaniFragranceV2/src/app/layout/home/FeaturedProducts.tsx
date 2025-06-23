"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import LazyLoader from "@/components/ui/LazyLoader";
import ProductQuickViewModal from "@/app/components/ProductQuickViewModal";

const bundles = [
  {
    id: 1,
    name: "Oriental oud",
    description: "Experience our signature scents",
    price: 85,
    image: "/newproduct.png",
    imageHover: "/planebox-remove.png",
  },
  {
    id: 2,
    name: "Northern lights",
    description: "Perfect gift collection",
    price: 150,
    image: "/productnew.png",
    imageHover: "/planebox-remove.png",
  },
];

const features = [
  "Created with World-Renowned Perfumers",
  "No nasties",
  "Australian Made & Owned",
  "High performance skincare",
  "Clean",
  "Vegan & Cruelty-free",
];

const defaultSizes = [
  { label: "25 mL", value: 25, priceFactor: 0.25 },
  { label: "50 mL", value: 50, priceFactor: 0.5 },
  { label: "100 mL", value: 100, priceFactor: 1 },
];

export default function FeaturedProducts() {
  const { addToCart } = useCart();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const allProductsScrollRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { country, setCountry } = useCountry();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        console.log("Fetched products:", data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setIsClient(true);
    const selected = localStorage.getItem("selectedCountry") || "IN";
    setCountry(selected);
  }, [setCountry]);

  const getPrice = (basePrice: number) => {
    switch (country) {
      case "EU":
        return { symbol: "€", value: Math.round(basePrice * 0.012) };
      case "US":
        return { symbol: "$", value: Math.round(basePrice * 0.013) };
      case "ME":
        return { symbol: "د.إ", value: Math.round(basePrice * 0.048) };
      case "IN":
      default:
        return { symbol: "₹", value: basePrice };
    }
  };

  const handleAddToCart = (product: any) => {
    const price =
      typeof product.price === "string"
        ? parseFloat(product.price.replace("$", ""))
        : product.price;
    addToCart({
      id: product.id?.toString() || product._id,
      name: product.name,
      price: price,
      image: product.image,
      quantity: 1,
    });
  };

  const handleViewDetails = (product: any) => {
    setQuickViewProduct({
      ...product,
      basePrice: product.basePrice || product.price || 0,
      sizes: product.sizes || defaultSizes,
    });
    setShowQuickView(true);
  };

  const scroll = (
    direction: "left" | "right",
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (ref.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        ref.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      ref.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Bestsellers Section */}
      <div className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-12"
          >
            BESTSELLERS
          </motion.h2>

          <div className="relative">
            <button
              onClick={() => scroll("left", scrollContainerRef)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loading ? (
                <div className="w-full flex justify-center items-center h-40 text-lg">
                  <LazyLoader />
                </div>
              ) : products.length === 0 ? (
                <div className="w-full flex justify-center items-center h-40 text-lg">
                  No products found.
                </div>
              ) : (
                products?.map((product: any, index: number) => (
                  <motion.div
                    key={`${product._id || product.id || "product"}-${index}`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                      type: "spring",
                    }}
                    className="flex-none w-[280px] group"
                  >
                    <div
                      className="relative aspect-[2/3] bg-gradient-to-br from-pink-100 to-blue-100 overflow-hidden mb-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-shadow duration-300"
                      onClick={() => handleViewDetails(product)}
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        unoptimized
                        priority={index < 2}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className={`object-contain rounded-2xl transition-opacity duration-500 ${
                          product.imageHover ? "group-hover:opacity-0" : ""
                        }`}
                      />
                      {product.imageHover && (
                        <Image
                          src={product.imageHover}
                          alt={product.name + " hover"}
                          fill
                          unoptimized
                          priority={false}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain rounded-2xl absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300 rounded-2xl" />
                      {product.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-black/80 text-white px-3 py-1 text-xs rounded-full shadow">
                            {product.category}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-pink-600 transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {product.subtext}
                      </p>
                      <p className="text-xl font-extrabold text-pink-600 mb-2">
                        {isClient && typeof product.price === "number"
                          ? `${getPrice(product.price).symbol}${
                              getPrice(product.price).value
                            }`
                          : "..."}
                      </p>
                    </div>
                    <motion.div
                      className="mt-4"
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-black text-white py-2 rounded-full font-semibold shadow-lg hover:bg-gray-800 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </motion.div>
                  </motion.div>
                ))
              )}
            </div>
            <button
              onClick={() => scroll("right", scrollContainerRef)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Large Perfume Image Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Luxury Perfume"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-light mb-4"
          >
            Discover Your Signature Scent
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-8"
          >
            Explore our collection of luxury fragrances
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </motion.button>
        </div>
      </div>

      {/* Features Banner */}
      <div className="py-8 bg-gray-50 overflow-hidden">
        <div className="flex items-center justify-start gap-4 animate-scroll">
          {features.concat(features).map((feature, index) => (
            <span
              key={index}
              className="text-gray-600 whitespace-nowrap text-sm"
            >
              {feature} <span className="mx-4">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bundles Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-light text-center mb-12"
          >
            LUXURY BUNDLES
          </motion.h2>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square">
                  <Image
                    src={bundle.image}
                    alt={bundle.name}
                    layout="fill"
                    objectFit="contain"
                    className={`transition-opacity duration-700 ease-in-out ${
                      bundle.imageHover ? "group-hover:opacity-0" : ""
                    }`}
                  />
                  {bundle.imageHover && (
                    <Image
                      src={bundle.imageHover}
                      alt={`${bundle.name} hover`}
                      layout="fill"
                      objectFit="contain"
                      className="opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                    />
                  )}
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{bundle.name}</h3>
                  <p className="text-gray-500 mb-4">{bundle.description}</p>
                  <p className="text-lg font-medium text-gray-900 mb-4">
                    {formatPrice(bundle.price, country)}
                  </p>
                  <motion.button
                    className="bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAddToCart(bundle)}
                  >
                    SHOP NOW
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        open={showQuickView}
        onClose={() => setShowQuickView(false)}
        product={quickViewProduct}
      />

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
