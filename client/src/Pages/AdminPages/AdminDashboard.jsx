import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const AdminDashboard = ({ isDarkMode, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔒 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    sessionStorage.clear(); // optional, clear any session data
    navigate("/admin/login"); // redirect to login
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
    { id: "contacts", label: "Contacts", path: "/admin/dashboard/contacts" },
    { id: "products", label: "Manage Products", path: "/admin/dashboard/products" },
    { id: "details", label: "Details", path: "/admin/dashboard/details" },
    { id: "logout", label: "Logout", action: handleLogout }, // 👈 updated
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode ? "bg-[#080808] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`flex items-center justify-between px-6 py-4 shadow-md sticky top-0 z-50 transition-all duration-500 ${
          isDarkMode ? "bg-[#111111]" : "bg-white"
        }`}
      >
        <h1 className="text-xl font-bold text-purple-500">Texura Admin</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 font-semibold text-sm items-center">
          {navItems.map((item) => (
            <li
              key={item.id}
              onClick={() =>
                item.action ? item.action() : navigate(item.path)
              }
              className={`cursor-pointer transition-colors duration-300 ${
                isDarkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {item.label}
            </li>
          ))}

          {/* Theme Toggle */}
          <li
            onClick={toggleTheme}
            className="cursor-pointer flex items-center gap-2 text-lg transition"
          >
            {isDarkMode ? (
              <>
                <FaSun className="text-yellow-400" />
                <span className="hidden sm:inline text-sm font-semibold">
                  Light Mode
                </span>
              </>
            ) : (
              <>
                <FaMoon className="text-gray-700" />
                <span className="hidden sm:inline text-sm font-semibold">
                  Dark Mode
                </span>
              </>
            )}
          </li>
        </ul>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-purple-100 dark:hover:bg-gray-800"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </nav>

      {/* Mobile Menu (Slide from Right) */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 max-w-sm shadow-lg transform transition-transform duration-500 ease-in-out z-40
        ${menuOpen ? "translate-x-0" : "translate-x-full"} 
        ${isDarkMode ? "bg-[#111111]" : "bg-white"} md:hidden`}
      >
        <div className="flex flex-col items-center gap-4 py-10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                item.action ? item.action() : navigate(item.path);
                setMenuOpen(false);
              }}
              className={`w-full text-center py-2 text-lg font-medium ${
                isDarkMode
                  ? "text-gray-300 hover:text-purple-400"
                  : "text-gray-700 hover:text-purple-600"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className="py-2 flex items-center gap-2 text-lg"
          >
            {isDarkMode ? (
              <>
                <FaSun className="text-yellow-400" /> Light Mode
              </>
            ) : (
              <>
                <FaMoon className="text-gray-700" /> Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* Page Content */}
      <main className="p-6 sm:p-10 flex flex-col items-center text-center">
        <div
          className={`w-full max-w-3xl p-8 rounded-2xl shadow-lg transition-all duration-500 ${
            isDarkMode ? "bg-[#111111]" : "bg-white"
          }`}
        >
          <Outlet /> {/* 👈 Subpages render here */}
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`text-center py-4 text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        © 2025 Texura. All rights reserved.
      </footer>
    </div>
  );
};

export default AdminDashboard;
