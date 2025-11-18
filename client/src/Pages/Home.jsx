import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import watchImg from "../assets/watch.png";
import bagImg from "../assets/bag.png";
import shoesImg from "../assets/shoes.png";

const Home = ({ isDarkMode }) => {
  const navigate = useNavigate();

  // Notification
  const [showNotification, setShowNotification] = useState(true);
  const notificationText = import.meta.env.VITE_SPECIAL_OFFER || "🔥 Special Offer: Free shipping on first order!";

  // Hero and text colors
  const heroBg = isDarkMode
    ? "bg-gray-900"
    : "bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700";
  const textMain = isDarkMode ? "text-white" : "text-gray-100";
  const textSub = isDarkMode ? "text-gray-300" : "text-gray-200";
  const cardBg = isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900";
  const buttonPrimary = isDarkMode
    ? "bg-blue-700 hover:bg-blue-600 text-white"
    : "bg-purple-800 hover:bg-purple-700 text-white";

  const products = [
    { img: shoesImg, title: "Stylish Sneaker", desc: "Featured Product" },
    { img: watchImg, title: "Smart Watch", desc: "Trending Now" },
    { img: bagImg, title: "Laptop Backpack", desc: "New Arrival" },
  ];

  return (
    <section
      className={`flex flex-col items-center justify-start min-h-screen pt-16 transition-colors duration-500 ${heroBg}`}
    >
      {/* Notification Bar */}
      {showNotification && (
        <div
          className={`sticky top-16 z-50 mx-auto my-4 px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium shadow-md flex items-center justify-between max-w-md w-auto transition-colors duration-500 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-purple-200 text-purple-900"
          }`}
        >
          <span className="truncate sm:truncate-none">{notificationText}</span>
          <button
            onClick={() => setShowNotification(false)}
            className={`ml-3 p-1 rounded-full transition hover:bg-gray-300 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-purple-300"
            }`}
          >
            <FaTimes size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col items-center justify-center p-4 max-w-7xl mx-auto w-full z-10 text-center">
        {/* Heading */}
        <h1 className={`text-5xl md:text-7xl font-extrabold mb-4 ${textMain}`}>StyleCart</h1>
        <p className={`text-xl md:text-2xl mb-12 max-w-2xl ${textSub}`}>
          Discover Your Style. Effortlessly.
        </p>

        {/* Products */}
        <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-8 mb-16 px-4 w-full justify-center">
          {products.map((product, index) => (
            <div
              onClick={() => navigate("/products")}
              key={index}
              className={`rounded-3xl p-6 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl w-64 ${cardBg}`}
            >
              <img
                src={product.img}
                alt={product.title}
                className="w-40 h-40 object-contain mb-4 rounded-xl"
              />
              <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
              <p className="text-sm">{product.desc}</p>
            </div>
          ))}
        </div>

        {/* Explore Button */}
        <button
          onClick={() => navigate("/products")}
          className={`font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform duration-300 hover:scale-105 ${buttonPrimary}`}
        >
          Explore Products
        </button>
      </div>
    </section>
  );
};

export default Home;
