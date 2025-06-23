"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 bg-hero-pattern bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      {/* Noamani Heading */}
      <div className="absolute top-16 left-0 w-full flex justify-center z-20 pointer-events-none select-none">
        <h1
          style={{
            fontFamily: "'Abril Fatface', serif",
            fontSize: "5rem",
            fontWeight: 900,
            color: "#fff",
            background: "none",
            backgroundImage: "none",
            backgroundClip: "unset",
            WebkitBackgroundClip: "unset",
            WebkitTextFillColor: "#fff",
            textShadow: "0 4px 32px #fff8, 0 1px 1px #00000055",
            opacity: 0,
            transform: "scale(0.8)",
            animation:
              "fadeZoomIn 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards",
            zIndex: 50,
            position: "relative",
          }}
        >
          Noamani
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.h1
          className="text-4xl md:text-6xl font-serif font-light tracking-wider mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Discover Your Signature Scent
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Luxury fragrances and skincare crafted with the finest ingredients for
          the modern individual
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link
            href="/shop"
            className="inline-block bg-white text-brand-dark px-8 py-3 rounded-sm font-medium tracking-wider text-sm uppercase hover:bg-brand-pink transition-colors duration-300 mr-4"
          >
            Shop Now
          </Link>
          <Link
            href="/quiz/start"
            className="inline-block bg-transparent border border-white text-white px-8 py-3 rounded-sm font-medium tracking-wider text-sm uppercase hover:bg-white/20 transition-colors duration-300"
          >
            Find Your Scent
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
