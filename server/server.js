import express from "express";
import dotenv from "dotenv"
import connectDb from "./config/db.js";
dotenv.config()
const port = process.env.PORT || 5051;
const app = express();

app.get("/", (req, res)=>{
    console.log("hey i am home page");
    res.send("hey i am home page");
})


app.listen(port, ()=>{
    console.log(`Server is running at port nummber ${port}`)
    connectDb();
})