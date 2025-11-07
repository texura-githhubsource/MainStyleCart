import express from "express";
import { adminLogin, adminRegister } from "../Controllers/auth.controller.js";

export const authRouter = express.Router();

authRouter.post("/login", adminLogin);
authRouter.post("/register",adminRegister);