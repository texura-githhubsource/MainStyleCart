import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    default: "General"
  },
  images: [
    {
      type: String 
    }
  ],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema);

export default Product;
