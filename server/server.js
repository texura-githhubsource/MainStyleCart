import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";

import morgan from "morgan";

dotenv.config();
const port = process.env.PORT || 5050;
const app = express();



app.use(morgan("dev"));

// JSON parsing middleware
app.use(express.json());

// CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.send(`Running backend on port: ${port}`);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at port number ${port}`);
  connectDb();
});
