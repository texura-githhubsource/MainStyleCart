import express from "express";
import { adminForgetPassword, adminLogin, adminRegister, getMessagesAdmin, sendMessageToAdmin, } from "../Controllers/auth.controller.js";
import { verifyAdminMiddleware } from "../middlewares/verifyAdmin.middleware.js";
import { deleteProductAdmin, editProductAdmin, getAllProducts, uploadProductsAdmin } from "../controllers/product.controller.js";

export const authRouter = express.Router();

authRouter.post("/login",adminLogin);
authRouter.post("/register",adminRegister);
authRouter.post("/forgetPassword",verifyAdminMiddleware, adminForgetPassword);
authRouter.post("/sendMessage", sendMessageToAdmin);
authRouter.get("/getMessages",verifyAdminMiddleware, getMessagesAdmin);
authRouter.post("/uploadProduct",verifyAdminMiddleware, uploadProductsAdmin);
authRouter.get("/getAllProducts",getAllProducts);
authRouter.put("/editProduct",verifyAdminMiddleware, editProductAdmin);
authRouter.delete("/deleteProduct/:productId", verifyAdminMiddleware, deleteProductAdmin);
authRouter.get("/verify", verifyAdminMiddleware, (req, res) => {
  res.status(200).json({ valid: true });
});
