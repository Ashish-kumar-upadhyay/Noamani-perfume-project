"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthForm } from '@/components/AuthForm';
import { AdminLogin } from '@/components/AdminLogin';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-black via-[#2b1055] to-[#ffb300] font-sans">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Animated Background Particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="particle particle-5"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8 flex justify-center lg:justify-start relative"
            >
              {/* Bulb Glow Animation */}
              <div className="absolute -inset-12 md:-inset-20 z-0 flex items-center justify-center">
                <div className="bulb-glow-animation"></div>
              </div>
              <div className="relative z-10">
                <Image
                  src="/nlogo.jpg"
                  alt="Noamani Perfumes Logo"
                  width={120}
                  height={120}
                  className="rounded-full glow-animation float-animation"
                />
                <div className="absolute inset-0 rounded-full bg-gold-400/20 blur-xl"></div>
              </div>
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-6 relative z-10"
            >
              <h1 className="font-playfair text-5xl lg:text-6xl font-bold gold-gradient mb-4 float-animation text-shadow-gold animate-text-float">
                Noamani Perfumes
              </h1>
              <p className="text-xl text-gold-200 font-light tracking-wide">
                Premium Fragrance Collection
              </p>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto lg:mx-0"
            >
              Discover the art of luxury fragrance. Each scent tells a story of elegance, 
              sophistication, and timeless beauty.
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-8 flex justify-center lg:justify-start space-x-4"
            >
              <div className="w-12 h-0.5 bg-gold-gradient"></div>
              <div className="w-8 h-0.5 bg-gold-gradient"></div>
              <div className="w-4 h-0.5 bg-gold-gradient"></div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center space-y-6"
          >
            <AuthForm isLogin={isLogin} onToggle={toggleAuthMode} />

            {/* Admin Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <Button
                variant="admin"
                size="lg"
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Admin Access
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Decorative Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-gold-300/60 text-sm tracking-widest uppercase">
            Crafted with Passion • Inspired by Luxury • Defined by Excellence
          </p>
        </motion.div>
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <AdminLogin onClose={() => setShowAdminLogin(false)} />
        )}
      </AnimatePresence>

      {/* Floating Mist Effect */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gold-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
} 