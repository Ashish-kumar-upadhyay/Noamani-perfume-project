"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/AuthForm";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { Lock, X, LogIn } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { addToCart } = useCart();

  const handleLoginSuccess = async () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }

    // Check for pending cart item in localStorage
    const pendingItem = localStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        await addToCart(item);
        localStorage.removeItem("pendingCartItem");
      } catch (error) {
        console.error("Error adding pending item to cart:", error);
      }
    }

    onClose();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Particle Effects */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 0 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-br from-black via-[#232526] to-[#e0c3fc] rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
        style={{
          minHeight: "80vh",
          minWidth: "320px",
          maxHeight: "90vh",
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hide scrollbar for Chrome, Safari and Opera */}
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-900/80 hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-yellow-400" />
        </button>
        <div className="grid lg:grid-cols-2 gap-0 items-center h-full min-h-[500px]">
          {/* Left Side - Brand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left flex flex-col justify-center p-8 sm:p-12 bg-transparent"
          >
            <div className="relative flex justify-center lg:justify-start mb-8">
              <div className="logo-animated shimmer border-4 border-yellow-400 rounded-full p-2 transition-all duration-500 cursor-pointer glow-animation">
                <Image
                  src="/nlogo.jpg"
                  alt="Noamani Perfumes Logo"
                  width={100}
                  height={100}
                  className="rounded-full w-24 h-24 object-cover"
                />
                <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl pointer-events-none"></div>
              </div>
            </div>
            <h1
              className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-extrabold gold-gradient float-animation shimmer mb-4 drop-shadow-lg tracking-wide text-yellow-400 animate-float-premium"
              style={{ textShadow: "0 4px 32px #FFD700, 0 1px 0 #fff" }}
            >
              Noamani Perfumes
            </h1>
            <p className="text-lg sm:text-xl text-yellow-200 font-light tracking-wide mb-4">
              Premium Fragrance Collection
            </p>
            <p className="text-gray-300 text-base hidden sm:block leading-relaxed max-w-md mx-auto lg:mx-0">
              Discover the art of luxury fragrance. Each scent tells a story of
              elegance, sophistication, and timeless beauty.
            </p>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 bg-transparent"
          >
            <AuthForm
              isLogin={isLogin}
              onToggle={toggleAuthMode}
              onLoginSuccess={handleLoginSuccess}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 24px rgba(255,215,0,0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-full"
              >
                <Button
                  variant="admin"
                  size="lg"
                  onClick={() => setShowAdminLogin(true)}
                  className="flex items-center gap-2 mt-6 w-full justify-center luxury-button"
                >
                  <Lock className="w-5 h-5" />
                  Admin Access
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        {/* Admin Login Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <AdminLogin onClose={() => setShowAdminLogin(false)} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
