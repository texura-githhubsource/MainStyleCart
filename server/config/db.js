import mongoose from "mongoose";


const connectDb = async () => {
    try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri); 
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

export default connectDb;
