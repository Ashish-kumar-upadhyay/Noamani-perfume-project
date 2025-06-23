"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Define types for mega menu content
type ProductItem = {
  title: string;
  price: number;
  image: string;
  href: string;
};

type ListItem = {
  title: string;
  href: string;
};

type FavoriteItem = {
  title: string;
  href: string;
};

type MegaMenuContent = {
  products: ProductItem[];
  listTitle: string;
  listItems: ListItem[];
  favoritesTitle: string;
  favoriteItems: FavoriteItem[];
};

// Sample data for each category
const megaMenuData: any = {
  "Shop All": {
    products: [
      {
        title: "Rose Saffron",
        price: 89,
        image: "/product3.jpg",
        href: "/product/signature-scent",
      },
      {
        title: "Pimento",
        price: 65,
        image: "/product1.jpg",
        href: "/product/everyday-essence",
      },
      {
        title: "Resin",
        price: 75,
        image: "/product2.jpg",
        href: "/product/morning-dew",
      },
      {
        title: "Ocean Breeze",
        price: 82,
        image: "/product3.jpg",
        href: "/product/ocean-breeze",
      },
    ],
    listTitle: "Categories",
    listItems: [
      { title: "All Products", href: "/shop/all" },
      { title: "New Arrivals", href: "/shop/new" },
    ],
  },
  Bestsellers: {
    products: [
      {
        title: "Velvet Orchid",
        price: 110,
        image: "/product1.jpg",
        href: "/product/velvet-orchid",
      },
      {
        title: "Royal Oud",
        price: 125,
        image: "/product2.jpg",
        href: "/product/royal-oud",
      },
    ],
    listTitle: "Top Rated",
    listItems: [{ title: "Fragrances", href: "/bestsellers/fragrances" }],
    favoritesTitle: "Customer Favorites",
    favoriteItems: [
      { title: "Award Winners", href: "/collections/award-winners" },
      { title: "Editor's Picks", href: "/collections/editors-picks" },
      { title: "Most Reviewed", href: "/collections/most-reviewed" },
      { title: "Trending Now", href: "/collections/trending" },
    ],
  },
  Fragrance: {
    products: [
      {
        title: "Amber Musk",
        price: 98,
        image: "/product3.jpg",
        href: "/product/amber-musk",
      },
      {
        title: "Citrus Bloom",
        price: 78,
        image: "/product4.jpg",
        href: "/product/citrus-bloom",
      },
    ],
    listTitle: "",
    listItems: [
      // No items
    ],
  },
  // "Skin + Hair": {
  //   products: [
  //     {
  //       title: "Radiance Serum",
  //       price: 68,
  //       image: "/productall.png",
  //       href: "/product/radiance-serum",
  //     },
  //     {
  //       title: "Repair Mask",
  //       price: 45,
  //       image: "/product1.jpg",
  //       href: "/product/repair-mask",
  //     },
  //   ],
  //   listTitle: "Skin Care",
  //   listItems: [
  //     { title: "Cleansers", href: "/skin/cleansers" },
  //     { title: "Moisturizers", href: "/skin/moisturizers" },
  //     { title: "Serums", href: "/skin/serums" },
  //     { title: "Masks", href: "/skin/masks" },
  //   ],
  // },
  "Discovery Sets": {
    products: [
      {
        title: "Scent Sampler",
        price: 35,
        image:
          "https://images.pexels.com/photos/3762324/pexels-photo-3762324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/product/scent-sampler",
      },
      {
        title: "Skincare Starter",
        price: 48,
        image:
          "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/product/skincare-starter",
      },
    ],
    listTitle: "By Category",
    listItems: [
      { title: "Fragrance Sets", href: "/discovery/fragrance" },
      { title: "Skincare Sets", href: "/discovery/skincare" },
      { title: "Hair Sets", href: "/discovery/hair" },
      { title: "Mixed Collections", href: "/discovery/mixed" },
    ],
  },
  "Gifts + Sets": {
    products: [
      {
        title: "Luxury Gift Set",
        price: 150,
        image: "/product2.jpg",
        href: "/product/luxury-gift-set",
      },
      {
        title: "Essential Collection",
        price: 95,
        image: "/product3.jpg",
        href: "/product/essential-collection",
      },
    ],
    listTitle: "Gift Types",
    listItems: [
      { title: "Gift Sets", href: "/gifts/sets" },
      { title: "Gift Cards", href: "/gifts/cards" },
      { title: "Ready to Gift", href: "/gifts/ready" },
      { title: "Limited Edition", href: "/gifts/limited" },
    ],
  },
  "About Us": {
    products: [
      {
        title: "Our Story",
        price: 49,
        image: "/product4.jpg",
        href: "/about/story",
      },
      {
        title: "Sustainability",
        price: 59,
        image: "/productall.png",
        href: "/about/sustainability",
      },
    ],
    listTitle: "Learn More",
    listItems: [
      { title: "Our Brand", href: "/about/brand" },
      { title: "Ingredients", href: "/about/ingredients" },
      { title: "Sustainability", href: "/about/sustainability" },
      { title: "Press", href: "/about/press" },
    ],
  },
  "Perfect Perfume Quiz": {
    products: [
      {
        title: "Find Your Scent",
        price: 0,
        image:
          "https://images.pexels.com/photos/6669033/pexels-photo-6669033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/quiz/start",
      },
      {
        title: "Custom Blends",
        price: 85,
        image:
          "https://images.pexels.com/photos/3650469/pexels-photo-3650469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/custom-blends",
      },
    ],
    listTitle: "Quiz Types",
    listItems: [
      { title: "Scent Profile", href: "/quiz/profile" },
      { title: "Mood Match", href: "/quiz/mood" },
      { title: "Personality", href: "/quiz/personality" },
      { title: "Season", href: "/quiz/season" },
    ],
  },
  "Customer Care": {
    products: [
      {
        title: "Free Shipping",
        price: 50,
        image:
          "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/customer-care/shipping",
      },
      {
        title: "Easy Returns",
        price: 30,
        image:
          "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/customer-care/returns",
      },
    ],
    listTitle: "Help Center",
    listItems: [
      { title: "Shipping Information", href: "/customer-care/shipping" },
      { title: "Returns & Exchanges", href: "/customer-care/returns" },
      { title: "FAQs", href: "/customer-care/faqs" },
      { title: "Contact Us", href: "/customer-care/contact" },
    ],
  },
};

// Default fallback content
const defaultContent: any = {
  products: [
    {
      title: "Featured Item",
      price: 75,
      image:
        "https://images.pexels.com/photos/3373230/pexels-photo-3373230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      href: "/product/featured",
    },
    {
      title: "New Arrival",
      price: 85,
      image:
        "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      href: "/product/new-arrival",
    },
  ],
  listTitle: "Categories",
  listItems: [
    { title: "All Products", href: "/shop/all" },
    { title: "New Arrivals", href: "/shop/new" },
    { title: "Bestsellers", href: "/shop/bestsellers" },
    { title: "Last Chance", href: "/shop/last-chance" },
  ],
};

type MegaMenuProps = {
  category: string;
  onClose: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
};

export default function MegaMenu({
  category,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const [content, setContent] = useState<MegaMenuContent>(defaultContent);
  const country = useCountry();
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setContent(megaMenuData[category] || defaultContent);
  }, [category]);

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="absolute top-full left-0 right-0 bg-white shadow-lg z-50"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Featured Products */}
          <div className="col-span-7">
            <div className="grid grid-cols-4 gap-4">
              {content.products.map((product, index) => (
                <div key={index} className="group block relative">
                  <div
                    className="relative aspect-[3/4] overflow-hidden rounded-sm mb-2 cursor-pointer"
                    onClick={() => router.push(product.href)}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300 z-10">
                      <button
                        className="bg-white text-black px-4 py-2 rounded-full font-semibold mb-2 shadow hover:bg-gray-100 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(product.href);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        className="bg-black text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-900 transition"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await addToCart({
                            id:
                              product.href.split("/").pop() ||
                              product.title.toLowerCase().replace(/\s+/g, "-"),
                            name: product.title,
                            price: product.price,
                            image: product.image,
                            quantity: 1,
                          });
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-brand-dark transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatPrice(product.price, country)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories and Collections */}
          <div className="col-span-5 flex items-center justify-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 w-full max-w-xs mx-auto shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4 text-center">
                {content.listTitle}
              </h3>
              <ul className="space-y-3">
                {content.listItems.map((item, index) => (
                  <li key={index} className="text-center">
                    <Link
                      href={item.href}
                      className="group flex items-center justify-center text-base text-gray-700 hover:text-brand-dark font-medium transition-colors"
                    >
                      <span>{item.title}</span>
                      <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
