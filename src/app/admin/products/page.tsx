import React, { useState } from 'react';

const [formData, setFormData] = useState({
  name: '',
  price: '',
  description: '',
  image: '',
  category: '',
  stock: '',
  assignedPages: [],
});

const availablePages = [
  'Bestsellers',
  'Fragrance',
  'Skin + Hair',
  'Gifts + Sets',
  'Shop All'
];

{showAddForm && (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned Pages (Select all pages where this product should appear)
        </label>
        <div className="space-y-2">
          {availablePages.map((page) => (
            <label key={page} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.assignedPages.includes(page)}
                onChange={(e) => {
                  const newPages = e.target.checked
                    ? [...formData.assignedPages, page]
                    : formData.assignedPages.filter((p) => p !== page);
                  setFormData({ ...formData, assignedPages: newPages });
                }}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{page}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Note: Products will only appear on the pages you select here. Make sure to select all relevant pages.
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => setShowAddForm(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md"
        >
          Add Product
        </button>
      </div>
    </form>
  </div>
)}

{editProductId && (
  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
    <form onSubmit={(e) => { e.preventDefault(); handleEditSave(editProductId); }} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={editFormData.name}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={editFormData.price}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={editFormData.description}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="text"
          name="image"
          value={editFormData.image}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <input
          type="text"
          name="category"
          value={editFormData.category}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          type="number"
          name="stock"
          value={editFormData.stock}
          onChange={handleEditChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Assigned Pages (Select all pages where this product should appear)
        </label>
        <div className="space-y-2">
          {availablePages.map((page) => (
            <label key={page} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={editFormData.assignedPages.includes(page)}
                onChange={(e) => {
                  const newPages = e.target.checked
                    ? [...editFormData.assignedPages, page]
                    : editFormData.assignedPages.filter((p) => p !== page);
                  setEditFormData({ ...editFormData, assignedPages: newPages });
                }}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-sm text-gray-700">{page}</span>
            </label>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Note: Products will only appear on the pages you select here. Make sure to select all relevant pages.
        </p>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleEditCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  </div>
)}

<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Name
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Price
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Category
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Stock
        </th>
        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Assigned Pages
        </th>
        <th scope="col" className="relative px-6 py-3">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {products.map((product) => (
        <tr key={product._id}>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {product.name}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${product.price}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {product.category}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {product.stock}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {editProductId === product._id ? (
              <div className="space-y-1">
                {availablePages.map((page) => (
                  <label key={page} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editFormData.assignedPages.includes(page)}
                      onChange={(e) => {
                        const newPages = e.target.checked
                          ? [...editFormData.assignedPages, page]
                          : editFormData.assignedPages.filter((p) => p !== page);
                        setEditFormData({ ...editFormData, assignedPages: newPages });
                      }}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-gray-700">{page}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {product.assignedPages && product.assignedPages.length > 0 ? (
                  product.assignedPages.map((page) => (
                    <span
                      key={page}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {page}
                    </span>
                  ))
                ) : (
                  <span className="text-red-500">No pages assigned</span>
                )}
              </div>
            )}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              onClick={() => handleEditClick(product)}
              className="text-black hover:text-gray-700 mr-4"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="text-red-600 hover:text-red-900"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

const handleEditClick = (product: Product) => {
  setEditProductId(product._id);
  setEditFormData({
    name: product.name,
    price: product.price.toString(),
    description: product.description,
    image: product.image,
    category: product.category,
    stock: product.stock.toString(),
    assignedPages: product.assignedPages || [],
  });
};

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  // ... existing code ...
}; 