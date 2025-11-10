import express from "express";
import { adminForgetPassword, adminLogin, adminRegister, sendMessageToAdmin } from "../Controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/login", adminLogin);
authRouter.post("/register",adminRegister);
authRouter.post("/forgetPassword",adminForgetPassword);
authRouter.post("/sendMessage", sendMessageToAdmin);