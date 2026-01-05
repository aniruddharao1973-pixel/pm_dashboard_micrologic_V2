// routes/comments.js
import express from "express";
import { addComment, getComments } from "../controllers/commentsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ============================================================
   DOCUMENT DISCUSSION COMMENTS
   (Non-conflicting version)
============================================================ */

// Add comment to a document
router.post(
  "/document/:documentId",
  authMiddleware,
  addComment
);

// Get comments for a document
router.get(
  "/document/:documentId",
  authMiddleware,
  getComments
);

export default router;
