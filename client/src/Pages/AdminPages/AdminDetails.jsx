import React, { useState } from "react";
import {
  FaUserEdit,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaKey,
} from "react-icons/fa";
import axiosInstance from "../../../api/axios";

const AdminDetails = ({ isDarkMode }) => {
  const [username, setUsername] = useState("admin");
  const [passwordUsername, setPasswordUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //  Handle username change
  const handleUsernameChange = async () => {
    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }

    try {
      const result = await axiosInstance.post("/auth/updateUsername", {
        username,
      });
      if (result?.data?.success) {
        alert("Username updated successfully!");
      } else {
        alert(result?.data?.message || "Failed to update username.");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (
      !passwordUsername?.trim() ||
      !oldPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      alert("Please fill in all required credentials.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (oldPassword === newPassword) {
      alert("New password cannot be the same as the old password.");
      return;
    }

    const payload = {
      username: passwordUsername.trim(),
      oldPassword: oldPassword.trim(),
      newPassword: newPassword.trim(),
    };
    console.log(payload)

    try {
      const result = await axiosInstance.post("/auth/forgetPassword", payload);

      if (result?.data?.success) {
        alert(" Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordUsername("");
      } else {
        alert(result?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error while changing password:", error);
      alert(
        error.response?.data?.message ||
          "Failed to change password. Please try again later."
      );
    }
  };

  //Styles
  const inputBaseStyle = `w-full px-4 py-3 pl-10 rounded-lg border focus:ring-2 transition duration-200 text-sm font-medium ${
    isDarkMode
      ? "bg-gray-800 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/50"
      : "bg-white border-gray-300 text-gray-900 focus:border-purple-600 focus:ring-purple-300"
  }`;

  const buttonBaseStyle = `flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 text-sm shadow-md hover:shadow-lg`;

  return (
    <div
      className={`min-h-screen p-6 flex flex-col items-center transition-all duration-500 ${
        isDarkMode ? "bg-[#111111] text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl p-8 mt-10 transition-all duration-300 border ${
          isDarkMode
            ? "bg-gray-900 border-purple-900/50 hover:shadow-purple-700/30"
            : "bg-white border-gray-300 hover:shadow-purple-500/30"
        }`}
      >
        <h2 className="text-3xl font-bold text-purple-500 mb-8 text-center border-b pb-3">
          Account Security Settings
        </h2>

        {/* --- Username Section --- */}
        <div className="mb-10">
          <label className="block mb-3 font-bold text-base">
            <FaUser className="inline mr-2 text-purple-400" /> Change Username
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <FaUserEdit className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            <button onClick={handleUsernameChange} className={buttonBaseStyle}>
              Update Username
            </button>
          </div>
        </div>

        {/* --- Password Section --- */}
        <div>
          <label className="block mb-3 font-bold text-base">
            <FaLock className="inline mr-2 text-purple-400" /> Change Password
          </label>

          <div className="flex flex-col gap-4">
            {/* Username for password change */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Enter Username"
                value={passwordUsername}
                onChange={(e) => setPasswordUsername(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            {/* Old Password */}
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className={inputBaseStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* New Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputBaseStyle}
              />
            </div>

            <button
              onClick={handlePasswordChange}
              className={`${buttonBaseStyle} mt-2`}
            >
              <FaLock /> Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
