'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'
import FeaturedProducts from './layout/home/FeaturedProducts'
import ProductReviews from '@/components/ProductReviews'
import { Playfair_Display } from 'next/font/google'
import Footer from '@/components/Footer'

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] })

export default function Home() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products')
        const data = await res.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
  }

  return (
    <div>
      {/* Hero Section with Video */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 min-h-screen w-full object-cover"
        >
          <source src="/a.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 flex h-screen flex-col items-center justify-center text-center text-white pt-32">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`mb-6 text-4xl md:text-5xl font-bold relative inline-block luxury-shimmer ${playfair.className}`}
          >
            Luxury Perfumes
            <span className="absolute left-0 top-0 w-full h-full shimmer-overlay pointer-events-none" />
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 text-lg md:text-xl font-serif text-gold-200/90 subtitle-shimmer"
          >
            Discover your signature scent
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-black transition-colors hover:bg-gray-200"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* Brand Story Section */}
      <div className="bg-white py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] mb-6">Our Story</h2>
              <p className="text-[15px] text-gray-600 mb-6">
                At LUXE, we believe that every fragrance tells a story. Our carefully curated collection 
                brings together the finest perfumes from around the world, each one selected for its 
                unique character and exceptional quality.
              </p>
              <Link
                href="/about"
                className="inline-block mt-4 text-gray-800 font-semibold border-b-2 border-gray-800 hover:text-black hover:border-black transition-colors"
              >
                Learn More About Us
              </Link>
            </div>
            <div className="relative aspect-square overflow-hidden group w-full max-w-[400px] mx-auto">
              <img
                src="/ourstoryimg.png"
                alt="Perfume Bottle"
                className="absolute inset-0 w-full h-full object-contain transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-95"
                draggable={false}
              />
              <img
                src="/boxs.png"
                alt="Perfume Box"
                className="absolute inset-0 w-full h-full object-contain opacity-0 scale-105 transition-all duration-700 ease-in-out group-hover:opacity-100 group-hover:scale-100"
                draggable={false}
              />
            </div>
          </div>
        </div>
      </div>

      <ProductReviews />
      <Footer />
    </div>
  )
}