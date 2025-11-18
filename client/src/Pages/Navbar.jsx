import React from "react";
import { Link } from "react-router-dom"; // Import Link

const Navbar = ({ isDarkMode, toggleTheme }) => {
  return (
    <nav
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 backdrop-blur-lg transition-all duration-300 ${
        isDarkMode ? "bg-[#0a0a0a]/80 text-white" : "bg-gray-100/80 text-black"
      }`}
    >
      <h1 className="text-xl font-semibold">KeshavSinghania</h1>

      <ul className="flex gap-6 text-sm md:text-base">
        <li>
          <Link to="/" className="hover:text-purple-500 transition">
            Home
          </Link>
        </li>
        <li>
          <Link to="/products" className="hover:text-purple-500 transition">
            Products
          </Link>
        </li>
        <li>
          <Link to="/about" className="hover:text-purple-500 transition">
            About Us
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-purple-500 transition">
            Contact
          </Link>
        </li>
        {/* <li>
          <Link to="/admin/login" className="hover:text-purple-500 transition">
            Admin
          </Link>
        </li> */}
      </ul>

      <button
        onClick={toggleTheme}
        className="border rounded-xl px-3 py-1 text-sm hover:bg-purple-500 hover:text-white transition"
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </nav>
  );
};

export default Navbar;
