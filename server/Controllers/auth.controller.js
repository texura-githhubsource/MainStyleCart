import Admin from "../models/admin.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secretToken = process.env.SECRET_KEY;

//ADMIN REGISTER
export const adminRegister = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Both username and password are required",
        error: true,
        success: false,
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already registered",
        error: true,
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const user = await Admin.create({
      username,
      role: "admin",
      password: hashedPassword,
    });

    // Prepare payload for JWT
    const userData = { id: user._id, role: user.role };

    // Generate token
    const token = jwt.sign(userData, secretToken, { expiresIn: "7d" });

    // Send token as cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Successfully registered as admin",
      error: false,
      success: true,
      data: { token },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Something went wrong, please try again later!",
      error: true,
      success: false,
    });
  }
};

// ADMIN LOGIN 
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Both username and password are required",
        error: true,
        success: false,
      });
    }

    // Check if admin exists
    const adminExists = await Admin.findOne({ username });
    if (!adminExists) {
      return res.status(404).json({
        message: "Invalid credentials, try again",
        error: true,
        success: false,
      });
    }

    // Compare password
    const isMatched = await bcrypt.compare(password, adminExists.password);
    if (!isMatched) {
      return res.status(400).json({
        message: "Invalid credentials, try again",
        error: true,
        success: false,
      });
    }

    // Generate JWT
    const payload = { id: adminExists._id, role: adminExists.role };
    const token = jwt.sign(payload, secretToken, { expiresIn: "7d" });

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Successfully logged in",
      error: false,
      success: true,
      data: { token },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Something went wrong, please try again later!",
      error: true,
      success: false,
    });
  }
};

//ADMIN LOGOUT
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Successfully logged out",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Something went wrong during logout!",
      error: true,
      success: false,
    });
  }
};

//ADMIN FORGET PASSWORD
export const adminForgetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, username } = req.body;

    if (!oldPassword || !newPassword || !username) {
      return res.status(400).json({
        message: "Please provide username, old password, and new password.",
        error: true,
        success: false,
      });
    }

    //Check if admin exists
    const adminExists = await Admin.findOne({ username });
    if (!adminExists) {
      return res.status(404).json({
        message: "Invalid username.",
        error: true,
        success: false,
      });
    }

    //Compare old password
    const isMatched = await bcrypt.compare(oldPassword, adminExists.password);
    if (!isMatched) {
      return res.status(400).json({
        message: "Old password is incorrect.",
        error: true,
        success: false,
      });
    }

    //Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminExists.password = hashedPassword;

    //Save updated admin
    await adminExists.save();

    res.status(200).json({
      message: "Password changed successfully!",
      error: false,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
      error: true,
      success: false,
    });
  }
};

// SEND MESSAGE TO ADMIN
export const sendMessageToAdmin = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please fill in all required fields (name, email, message).",
        error: true,
        success: false,
      });
    }

    // Find admin
    const admin = await Admin.findOne({ username: "admin" });
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found. Please contact support.",
        error: true,
        success: false,
      });
    }

    // Push new message
    admin.adminMessages.push({
      name,
      email,
      message,
    });

    await admin.save();

    return res.status(200).json({
      message: "Message successfully sent to the admin!",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("Error sending message to admin:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      error: true,
      success: false,
    });
  }
};
