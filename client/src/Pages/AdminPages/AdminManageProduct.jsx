import React, { useState, useEffect } from "react";
// Assuming axiosInstance is correctly configured for your API
import axiosInstance from "../../../api/axios"; 
import {
  FaPlus,
  FaTrash,
  FaPen,
  FaTag,
  FaDollarSign,
  FaInfoCircle,
  FaTimes,
  FaImage,
  FaBoxOpen, 
  FaSpinner, 
} from "react-icons/fa";

// --- Configuration Placeholder ---
// NOTE: Implement this to retrieve the JWT token required by verifyAdminMiddleware
const getAdminToken = () => {
    // Replace this with your actual logic (e.g., fetching from localStorage or a context)
    return localStorage.getItem('adminToken'); 
};

const AdminManageProduct = ({ isDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' }); 

  // State fields match the Mongoose schema requirements: title, imageUrl, stock
  const [formData, setFormData] = useState({
    title: "", 
    description: "",
    price: "", // Stored as string for input compatibility
    category: "",
    imageUrl: "", 
    stock: 0, 
  });

  // --- API HELPER & ALERTS ---

  const getConfig = () => ({
    headers: {
      Authorization: `Bearer ${getAdminToken()}`,
    },
  });

  const showAlert = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage({ type: '', text: '' }), 5000);
  };

  // --- API HANDLERS ---

  /** 1. Fetch Products */
  const fetchProducts = async () => {
    setLoading(true);
    setAlertMessage({ type: '', text: '' });
    try {
      const response = await axiosInstance.get("/auth/getAllProducts", getConfig());
      setProducts(response.data.data.products || []); 
    } catch (error) {
      console.error("Error fetching products:", error);
      showAlert('error', error.response?.data?.message || "Failed to fetch products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []); 

  /** 2. Handle Delete (DELETE /auth/deleteProduct/:productId) */
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
        // Use DELETE method and include the productId in the URL path
        await axiosInstance.delete(`/auth/deleteProduct/${productId}`, getConfig()); 

        // Update the state immediately after a successful API call
        setProducts(products.filter((product) => product._id !== productId));
        showAlert('success', "Product deleted successfully!");

    } catch (error) {
        console.error("Error deleting product:", error);
        showAlert('error', error.response?.data?.message || "Failed to delete product.");
    }
  };

  /** 3. Handle Form Submit (Add/Edit) */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.price) <= 0 || Number(formData.stock) < 0) {
        showAlert('error', 'Price must be greater than 0 and Stock cannot be negative.');
        return;
    }
    
    setIsSubmitting(true);
    setAlertMessage({ type: '', text: '' });

    // Prepare data, converting string inputs to Numbers
    const productData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      // Ensure imageUrl is sent as an array of one string to match the schema
      imageUrl: [formData.imageUrl], 
    };

    try {
      if (editProduct) {
        // --- EDIT PRODUCT LOGIC (PUT /auth/editProduct) ---
        // Add the database _id to the payload as productId
        const payload = { ...productData, productId: editProduct._id };

        const response = await axiosInstance.put("/auth/editProduct", payload, getConfig());
        
        if (response.data.success) {
            // Update the state with the product returned by the controller
            setProducts(products.map(item => 
                item._id === editProduct._id ? response.data.product : item
            ));
            showAlert('success', response.data.message || "Product updated successfully!");
        } else {
             showAlert('error', response.data.message || "Failed to update product.");
        }
        
      } else {
        // --- ADD NEW PRODUCT LOGIC (POST /auth/uploadProduct) ---
        const response = await axiosInstance.post("/auth/uploadProduct", productData, getConfig());
        
        if (response.data.success) {
            // Prepend new product to the list
            setProducts([response.data.product, ...products]);
            showAlert('success', response.data.message || "Product added successfully!");
        } else {
             showAlert('error', response.data.message || "Failed to add product.");
        }
      }
      
      resetForm();

    } catch (error) {
      console.error("Submission Error:", error.response ? error.response.data : error);
      showAlert('error', error.response?.data?.message || "An unexpected error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- LOCAL HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setShowForm(false);
    setEditProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
      stock: 0,
    });
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({ 
        title: product.title,
        description: product.description,
        price: String(product.price), // Convert number to string for input
        category: product.category,
        // Get the single URL string from the array for the input field
        imageUrl: Array.isArray(product.imageUrl) ? product.imageUrl[0] || '' : product.imageUrl,
        stock: product.stock,
    });
    setShowForm(true);
  };

  // --- UI STYLES (Kept from original) ---
  const inputStyle = `border rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 text-gray-900 ${
    isDarkMode
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-gray-50 border-gray-300"
  }`;
  
  const tableHeaderClasses = `px-3 py-3 font-semibold text-left text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`;
  const tableCellClasses = `px-3 py-3 text-sm`; 
  const tableRowClasses = `border-t transition ${
    isDarkMode ? "border-gray-800 hover:bg-[#1a1a1a]" : "border-gray-200 hover:bg-gray-50"
  }`;

  // --- RENDER LOGIC ---

  if (loading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#111111] text-white" : "bg-white text-gray-900"}`}>
        <FaSpinner className="text-4xl animate-spin text-purple-500" />
        <p className="ml-3 text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen p-4 sm:p-6 transition-all duration-500 ${
        isDarkMode ? "bg-[#111111] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <h2 className="text-3xl font-bold mb-4 sm:mb-0 text-purple-500">
          📦 Product Inventory
        </h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditProduct(null);
            setFormData({ title: "", description: "", price: "", category: "", imageUrl: "", stock: 0 });
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg shadow-md transition-all duration-300 transform hover:scale-[1.02] ${
            isDarkMode
              ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/50"
              : "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/50"
          }`}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      {/* Alert Message */}
      {alertMessage.text && (
        <div 
          className={`p-4 mb-4 text-sm rounded-lg font-medium ${
            alertMessage.type === 'error' 
              ? (isDarkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-700") 
              : (isDarkMode ? "bg-green-900 text-green-300" : "bg-green-100 text-green-700")
          }`}
        >
          {alertMessage.text}
        </div>
      )}

      <div className="hidden md:block overflow-hidden rounded-xl shadow-xl"> 
        <table
          className={`w-full table-fixed border-collapse ${ 
            isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <thead
            className={`text-left ${
              isDarkMode ? "bg-[#1a1a1a]" : "bg-gray-100"
            }`}
          >
            <tr>
              <th className={`${tableHeaderClasses} w-[4%]`}>#</th>
              <th className={`${tableHeaderClasses} w-[8%]`}>Img</th>
              <th className={`${tableHeaderClasses} w-[15%]`}>Title</th>
              <th className={`${tableHeaderClasses} w-[28%]`}>Description</th>
              <th className={`${tableHeaderClasses} w-[8%]`}>
                <div className="flex items-center gap-1"><FaDollarSign /> Price</div>
              </th>
              <th className={`${tableHeaderClasses} w-[8%]`}>
                <div className="flex items-center gap-1"><FaBoxOpen /> Stock</div>
              </th>
              <th className={`${tableHeaderClasses} w-[14%]`}>Category</th>
              <th className={`${tableHeaderClasses} w-[15%] text-center`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              // Use MongoDB's _id as the key
              <tr key={item._id} className={tableRowClasses}>
                <td className={tableCellClasses}>{index + 1}</td>
                <td className={tableCellClasses}>
                  <img
                    // Safely access the image URL
                    src={Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl} 
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-lg border shadow-sm"
                  />
                </td>
                <td className={`${tableCellClasses} font-semibold overflow-hidden`}>
                  <div className="max-w-[100px] truncate">{item.title}</div>
                </td>
                <td className={`${tableCellClasses} text-sm overflow-hidden`}>
                  <div className="max-w-[200px] line-clamp-2">{item.description}</div>
                </td>
                <td className={tableCellClasses}>₹{item.price}</td>
                <td className={tableCellClasses}>{item.stock}</td>
                <td className={tableCellClasses}>{item.category}</td>
                <td className={`${tableCellClasses} text-center`}>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(item)}
                      aria-label="Edit product"
                      className={`p-2 rounded-full transition transform hover:scale-110 ${
                        isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      <FaPen className="text-white text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      aria-label="Delete product"
                      className={`p-2 rounded-full transition transform hover:scale-110 ${
                        isDarkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <FaTrash className="text-white text-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*Product List (Mobile)*/}
      <div className="md:hidden space-y-4">
        {products.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-xl shadow-lg transition duration-300 ${
              isDarkMode
                ? "bg-[#1a1a1a] border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={Array.isArray(item.imageUrl) ? item.imageUrl[0] : item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-md shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <p className="text-sm opacity-80 flex items-center gap-2">
                    <FaTag className="text-xs" /> {item.category}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  aria-label="Edit product"
                  className={`p-2 rounded-full transition ${
                    isDarkMode ? "bg-blue-600" : "bg-blue-500"
                  }`}
                >
                  <FaPen className="text-white text-xs" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  aria-label="Delete product"
                  className={`p-2 rounded-full transition ${
                    isDarkMode ? "bg-red-600" : "bg-red-500"
                  }`}
                >
                  <FaTrash className="text-white text-xs" />
                </button>
              </div>
            </div>
            <p className="text-sm mb-2 italic line-clamp-2">{item.description}</p>
            <div className={`flex justify-between items-center font-bold text-lg ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                <span>₹{item.price}</span>
                <span className="text-sm font-medium flex items-center gap-1 opacity-80">
                    <FaBoxOpen className="text-xs" /> Stock: {item.stock}
                </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty message */}
      {products.length === 0 && !loading && (
        <div className="text-center mt-10 text-gray-500 py-10 rounded-xl border border-dashed">
          <FaInfoCircle className="mx-auto text-4xl mb-3 text-purple-400" />
          <p className="text-lg">
            No products found. Click **“Add Product”** to add one.
          </p>
        </div>
      )}
      
      {/* --- Modal Form --- */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4"
          onClick={() => resetForm()}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto transition-all transform duration-300 ${
              isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="text-2xl font-bold text-purple-400">
                {editProduct ? "Edit Product" : "Upload New Product"}
              </h3>
              <FaTimes
                className="cursor-pointer text-xl opacity-70 hover:opacity-100 hover:text-red-500 transition"
                onClick={() => resetForm()}
              />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className={inputStyle} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className={`${inputStyle} h-28 resize-none`} required ></textarea>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 text-purple-500" />
                  <input type="number" name="price" placeholder="Price (e.g., 699)" value={formData.price} onChange={handleChange} className={`${inputStyle} pl-10`} required />
                </div>
                <div className="relative flex-1">
                  <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 text-purple-500" />
                  <input type="text" name="category" placeholder="Category (e.g., Clothing, Footwear)" value={formData.category} onChange={handleChange} className={`${inputStyle} pl-10`} required />
                </div>
              </div>
              <div className="flex gap-4">
                  <div className="relative flex-1">
                      <FaBoxOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 text-purple-500" />
                      <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className={`${inputStyle} pl-10`} required />
                  </div>
                  <div className="relative flex-1">
                      <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 text-purple-500" />
                      <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className={`${inputStyle} pl-10`} required />
                  </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 flex justify-center items-center gap-2 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.01]'} ${
                  isDarkMode
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-900/50"
                    : "bg-purple-500 hover:bg-purple-600 text-white shadow-purple-500/50"
                }`}
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : editProduct ? <FaPen /> : <FaPlus />}
                {isSubmitting ? "Processing..." : editProduct ? "Save Changes" : "Add Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageProduct;