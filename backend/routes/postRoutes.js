import express from "express";
import {
  createPost,
  getPost,
  deletePost,
  likeUnlikePost,
  replyPost,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// API Endpoints
router.post("/create", protectRoute, createPost);
router.get("/:id", getPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyPost);

export default router;
