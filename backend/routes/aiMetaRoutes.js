// backend/routes/aiMetaRoutes.js
import express from "express";
import { pool } from "../db.js";
import {
  authMiddleware,
  requireAdminOrTechSales,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * AI Meta – Companies (for suggestions)
 * GET /api/ai/meta/companies
 */
router.get(
  "/companies",
  authMiddleware,
  requireAdminOrTechSales,
  async (req, res) => {
    console.log("🟢 AI META companies hit by:", req.user?.email);

    try {
      const { rows } = await pool.query(`
        SELECT name
        FROM companies
        ORDER BY created_at DESC
        LIMIT 5
      `);

      // return array of strings
      res.json(rows.map((r) => r.name));
    } catch (err) {
      console.error("AI META companies error:", err);
      res.status(500).json({ message: "Failed to load companies" });
    }
  },
);

export default router;
