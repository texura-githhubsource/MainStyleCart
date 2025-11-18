import React, { useEffect, useState, useMemo } from "react";
import { FaWhatsapp, FaDownload, FaSearch, FaTag, FaBoxOpen, FaSpinner } from "react-icons/fa";
import axiosInstance from "../../api/axios.js"

const Products = ({ isDarkMode }) => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const phoneNumber = import.meta.env.VITE_CONTACT_NUMBER; 
  const useWatermark = String(import.meta.env.VITE_WATERMARK).toLowerCase() === "true";
  const watermarkText = import.meta.env.VITE_WATERMARK_TEXT || "StyleCart";
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/auth/getAllProducts"); 
        const fetchedProducts = response.data.data.products || [];
        setProductsData(fetchedProducts);
      } catch (err) {
        console.error("Error fetching products from API:", err);
        setError("Could not fetch products from the server. Please check the network.");
        setProductsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Filtering Logic ---
  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      productsData.map((p) => p.category).filter(Boolean)
    );
    return ["All", ...Array.from(uniqueCategories)];
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    
    const normalizedSelectedCategory = selectedCategory.toLowerCase(); 

    return productsData.filter((p) => {
      if (!p) return false;
      const normalizedProductCategory = p.category?.toLowerCase(); 

      const matchCategory = normalizedSelectedCategory === "all" || 
                            normalizedProductCategory === normalizedSelectedCategory;
      
      const matchSearch = !query || 
                          p.title?.toLowerCase().includes(query) || 
                          normalizedProductCategory?.includes(query) ||
                          p.description?.toLowerCase().includes(query);
                          
      return matchCategory && matchSearch;
    });
  }, [productsData, selectedCategory, searchTerm]);

  const handleOrderNow = (product) => {
    const imageUrl = Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;
    
    const message = `Hello! I want to order this product:
Product: ${product.title}
Price: ₹${product.price}
Category: ${product.category}
Stock: ${product.stock}
Image URL: ${imageUrl || "N/A"}`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleDownload = async (imageUrl, fileName) => {
    if (!imageUrl) return;

    const url = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
    
    try {
      if (!useWatermark) return triggerDownload(url, `${sanitizeFilename(fileName)}.png`);

      const img = await loadImage(url);
      
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Watermark logic
      const fontSize = Math.max(14, Math.floor(canvas.width / 20));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = isDarkMode ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.75)";
      ctx.textBaseline = "bottom";
      const padding = Math.floor(fontSize * 0.6);
      const textWidth = ctx.measureText(watermarkText).width;
      ctx.fillText(watermarkText, canvas.width - textWidth - padding, canvas.height - padding);

      const dataUrl = canvas.toDataURL("image/png");
      triggerDownload(dataUrl, `${sanitizeFilename(fileName)}-watermarked.png`);
    } catch (err) {
      console.error("Download error, falling back to direct download:", err);
      triggerDownload(url, `${sanitizeFilename(fileName)}.png`);
    }
  };

  const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

  const triggerDownload = (href, filename) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const sanitizeFilename = (name = "product") => name.replace(/[^a-z0-9_\-\.]/gi, "_").toLowerCase();

  // Tailwind classes
  const pageBg = isDarkMode ? "bg-gray-900 text-white" : "bg-purple-50 text-gray-900";
  const cardBg = isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonPrimary = isDarkMode ? "bg-blue-700 hover:bg-blue-600 text-white" : "bg-purple-600 hover:bg-purple-500 text-white";
  const buttonSecondary = isDarkMode ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-400 text-white";

  if (loading) return (
    <div className={`min-h-screen p-6 flex items-center justify-center ${pageBg}`}>
      <div className="text-center animate-pulse text-xl">
        <FaSpinner className="inline mr-3 animate-spin" /> Loading products...
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen p-6 flex items-center justify-center ${pageBg}`}>
      <div className="text-center p-8 rounded-lg shadow-xl" style={{ backgroundColor: isDarkMode ? '#3b0000' : '#ffebeb', color: isDarkMode ? '#ff9b9b' : '#cc0000' }}>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    </div>
  );

  // --- Component Render ---
  return (
    <div className={`min-h-screen p-6 transition-colors duration-500 ${pageBg}`}>
      <h1 className="text-4xl font-bold mb-6 text-center">{isDarkMode ? "Inventory" : "Our Products"}</h1>

      <div className={`sticky top-0 sm:top-16 z-40 backdrop-blur-md bg-opacity-70 ${isDarkMode ? "bg-gray-900/70" : "bg-white/70"} border-b border-gray-300/10 py-4 mb-6`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className={`flex items-center w-full sm:max-w-md rounded-full px-4 py-2 shadow-md ${isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-300"}`}>
            <FaSearch className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} mr-2`} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, category, or description..."
              className={`w-full bg-transparent outline-none ${isDarkMode ? "text-white placeholder-gray-400" : "text-gray-900 placeholder-gray-500"}`}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedCategory.toLowerCase() === cat.toLowerCase() ? `${buttonPrimary} shadow-lg` : `border ${isDarkMode ? "border-gray-700 bg-gray-800/50 hover:bg-gray-700" : "border-gray-300 bg-white hover:bg-gray-100"}`}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, idx) => {
            const rawImageUrl = p.imageUrl || [];
            const imageUrl = Array.isArray(rawImageUrl) ? rawImageUrl[0] : rawImageUrl;
            
            return (
              <div key={p._id || idx} className={`rounded-3xl p-4 shadow-lg flex flex-col items-center text-center transition-transform transform hover:scale-105 ${cardBg}`}>
                <div className="w-44 h-44 mb-4 flex items-center justify-center relative">
                  {imageUrl ? (
                    <img src={imageUrl} alt={p.title || 'Product'} className="max-w-full max-h-full object-contain rounded-xl" />
                  ) : (
                    <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">No Image</div>
                  )}
                </div>
                
                <h3 className="font-bold text-lg mb-1 line-clamp-1">{p.title || 'N/A'}</h3>
                
                <div className="flex justify-center items-center gap-3 text-sm mb-2 text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-1"><FaTag className="text-xs" /> {p.category}</p>
                    <p className="flex items-center gap-1"><FaBoxOpen className="text-xs" /> Stock: {p.stock}</p>
                </div>
                
                <p className="font-semibold text-xl text-purple-600 dark:text-purple-400 mb-3">₹{p.price}</p>
                
                <p className="text-xs mb-3 italic line-clamp-2">{p.description}</p>


                <div className="flex gap-3 mt-auto">
                  <button onClick={() => handleOrderNow(p)} className={`flex items-center px-4 py-2 rounded-full transition ${buttonSecondary}`}>
                    <FaWhatsapp className="mr-2" /> Order
                  </button>
                  <button onClick={() => handleDownload(imageUrl, p.title || "product")} className={`flex items-center px-4 py-2 rounded-full transition ${buttonPrimary}`}>
                    <FaDownload className="mr-2" /> Download
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-gray-400">No products found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default Products;