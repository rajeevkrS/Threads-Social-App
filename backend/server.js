import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

//db
connectDB();

const app = express();
const PORT = 5000;

// Middlewares:
//To parse JSON data in the req.body
app.use(express.json());
// To parse form data in the req.body
app.use(express.urlencoded({ extended: true }));
// To get the cookie from the req and set the cookie inside res .
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
