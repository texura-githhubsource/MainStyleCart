import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";

const AdminLogin = ({ isDarkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

//handling login submit  
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const payload = { username, password };

  try {
    const result = await axiosInstance.post("/auth/login", payload);
    const token = result.data?.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/admin/dashboard");
    } else {
      alert("Login failed — token not received from server.");
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        isDarkMode ? "bg-[#080808] text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-2xl transition-all duration-500 ${
          isDarkMode ? "bg-[#111111]" : "bg-white"
        }`}
      >
        <h2
          className={`text-center text-3xl font-bold mb-8 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Admin Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-sm font-semibold">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? "bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500"
              }`}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? "bg-[#1a1a1a] border-gray-700 text-white placeholder-gray-400 focus:ring-purple-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className={`mt-8 text-center text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          © 2025 Texura. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
