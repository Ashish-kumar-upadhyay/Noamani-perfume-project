"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  imageHover: string;
  category: string;
  stock: number;
  assignedPages?: string[];
}

const availablePages = [
  "Bestsellers",
  "Fragrance",
  "Shop All",
];

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageUploadType, setImageUploadType] = useState<"url" | "upload">(
    "url"
  );
  const [hoverImageUploadType, setHoverImageUploadType] = useState<
    "url" | "upload"
  >("url");
  const [formData, setFormData] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    imageHover: string;
    category: string;
    stock: string;
    assignedPages: string[];
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
    imageHover: "",
    category: "",
    stock: "",
    assignedPages: [],
  });
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    price: string;
    description: string;
    image: string;
    imageHover: string;
    category: string;
    stock: string;
    assignedPages: string[];
  }>({
    name: "",
    price: "",
    description: "",
    image: "",
    imageHover: "",
    category: "",
    stock: "",
    assignedPages: [],
  });
  const [activeTab, setActiveTab] = useState("products");
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = localStorage.getItem("adminInfo");
    if (!adminInfo) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error("Error fetching products");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          assignedPages: formData.assignedPages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      toast.success("Product added successfully");
      setShowAddForm(false);
      setFormData({
        name: "",
        price: "",
        description: "",
        image: "",
        imageHover: "",
        category: "",
        stock: "",
        assignedPages: [],
      });
      fetchProducts();
    } catch (error) {
      toast.error("Error adding product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProductId(product._id);
    setEditFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      image: product.image,
      imageHover: product.imageHover || "",
      category: product.category,
      stock: product.stock.toString(),
      assignedPages: product.assignedPages || [],
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editFormData,
          price: parseFloat(editFormData.price),
          stock: parseInt(editFormData.stock),
          assignedPages: editFormData.assignedPages,
        }),
      });
      if (!response.ok) throw new Error("Failed to update product");
      toast.success("Product updated successfully");
      setEditProductId(null);
      fetchProducts();
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditProductId(null);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminInfo");
      router.push("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const handleImageUpload = async (
    file: File,
    fieldToUpdate: "image" | "imageHover",
    formType: "add" | "edit"
  ) => {
    if (!file) return;

    const toastId = toast.loading("Uploading image...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/products/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      const { imageUrl } = data;

      if (formType === "add") {
        setFormData((prev) => ({ ...prev, [fieldToUpdate]: imageUrl }));
      } else {
        setEditFormData((prev) => ({ ...prev, [fieldToUpdate]: imageUrl }));
      }

      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error) {
      toast.error("Error uploading image", { id: toastId });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600 tracking-wide">
            Products Management
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition-all duration-300 flex items-center space-x-2"
          >
            {showAddForm ? (
              <>
                <span>✖️</span>
                <span>Cancel</span>
              </>
            ) : (
              <>
                <span>➕</span>
                <span>Add New Product</span>
              </>
            )}
          </motion.button>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-8 rounded-xl shadow-lg mb-8 border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Add New Product
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Product Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Product Price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Product Category"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Product Stock"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image Upload Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageUploadType"
                      value="url"
                      checked={imageUploadType === "url"}
                      onChange={() => setImageUploadType("url")}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-300">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="imageUploadType"
                      value="upload"
                      checked={imageUploadType === "upload"}
                      onChange={() => setImageUploadType("upload")}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-300">Upload</span>
                  </label>
                </div>
              </div>
              {imageUploadType === "url" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Product Image URL"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(e.target.files[0], "image", "add");
                      }
                    }}
                    className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {formData.image && (
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded: {formData.image}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Hover Image Upload Type
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoverImageUploadType"
                      value="url"
                      checked={hoverImageUploadType === "url"}
                      onChange={() => setHoverImageUploadType("url")}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-300">URL</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hoverImageUploadType"
                      value="upload"
                      checked={hoverImageUploadType === "upload"}
                      onChange={() => setHoverImageUploadType("upload")}
                      className="form-radio h-4 w-4 text-purple-600"
                    />
                    <span className="ml-2 text-gray-300">Upload</span>
                  </label>
                </div>
              </div>
              {hoverImageUploadType === "url" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Second Image URL (on hover)
                  </label>
                  <input
                    type="url"
                    value={formData.imageHover}
                    onChange={(e) =>
                      setFormData({ ...formData, imageHover: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    placeholder="Second Image URL (on hover)"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Upload Second Image (on hover)
                  </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        handleImageUpload(
                          e.target.files[0],
                          "imageHover",
                          "add"
                        );
                      }
                    }}
                    className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  {formData.imageHover && (
                    <p className="text-xs text-gray-400 mt-1">
                      Uploaded: {formData.imageHover}
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                  placeholder="Product Description"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Assigned Pages
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {availablePages.map((page) => (
                    <div key={page} className="flex items-center">
                      <input
                        type="checkbox"
                        id={page}
                        checked={formData.assignedPages.includes(page)}
                        onChange={() =>
                          setFormData((prev) => ({
                            ...prev,
                            assignedPages: prev.assignedPages.includes(page)
                              ? prev.assignedPages.filter((p) => p !== page)
                              : [...prev.assignedPages, page],
                          }))
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                      />
                      <label
                        htmlFor={page}
                        className="ml-2 text-sm text-gray-300"
                      >
                        {page}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
        >
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    Loading products...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-400"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {editProductId === product._id ? (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditSave(product._id)}
                            className="text-green-500 hover:text-green-400 transition-colors duration-200"
                          >
                            Save
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleEditCancel}
                            className="text-gray-500 hover:text-gray-400 transition-colors duration-200"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEditClick(product)}
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-400 transition-colors duration-200"
                          >
                            Delete
                          </motion.button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {editProductId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setEditProductId(null)}
          >
            <div
              className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 text-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Edit Product
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editProductId) handleEditSave(editProductId);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      required
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      name="category"
                      value={editFormData.category}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      required
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Image Upload Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editImageUploadType"
                        value="url"
                        checked={imageUploadType === "url"}
                        onChange={() => setImageUploadType("url")}
                        className="form-radio h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-gray-300">URL</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editImageUploadType"
                        value="upload"
                        checked={imageUploadType === "upload"}
                        onChange={() => setImageUploadType("upload")}
                        className="form-radio h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-gray-300">Upload</span>
                    </label>
                  </div>
                </div>
                {imageUploadType === "url" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      required
                      name="image"
                      value={editFormData.image}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageUpload(e.target.files[0], "image", "edit");
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    {editFormData.image && (
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded: {editFormData.image}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hover Image Upload Type
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editHoverImageUploadType"
                        value="url"
                        checked={hoverImageUploadType === "url"}
                        onChange={() => setHoverImageUploadType("url")}
                        className="form-radio h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-gray-300">URL</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editHoverImageUploadType"
                        value="upload"
                        checked={hoverImageUploadType === "upload"}
                        onChange={() => setHoverImageUploadType("upload")}
                        className="form-radio h-4 w-4 text-purple-600"
                      />
                      <span className="ml-2 text-gray-300">Upload</span>
                    </label>
                  </div>
                </div>
                {hoverImageUploadType === "url" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Second Image URL (on hover)
                    </label>
                    <input
                      type="url"
                      name="imageHover"
                      value={editFormData.imageHover}
                      onChange={handleEditChange}
                      className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                      placeholder="Second Image URL (on hover)"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Upload Second Image (on hover)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files) {
                          handleImageUpload(
                            e.target.files[0],
                            "imageHover",
                            "edit"
                          );
                        }
                      }}
                      className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                    />
                    {editFormData.imageHover && (
                      <p className="text-xs text-gray-400 mt-1">
                        Uploaded: {editFormData.imageHover}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white p-3 shadow-sm focus:border-purple-500 focus:ring-purple-500 placeholder-gray-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Assigned Pages
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {availablePages.map((page) => (
                      <div key={page} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`edit-${page}`}
                          checked={editFormData.assignedPages.includes(page)}
                          onChange={() =>
                            setEditFormData((prev) => ({
                              ...prev,
                              assignedPages: prev.assignedPages.includes(page)
                                ? prev.assignedPages.filter((p) => p !== page)
                                : [...prev.assignedPages, page],
                            }))
                          }
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                        />
                        <label
                          htmlFor={`edit-${page}`}
                          className="ml-2 text-sm text-gray-300"
                        >
                          {page}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleEditCancel}
                    className="bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
