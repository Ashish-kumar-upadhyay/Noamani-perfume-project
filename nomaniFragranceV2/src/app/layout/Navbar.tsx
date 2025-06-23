"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Droplets,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBagIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoginModal } from "@/components/LoginModal";
import { CartProvider } from "@/context/CartContext";
import { products } from "@/data/products";

const navItems = [
  { name: "Shop All", href: "/shop" },
  { name: "Bestsellers", href: "/bestsellers" },
  { name: "Fragrance", href: "/fragrance" },
  // { name: 'Skin + Hair', href: '/skin-hair' },
  // { name: 'Discovery Sets', href: '/discovery-sets' },
  { name: "About Us", href: "/about" },
];

interface UserInfo {
  name: string;
  email: string;
}

interface AdminInfo {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  // All hooks at the top
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedCountry") || "IN";
    }
    return "IN";
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const earthRef = useRef<HTMLDivElement>(null);
  const userEmailRef = useRef<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const countryList = [
    { code: "US", flag: "/America.jpg", label: "America" },
    { code: "EU", flag: "/Europe.webp", label: "Europe" },
    { code: "ME", flag: "/Middle-east.jpg", label: "Middle East" },
    { code: "IN", flag: "/India.jpg", label: "India" },
  ];

  const radius = 48; // px, distance from globe

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (pathname === '/about/shipping') {
        setIsScrolled(false);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleProfileImgUpdate = () => {
    const userEmail = userEmailRef.current;
    if (userEmail) {
      const updatedImg = localStorage.getItem(`profileImg_${userEmail}`);
      setProfileImg(updatedImg || null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdminInfo = localStorage.getItem("adminInfo");
      const storedUserInfo = localStorage.getItem("userInfo");
      let userEmail: string | null = null;
      if (storedAdminInfo) {
        setAdminInfo(JSON.parse(storedAdminInfo));
        setUserInfo(null);
        userEmail = JSON.parse(storedAdminInfo).email;
      } else if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        setAdminInfo(null);
        userEmail = JSON.parse(storedUserInfo).email;
      }
      userEmailRef.current = userEmail;
      if (userEmail) {
        const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
        setProfileImg(storedImg || null);
      } else {
        setProfileImg(null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("profileImgUpdated", handleProfileImgUpdate);
    return () =>
      window.removeEventListener("profileImgUpdated", handleProfileImgUpdate);
  }, []);

  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
  }, [cart]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        earthRef.current &&
        !earthRef.current.contains(event.target as Node)
      ) {
        setShowCountryDropdown(false);
      }
    }
    if (showCountryDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCountryDropdown]);

  useEffect(() => {
    const handleAdminLogout = () => {
      setAdminInfo(null);
      setUserInfo(null);
    };
    window.addEventListener("adminLogout", handleAdminLogout);
    return () => window.removeEventListener("adminLogout", handleAdminLogout);
  }, []);

  useEffect(() => {
    const handleUserLogin = () => {
      if (typeof window !== "undefined") {
        const storedAdminInfo = localStorage.getItem("adminInfo");
        const storedUserInfo = localStorage.getItem("userInfo");
        let userEmail: string | null = null;
        if (storedAdminInfo) {
          setAdminInfo(JSON.parse(storedAdminInfo));
          setUserInfo(null);
          userEmail = JSON.parse(storedAdminInfo).email;
        } else if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          setAdminInfo(null);
          userEmail = JSON.parse(storedUserInfo).email;
        }
        userEmailRef.current = userEmail;
        if (userEmail) {
          const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
          setProfileImg(storedImg || null);
        } else {
          setProfileImg(null);
        }
      }
    };
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  useEffect(() => {
    if (showSearchModal) {
      setLoadingProducts(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setAllProducts(data);
          setLoadingProducts(false);
        })
        .catch(() => setLoadingProducts(false));
    }
  }, [showSearchModal]);

  useEffect(() => {
    function handleClickOutsideUserDropdown(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutsideUserDropdown);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
    };
  }, [showDropdown]);

  // Function to truncate username
  const getTruncatedName = (name: string) => {
    if (name.length > 12) {
      return name.substring(0, 12) + "...";
    }
    return name;
  };

  // Early returns after all hooks
  if (!isMounted) return null;
  if (
    (pathname && pathname.startsWith("/admin")) ||
    (pathname && pathname.startsWith("/auth"))
  )
    return null;

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("adminInfo");
      setAdminInfo(null);
      setShowDropdown(false);
      router.push("/");
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
    }
  };

  const handleUserLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setShowDropdown(false);
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
    }
  };

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code);
    localStorage.setItem("selectedCountry", code);
    setShowCountryDropdown(false);
    window.dispatchEvent(new Event("countryChange"));
    // TODO: Trigger price update globally if needed
  };

  // Add this function to handle requiring login for cart
  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.description &&
          p.description.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
  };

  const handleProductClick = (productId: string) => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/product/${productId}`);
  };

  return (
    <CartProvider onRequireLogin={handleRequireLogin}>
      <header
        className={cn(
          pathname === "/about/shipping" || pathname === "/about/returns"
            ? "fixed top-0 left-0 right-0 z-50 bg-white"
            : "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ||
            isMobileMenuOpen ||
            (pathname && pathname.startsWith("/product/"))
            ? "bg-white shadow-sm"
            : "bg-transparent"
        )}
      >
        <div
          className={cn(
            pathname === '/about/shipping'
              ? 'w-full px-4 sm:px-6 lg:px-8 bg-white'
              : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          )}
          style={pathname === '/about/shipping' ? { backgroundColor: '#fff', maxWidth: '100%', margin: 0 } : {}}
        >
          {/* Unscrolled: 2-row luxury hero, Scrolled: 1-row sticky */}
          {isScrolled ||
          (pathname && pathname.startsWith("/product/")) ||
          pathname === "/about/shipping" ||
          pathname === "/about/returns" ||
          pathname === "/about/faqs" ? (
            <div
              className="relative flex items-center justify-between h-16 md:h-20 items-center hidden md:flex"
              style={{
                transition: "height 0.5s",
                height: "64px",
                alignItems: "center",
              }}
            >
              {/* Brand Name (left) */}
              <div
                className="flex items-center flex-none w-auto pl-0 ml-0"
                style={{ alignSelf: "center", height: "100%" }}
              >
                <Link
                  href="/"
                  className={`transition-all duration-500 font-serif font-extrabold tracking-wider select-none ${pathname === '/shop' ? 'text-lg md:text-xl' : 'text-2xl md:text-3xl'}`}
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    letterSpacing: "0.08em",
                    color: "#000",
                  }}
                >
                  Noamani
                </Link>
              </div>
              {/* Nav Links (center, less space when scrolled) */}
              <nav className="hidden md:flex flex-1 justify-center">
                <ul
                  className={cn(
                    "flex items-center justify-between",
                    isScrolled ? "w-full max-w-2xl" : "w-full max-w-3xl"
                  )}
                >
                  {navItems.map((item) => (
                    <li
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => {
                        if (item.name !== "About Us") {
                          setActiveMenu(item.name);
                        } else {
                          setActiveMenu(null);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "text-sm tracking-wider py-2 transition-colors duration-200 flex items-center",
                          pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                            ? "text-black"
                            : "text-black",
                          activeMenu === item.name
                            ? "font-medium"
                            : "font-normal",
                          item.name === "About Us" &&
                            pathname === "/about" &&
                            "pointer-events-none opacity-70"
                        )}
                      >
                        {item.name}
                      </Link>
                      {activeMenu === item.name && item.name !== "About Us" && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            background:
                              pathname &&
                              (pathname.startsWith("/product/") ||
                                pathname === "/about/shipping" ||
                                pathname === "/about/returns" ||
                                pathname === "/about/faqs")
                                ? "#000"
                                : "#000",
                          }}
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              {/* Right side icons (less space when scrolled) */}
              <div
                className="flex flex-row items-center space-x-4 ml-auto items-center"
                style={{ alignItems: "center", height: "100%" }}
              >
                <button
                  className={cn(
                    "hover:opacity-70 transition-opacity",
                    !isScrolled &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "text-black"
                      : pathname &&
                        (pathname.startsWith("/product/") ||
                          pathname === "/about/shipping" ||
                          pathname === "/about/returns" ||
                          pathname === "/about/faqs")
                      ? "text-black"
                      : isScrolled || isMobileMenuOpen
                      ? "text-brand-dark"
                      : "text-white"
                  )}
                  onClick={() => setShowSearchModal(true)}
                  aria-label="Search"
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
                {adminInfo ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                        isScrolled || isMobileMenuOpen
                          ? "text-brand-dark"
                          : "text-white"
                      )}
                    >
                      <UserCircleIcon className="h-6 w-6" />
                      <span>Admin</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : userInfo ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                        isScrolled || isMobileMenuOpen
                          ? "text-brand-dark"
                          : "text-white"
                      )}
                    >
                      {profileImg && userInfo ? (
                        <Image
                          src={profileImg}
                          alt="Profile"
                          width={28}
                          height={28}
                          className="rounded-full object-cover border-2 border-gold-400"
                        />
                      ) : (
                        <UserCircleIcon className="h-6 w-6" />
                      )}
                      <span
                        className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}
                      >
                        {getTruncatedName(userInfo.name)}
                      </span>
                    </button>
                    {showDropdown && (
                      <AnimatePresence>
                        <motion.div
                          ref={userDropdownRef}
                          className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                          style={{ transform: 'translateX(-60%)' }}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                            Signed in as
                            <br />
                            <span className="font-medium text-gray-900 truncate block">
                              {userInfo.email}
                            </span>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Orders
                          </Link>
                          <button
                            onClick={handleUserLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={cn(
                      "text-sm font-medium hover:opacity-70 transition-opacity",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                    )}
                  >
                    Login
                  </button>
                )}

                <Link
                  href="/cart"
                  className={cn(
                    "hover:opacity-70 transition-opacity relative",
                    !isScrolled &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "text-black"
                      : pathname &&
                        (pathname.startsWith("/product/") ||
                          pathname === "/about/shipping" ||
                          pathname === "/about/returns" ||
                          pathname === "/about/faqs")
                      ? "text-black"
                      : isScrolled || isMobileMenuOpen
                      ? "text-brand-dark"
                      : "text-white"
                  )}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                {/* Earth/Country Selector - moved to right side */}
                <div
                  className="flex items-center h-full"
                  style={{ alignItems: "center", height: "100%", marginTop: 0 }}
                >
                  <div
                    ref={earthRef}
                    className="relative flex items-center justify-center h-full"
                    style={{ width: 40, height: 40, marginTop: "0px" }}
                  >
                    <motion.button
                      className={cn(
                        "hover:opacity-90 transition-opacity",
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                          ? "text-black"
                          : isScrolled || isMobileMenuOpen
                          ? "text-brand-dark"
                          : "text-white"
                      )}
                      aria-label="Select country"
                      style={{
                        position: "relative",
                        zIndex: 100,
                        background: "none",
                        border: "none",
                        padding: 0,
                        boxShadow: "none",
                      }}
                      onClick={() => setShowCountryDropdown((v) => !v)}
                      whileHover={{
                        scale: 1.12,
                        boxShadow: "0 0 32px 8px #00bfff, 0 0 0 6px #fff",
                      }}
                      whileTap={{ scale: 0.97 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 8,
                        ease: "linear",
                      }}
                    >
                      <Globe
                        className="h-7 w-7"
                        style={{
                          color:
                            pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                              ? "#000"
                              : isScrolled
                              ? "#000"
                              : "#fff",
                        }}
                      />
                    </motion.button>
                    <AnimatePresence>
                      {showCountryDropdown && (
                        <motion.div
                          className="absolute right-2 left-auto top-full flex items-center justify-center"
                          style={{
                            transform: "translateY(8px)",
                            pointerEvents: "auto",
                            zIndex: 200,
                          }}
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.7 }}
                          transition={{
                            duration: 0.22,
                            type: "spring",
                            stiffness: 300,
                            damping: 22,
                          }}
                        >
                          <div
                            className="relative flex items-center justify-center"
                            style={{ width: 60, height: 60 }}
                          >
                            {countryList.map((country, i) => {
                              const angle =
                                (i / countryList.length) * 2 * Math.PI -
                                Math.PI / 2;
                              const radius = 18; // px, distance from center of circle (smaller)
                              const x = Math.cos(angle) * radius + 30; // offset for center (smaller)
                              const y = Math.sin(angle) * radius + 30;
                              return (
                                <motion.img
                                  key={country.code}
                                  src={country.flag}
                                  alt={country.label}
                                  className="w-6 h-6 rounded-full shadow-lg cursor-pointer absolute"
                                  style={{
                                    left: x,
                                    top: y,
                                    zIndex: 101,
                                    pointerEvents: "auto",
                                    border:
                                      selectedCountry === country.code
                                        ? "2px solid #FFD700"
                                        : "2px solid #fff",
                                    background: "#fff",
                                    transform: "translate(-50%, -50%)",
                                  }}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1.1 }}
                                  exit={{ opacity: 0, scale: 0.5 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                    delay: 0.05 * i,
                                  }}
                                  onClick={() =>
                                    handleCountrySelect(country.code)
                                  }
                                  whileHover={{
                                    scale: 1.2,
                                    boxShadow: "0 0 20px #FFD700",
                                  }}
                                />
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full pt-6 pb-2 relative">
              {/* Brand Name (center, big) */}
              <div className="flex items-center justify-center w-full">
                {!isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) &&
                pathname === "/" ? (
                  <Link
                    href="/"
                    className="transition-all duration-500 font-serif font-extrabold tracking-wider select-none text-7xl md:text-9xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: "0.08em",
                      color: "#fff",
                      background: "none",
                      backgroundImage: "none",
                      backgroundClip: "unset",
                      WebkitBackgroundClip: "unset",
                      WebkitTextFillColor: "#fff",
                    }}
                  >
                    Noamani
                  </Link>
                ) : !isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) ? (
                  <Link
                    href="/"
                    className="transition-all duration-500 font-serif font-extrabold tracking-wider select-none text-xl md:text-3xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      letterSpacing: "0.08em",
                      color: "#fff",
                      background: "none",
                      backgroundImage: "none",
                      backgroundClip: "unset",
                      WebkitBackgroundClip: "unset",
                      WebkitTextFillColor: "#fff",
                    }}
                  >
                    Noamani
                  </Link>
                ) : (
                  <div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ height: "100%" }}
                  >
                    <Link
                      href="/"
                      className="transition-all duration-500 font-serif font-extrabold tracking-wider select-none text-2xl md:text-3xl"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        letterSpacing: "0.08em",
                        color: "#000",
                      }}
                    >
                      Noamani
                    </Link>
                  </div>
                )}
              </div>
              {/* Nav Links and Right Icons in one row */}
              <div className="w-full flex flex-row items-center justify-between mt-5 relative hidden md:flex">
                {/* Nav Links: Centered below big brand name when not scrolled, normal row when scrolled */}
                <nav
                  className={cn(
                    "hidden md:flex flex-1",
                    !isScrolled &&
                      !(
                        pathname &&
                        (pathname.startsWith("/admin") ||
                          pathname.startsWith("/auth") ||
                          pathname.startsWith("/product/"))
                      ) &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "justify-center animate-fade-in-down"
                      : !isScrolled &&
                        !(
                          pathname &&
                          (pathname.startsWith("/admin") ||
                            pathname.startsWith("/auth") ||
                            pathname.startsWith("/product/"))
                        )
                      ? "justify-center animate-fade-in-down"
                      : "justify-start"
                  )}
                >
                  <ul
                    className={cn(
                      "flex items-center justify-between gap-8",
                      isScrolled ? "w-full max-w-2xl" : "w-full max-w-3xl"
                    )}
                  >
                    {navItems.map((item) => (
                      <li
                        key={item.name}
                        className="relative group"
                        onMouseEnter={() => {
                          if (item.name !== "About Us") {
                            setActiveMenu(item.name);
                          } else {
                            setActiveMenu(null);
                          }
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "text-lg tracking-wider py-2 transition-colors duration-200 flex items-center",
                            !isScrolled &&
                              (pathname === "/shop/all" ||
                                pathname === "/shop/new")
                              ? "text-black"
                              : !isScrolled &&
                                pathname &&
                                !pathname.startsWith("/admin") &&
                                !pathname.startsWith("/auth") &&
                                !pathname.startsWith("/product/")
                              ? "text-white"
                              : "text-black",
                            activeMenu === item.name
                              ? "font-medium"
                              : "font-normal",
                            item.name === "About Us" &&
                              pathname === "/about" &&
                              "pointer-events-none opacity-70"
                          )}
                        >
                          {item.name}
                        </Link>
                        {activeMenu === item.name &&
                          item.name !== "About Us" && (
                            <motion.div
                              className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                !isScrolled &&
                                  (pathname === "/shop/all" ||
                                    pathname === "/shop/new")
                                  ? "bg-black"
                                  : !isScrolled &&
                                    pathname &&
                                    !pathname.startsWith("/admin") &&
                                    !pathname.startsWith("/auth") &&
                                    !pathname.startsWith("/product/")
                                  ? "bg-white"
                                  : "bg-black"
                              )}
                              layoutId="underline"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                      </li>
                    ))}
                  </ul>
                </nav>
                {/* Right side icons (aligned with nav links, spaced apart) */}
                <div className="flex flex-row items-center space-x-4 ml-24">
                  <button
                    className={cn(
                      "hover:opacity-70 transition-opacity",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {adminInfo ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                          isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                      >
                        <UserCircleIcon className="h-6 w-6" />
                        <span>Admin</span>
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  ) : userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        "text-sm font-medium hover:opacity-70 transition-opacity",
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                          ? "text-black"
                          : !isScrolled &&
                            pathname &&
                            !pathname.startsWith("/admin") &&
                            !pathname.startsWith("/auth")
                          ? "text-white"
                          : "text-black"
                      )}
                    >
                      Login
                    </button>
                  )}

                  <Link
                    href="/cart"
                    className={cn(
                      "hover:opacity-70 transition-opacity relative",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  {/* Earth/Country icon */}
                  <div className="flex items-center h-full relative">
                    <div
                      ref={earthRef}
                      className="relative flex items-center justify-center h-full"
                      style={{ width: 28, height: 28, marginTop: '0px' }}
                    >
                      <motion.button
                        className="hover:opacity-90 transition-opacity text-brand-dark"
                        aria-label="Select country"
                        style={{
                          position: 'relative',
                          zIndex: 100,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          boxShadow: 'none',
                        }}
                        onClick={() => setShowCountryDropdown((v) => !v)}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Globe className="h-6 w-6" style={{ color: isScrolled ? '#000' : '#fff' }} />
                      </motion.button>
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            className="absolute right-2 left-auto top-full flex items-center justify-center"
                            style={{
                              transform: "translateY(8px)",
                              pointerEvents: "auto",
                              zIndex: 200,
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{
                              duration: 0.22,
                              type: "spring",
                              stiffness: 300,
                              damping: 22,
                            }}
                          >
                            <div
                              className="relative flex items-center justify-center"
                              style={{ width: 60, height: 60 }}
                            >
                              {countryList.map((country, i) => {
                                const angle =
                                  (i / countryList.length) * 2 * Math.PI -
                                  Math.PI / 2;
                                const radius = 18;
                                const x = Math.cos(angle) * radius + 30;
                                const y = Math.sin(angle) * radius + 30;
                                return (
                                  <motion.img
                                    key={country.code}
                                    src={country.flag}
                                    alt={country.label}
                                    className="w-6 h-6 rounded-full shadow-lg cursor-pointer absolute"
                                    style={{
                                      left: x,
                                      top: y,
                                      zIndex: 201,
                                      pointerEvents: "auto",
                                      border:
                                        selectedCountry === country.code
                                          ? "2px solid #FFD700"
                                          : "2px solid #fff",
                                      background: "#fff",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 20,
                                      delay: 0.05 * i,
                                    }}
                                    onClick={() => handleCountrySelect(country.code)}
                                    whileHover={{
                                      scale: 1.2,
                                      boxShadow: "0 0 20px #FFD700",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* MOBILE NAVBAR: Only this should remain for mobile (md:hidden) */}
          <div className="flex md:hidden w-full flex-row items-center justify-between h-14 px-2 gap-4">
            {isScrolled ? (
              // SCROLLED: ONLY NEW NAVBAR
              <>
                {/* Hamburger menu */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className={cn(
                    'transition-colors flex items-center',
                    'text-brand-dark'
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Noamani brand */}
                <Link
                  href="/"
                  className="font-serif font-extrabold tracking-wider select-none text-lg text-brand-dark mx-2"
                  style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.08em" }}
                >
                  Noamani
                </Link>
                {/* Rest of the icons */}
                <div className="flex flex-row items-center gap-3 ml-auto">
                  {/* Search button */}
                  <button
                    className="hover:opacity-70 transition-opacity text-brand-dark"
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="text-sm font-medium hover:opacity-70 transition-opacity text-brand-dark"
                    >
                      Login
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className="hover:opacity-70 transition-opacity relative text-brand-dark"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  {/* Earth/Country icon */}
                  <div className="flex items-center h-full relative">
                    <div
                      ref={earthRef}
                      className="relative flex items-center justify-center h-full"
                      style={{ width: 28, height: 28, marginTop: '0px' }}
                    >
                      <motion.button
                        className="hover:opacity-90 transition-opacity text-brand-dark"
                        aria-label="Select country"
                        style={{
                          position: 'relative',
                          zIndex: 100,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          boxShadow: 'none',
                        }}
                        onClick={() => setShowCountryDropdown((v) => !v)}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Globe className="h-6 w-6" style={{ color: isScrolled ? '#000' : '#fff' }} />
                      </motion.button>
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            className="absolute right-2 left-auto top-full flex items-center justify-center"
                            style={{
                              transform: "translateY(8px)",
                              pointerEvents: "auto",
                              zIndex: 200,
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{
                              duration: 0.22,
                              type: "spring",
                              stiffness: 300,
                              damping: 22,
                            }}
                          >
                            <div
                              className="relative flex items-center justify-center"
                              style={{ width: 60, height: 60 }}
                            >
                              {countryList.map((country, i) => {
                                const angle =
                                  (i / countryList.length) * 2 * Math.PI -
                                  Math.PI / 2;
                                const radius = 18;
                                const x = Math.cos(angle) * radius + 30;
                                const y = Math.sin(angle) * radius + 30;
                                return (
                                  <motion.img
                                    key={country.code}
                                    src={country.flag}
                                    alt={country.label}
                                    className="w-6 h-6 rounded-full shadow-lg cursor-pointer absolute"
                                    style={{
                                      left: x,
                                      top: y,
                                      zIndex: 201,
                                      pointerEvents: "auto",
                                      border:
                                        selectedCountry === country.code
                                          ? "2px solid #FFD700"
                                          : "2px solid #fff",
                                      background: "#fff",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 20,
                                      delay: 0.05 * i,
                                    }}
                                    onClick={() => handleCountrySelect(country.code)}
                                    whileHover={{
                                      scale: 1.2,
                                      boxShadow: "0 0 20px #FFD700",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // NOT SCROLLED: ONLY OLD NAVBAR
              <>
                {/* Hamburger menu */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className={cn(
                    'transition-colors flex items-center',
                    (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Search button - moved next to hamburger */}
                <button
                  className={cn(
                    'hover:opacity-70 transition-opacity',
                    (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                  )}
                  onClick={() => setShowSearchModal(true)}
                  aria-label="Search"
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
                <div className="flex flex-row items-center gap-4 ml-auto">
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'text-sm font-medium hover:opacity-70 transition-opacity',
                        (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                      )}
                    >
                      Login
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className={cn(
                      'hover:opacity-70 transition-opacity relative',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  {/* Earth/Country icon */}
                  <div className="flex items-center h-full relative">
                    <div
                      ref={earthRef}
                      className="relative flex items-center justify-center h-full"
                      style={{ width: 28, height: 28, marginTop: '0px' }}
                    >
                      <motion.button
                        className="hover:opacity-90 transition-opacity text-brand-dark"
                        aria-label="Select country"
                        style={{
                          position: 'relative',
                          zIndex: 100,
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          boxShadow: 'none',
                        }}
                        onClick={() => setShowCountryDropdown((v) => !v)}
                        whileHover={{ scale: 1.12 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Globe className="h-6 w-6" style={{ color: isScrolled ? '#000' : '#fff' }} />
                      </motion.button>
                      <AnimatePresence>
                        {showCountryDropdown && (
                          <motion.div
                            className="absolute right-2 left-auto top-full flex items-center justify-center"
                            style={{
                              transform: "translateY(8px)",
                              pointerEvents: "auto",
                              zIndex: 200,
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{
                              duration: 0.22,
                              type: "spring",
                              stiffness: 300,
                              damping: 22,
                            }}
                          >
                            <div
                              className="relative flex items-center justify-center"
                              style={{ width: 60, height: 60 }}
                            >
                              {countryList.map((country, i) => {
                                const angle =
                                  (i / countryList.length) * 2 * Math.PI -
                                  Math.PI / 2;
                                const radius = 18;
                                const x = Math.cos(angle) * radius + 30;
                                const y = Math.sin(angle) * radius + 30;
                                return (
                                  <motion.img
                                    key={country.code}
                                    src={country.flag}
                                    alt={country.label}
                                    className="w-6 h-6 rounded-full shadow-lg cursor-pointer absolute"
                                    style={{
                                      left: x,
                                      top: y,
                                      zIndex: 201,
                                      pointerEvents: "auto",
                                      border:
                                        selectedCountry === country.code
                                          ? "2px solid #FFD700"
                                          : "2px solid #fff",
                                      background: "#fff",
                                      transform: "translate(-50%, -50%)",
                                    }}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{
                                      type: "spring",
                                      stiffness: 400,
                                      damping: 20,
                                      delay: 0.05 * i,
                                    }}
                                    onClick={() => handleCountrySelect(country.code)}
                                    whileHover={{
                                      scale: 1.2,
                                      boxShadow: "0 0 20px #FFD700",
                                    }}
                                  />
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        <div className="relative">
          {activeMenu && activeMenu !== "About Us" && (
            <MegaMenu
              category={activeMenu}
              onClose={() => setActiveMenu(null)}
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMenu(null)}
            />
          )}
        </div>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} />
          )}
        </AnimatePresence>

        {/* Search Modal */}
        {showSearchModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSearchModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
                onClick={() => setShowSearchModal(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                Search Products
              </h2>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Type to search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
              />
              <div>
                {loadingProducts && (
                  <div className="text-center text-gray-500 py-8">
                    Loading products...
                  </div>
                )}
                {!loadingProducts &&
                  searchQuery &&
                  searchResults.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No products found.
                    </div>
                  )}
                {!loadingProducts && searchResults.length > 0 && (
                  <ul className="divide-y divide-gray-200">
                    {searchResults.map((product) => (
                      <li
                        key={product._id || product.id}
                        className="py-4 flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-lg px-2"
                        onClick={() =>
                          handleProductClick(product._id || product.id)
                        }
                      >
                        <img
                          src={
                            product.image ||
                            (product.images && product.images[0])
                          }
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Hamburger Sidebar */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-50 bg-black/40 flex md:hidden" onClick={() => setShowMobileMenu(false)}>
            <div
              className="bg-white w-64 h-full p-6 flex flex-col gap-6 shadow-lg animate-slide-in-left"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="self-end mb-4 text-gray-500 hover:text-black"
                onClick={() => setShowMobileMenu(false)}
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
              <nav className="flex flex-col gap-4">
                <Link href="/shop" className="text-lg font-medium text-gray-900 hover:text-pink-600" onClick={() => setShowMobileMenu(false)}>Shop All</Link>
                <Link href="/bestsellers" className="text-lg font-medium text-gray-900 hover:text-pink-600" onClick={() => setShowMobileMenu(false)}>Bestsellers</Link>
                <Link href="/fragrance" className="text-lg font-medium text-gray-900 hover:text-pink-600" onClick={() => setShowMobileMenu(false)}>Fragrance</Link>
                <Link href="/about" className="text-lg font-medium text-gray-900 hover:text-pink-600" onClick={() => setShowMobileMenu(false)}>About Us</Link>
              </nav>
            </div>
          </div>
        )}
      </header>
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </CartProvider>
  );
}
