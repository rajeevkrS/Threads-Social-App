import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  getCoversation,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getCoversation);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessage);

export default router;
