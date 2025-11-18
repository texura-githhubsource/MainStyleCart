import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// ===== User Pages =====
import Navbar from "./Pages/Navbar.jsx";
import Home from "./Pages/Home.jsx";
import Products from "./Pages/Product.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs.jsx";

// ===== Admin Pages =====
import AdminDashboard from "./Pages/AdminPages/AdminDashboard.jsx";
import AdminContacts from "./Pages/AdminPages/AdminContacts.jsx";
import AdminManageProduct from "./Pages/AdminPages/AdminManageProduct.jsx";
import AdminDetails from "./Pages/AdminPages/AdminDetails.jsx";
import AdminLogin from "./Pages/AdminPages/AdminLogin.jsx";
import AdminRegister from "./Pages/AdminPages/AdminRegister.jsx";

// ===== Protected Route =====
import ProtectedAdminRoute from "./component/ProtectedAdminRoute.jsx";

// ===== 404 Component =====
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
    <p className="text-lg">The page you're looking for doesn't exist.</p>
  </div>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDarkMode ? "bg-[#080808] text-white" : "bg-white text-black"
      }`}
    >
      {/* Navbar for User Pages */}
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      <Routes>
        {/* ===== User Routes ===== */}
        <Route path="/" element={<Home isDarkMode={isDarkMode} />} />
        <Route path="/products" element={<Products isDarkMode={isDarkMode} />} />
        <Route path="/about" element={<AboutUs isDarkMode={isDarkMode} />} />
        <Route path="/contact" element={<ContactUs isDarkMode={isDarkMode} />} />

        {/* ===== PROTECTED ADMIN ROUTES ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
              />
            </ProtectedAdminRoute>
          }
        >
          <Route
            index
            element={<div>Welcome to your Admin Dashboard</div>}
          />

          <Route
            path="contacts"
            element={
              <ProtectedAdminRoute>
                <AdminContacts isDarkMode={isDarkMode} />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="products"
            element={
              <ProtectedAdminRoute>
                <AdminManageProduct isDarkMode={isDarkMode} />
              </ProtectedAdminRoute>
            }
          />

          <Route
            path="details"
            element={
              <ProtectedAdminRoute>
                <AdminDetails isDarkMode={isDarkMode} />
              </ProtectedAdminRoute>
            }
          />
        </Route>

        {/* ===== Admin Auth Pages (UNPROTECTED) ===== */}
        <Route
          path="/admin/login"
          element={<AdminLogin isDarkMode={isDarkMode} />}
        />
        <Route
          path="/admin/register"
          element={<AdminRegister isDarkMode={isDarkMode} />}
        />

        {/* ===== Default Fallback ===== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
