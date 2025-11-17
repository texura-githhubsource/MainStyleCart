import Admin from "../models/admin.schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Product from "../models/product.schema.js";

dotenv.config();

const secretToken = process.env.SECRET_KEY;

// CONTROLLER TO UPLOAD PRODUCTS
export const uploadProductsAdmin = async (req, res) => {
    try {
        let { title, description, price, category, imageUrl, stock } = req.body;

        // Validation
        if (!title || !description || !price || !category || !imageUrl) {
            return res.status(400).json({
                message: "Please provide all the details of the product",
                error: true,
                success: false,
            });
        }
        category = category.toLowerCase();
        // Create new product
        const product = new Product({
            title,
            description,
            price,
            category,
            imageUrl,
            stock,
        });

        await product.save();

        return res.status(201).json({
            message: "Product added successfully!",
            error: false,
            success: true,
            product,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return res.status(500).json({
            message: "Something went wrong while adding the product.",
            success: false,
            error: true,
        });
    }
};

// CONTROLLER TO GET (FETCH) ALL THE PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found.",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      message: "Products fetched successfully!",
      success: true,
      error: false,
      data: {
        count: products.length,
        products: products,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching products.",
      success: false,
      error: true,
    });
  }
};

// CONTROLLER TO EDIT PRODUCTS
export const editProductAdmin = async (req, res) => {
    try {
        let { productId, title, description, price, category, imageUrl, stock } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required for editing.",
                error: true,
                success: false,
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price !== undefined) updateData.price = price;
        if (category) {
            category = category.toLowerCase();
            updateData.category = category;
        }
        if (imageUrl) {
             updateData.imageUrl = Array.isArray(imageUrl) ? imageUrl : [imageUrl];
        }
        if (stock !== undefined) updateData.stock = stock; 

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true } 
        );
        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found.",
                error: true,
                success: false,
            });
        }
        return res.status(200).json({
            message: "Product updated successfully!",
            error: false,
            success: true,
            product: updatedProduct,
        });

    } catch (error) {
        console.error("Error editing product:", error);
        
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                message: messages.join(', '),
                error: true,
                success: false,
            });
        }

        return res.status(500).json({
            message: "Something went wrong while editing the product.",
            success: false,
            error: true,
        });
    }
};

// CONTROLLER TO DELETE PRODUCTS (Revised)
export const deleteProductAdmin = async (req, res) => {
    try {
        const productId = req.params.productId; 

        // 1. Validation
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required for deletion.",
                error: true,
                success: false,
            });
        }

        const result = await Product.findByIdAndDelete(productId);

        if (!result) {
            return res.status(404).json({
                message: "Product not found or already deleted.",
                error: true,
                success: false,
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully!",
            error: false,
            success: true,
            productId: productId, 
        });

    } catch (error) {
        console.error("Error deleting product:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting the product.",
            success: false,
            error: true,
        });
    }
};