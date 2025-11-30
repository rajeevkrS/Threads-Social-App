import path from "path";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./socket/socket.js";
// import job from "./cron/cron.js";
import dotenv from "dotenv";
dotenv.config();

//db
connectDB();

//cron
// job.start();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MIDDLEWARES:
//To parse JSON data in the req.body- any data upto 50mb
app.use(express.json({ limit: "50mb" }));
// To parse form data in the req.body
app.use(express.urlencoded({ extended: true }));
// To get the cookie from the req and set the cookie inside res .
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);

// app.get("/", (req, res) => {
//   res.send("API Working");
// });

// Merge- http://localhost:5000 => backend + frontend
// Serve static assets only if in production
if (process.env.NODE_ENV == "production") {
  // static folder for frontend
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  // handle SPA routing, return index.html for all requests to frontend
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
