"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import LazyLoader from '@/components/ui/LazyLoader';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImg, setProfileImg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      const adminInfo = localStorage.getItem("adminInfo");
      let userEmail = null;
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        userEmail = JSON.parse(userInfo).email;
      } else if (adminInfo) {
        setUser({ ...JSON.parse(adminInfo), isAdmin: true });
        userEmail = JSON.parse(adminInfo).email;
      } else {
        router.replace("/auth/login");
      }
      if (userEmail) {
        const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
        if (storedImg) setProfileImg(storedImg);
      }
      setLoading(false);
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user && user.email) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        setProfileImg(base64);
        localStorage.setItem(`profileImg_${user.email}`, base64);
        window.dispatchEvent(new Event('profileImgUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gold-100 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center border border-gold-400"
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: 2 }}
          className="mb-6 relative group"
        >
          {profileImg ? (
            <Image
              src={profileImg}
              alt="Profile"
              width={112}
              height={112}
              className="rounded-full object-cover border-4 border-gold-400 shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <UserCircleIcon className="h-28 w-28 text-gold-500 drop-shadow-lg transition-transform duration-300 group-hover:scale-105 bg-white rounded-full" />
          )}
          <label className="absolute bottom-0 right-0 bg-gold-500 text-black px-3 py-1 rounded-full text-xs font-semibold shadow cursor-pointer hover:bg-gold-400 transition-colors">
            Change
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold text-gold-600 mb-2 text-center"
        >
          {user.name || "User"}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-200 mb-4 text-center"
        >
          {user.email}
        </motion.p>
        {user.isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="px-4 py-1 rounded-full bg-gold-500 text-black font-semibold text-xs mb-4 shadow-md"
          >
            Admin
          </motion.div>
        )}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-6 w-full"
        >
          <button
            onClick={() => router.push("/orders")}
            className="w-full py-3 rounded-lg bg-gold-500 text-black font-semibold text-lg shadow-lg hover:bg-gold-400 transition-colors duration-200"
          >
            View Orders
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
} 