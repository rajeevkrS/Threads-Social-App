import express from "express";
import { getPost, createPost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// API Endpoints
router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);

export default router;
