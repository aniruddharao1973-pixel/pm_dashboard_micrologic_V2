// backend/routes/aiChat.js
import express from "express";
import {
  authMiddleware,
  requireAdminOrTechSales,
} from "../middleware/authMiddleware.js";
import { sendMessage } from "../controllers/aiChatController.js";

const router = express.Router();

/**
 * AI Chat endpoint
 * Admin / TechSales only
 */
router.post("/chat", authMiddleware, requireAdminOrTechSales, sendMessage);

export default router;
