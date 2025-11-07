import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    brand: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Unisex"] // optional but good for clarity
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        default: "",
        trim: true
    },
    images: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
