"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminInfo');
      window.dispatchEvent(new Event('adminLogout'));
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed w-64 h-full bg-gray-800 shadow-lg flex flex-col border-r border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900"
    >
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-3xl font-bold text-cyan-400 mb-8 text-center tracking-tight leading-tight">
          Admin Panel
        </h2>
      </div>
      <nav className="mt-6 flex-1 space-y-2 px-4">
        <Link
          href="/admin/dashboard"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('overview')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">📊</span>
          <span className="relative z-10">Overview</span>
        </Link>
        <Link
          href="/admin/products"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'products' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('products')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">📦</span>
          <span className="relative z-10">Products</span>
        </Link>
        <Link
          href="/admin/orders"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('orders')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">🛒</span>
          <span className="relative z-10">Orders</span>
        </Link>
        <Link
          href="/admin/transactions"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'transactions' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('transactions')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">💸</span>
          <span className="relative z-10">Transactions</span>
        </Link>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-gray-300 bg-gray-700 hover:bg-red-600 hover:text-white transition-colors duration-300 group"
        >
          <span className="mr-2 text-lg group-hover:scale-110 transition-transform">➡️</span>
          Logout
        </button>
      </div>
    </motion.div>
  );
} 