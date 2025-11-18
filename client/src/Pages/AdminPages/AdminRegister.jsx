import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axios";

const AdminRegister = ({ isDarkMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Password and confirm password should be same!");
      return;
    }
    const payload  = {username:username, password: password};

    //sending data to the backend(that is payload)
    
    navigate("/admin/login");
    try {
      const result = await axiosInstance.post("/authRegister", payload);
      console.log(result?.data?.success, "hehehe")
      if (result?.data?.token) {
        localStorage.setItem("token", result?.data?.token);
      }
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Register failed:", error?.response?.data || error.message);
      alert(error.response?.data || error?.message || "Register failed. Try again.");
    } finally {
      setLoading(false);
    }
  };
  console.log(username, password, "checking")
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
          Admin Registration
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block mb-2 text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
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
            <label className="block mb-2 text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
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

          <div>
            <label className="block mb-2 text-sm font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <p
          className={`mt-6 text-center text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Already have an account?{" "}
          <span
            onClick={() => navigate("/adminLogin")}
            className="text-purple-500 hover:text-purple-600 cursor-pointer"
          >
            Login
          </span>
        </p>

        {/* Footer */}
        <p
          className={`mt-8 text-center text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          © 2025 Keshav Singhania. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminRegister;