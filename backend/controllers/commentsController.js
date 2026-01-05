


// controllers/commentsController.js
import { pool } from "../db.js";
import { io } from "../server.js";

/* ============================================================
   ADD COMMENT (Discussion comments)
   POST /api/documents/:documentId/comments
============================================================ */
export const addComment = async (req, res) => {
  const { documentId } = req.params;
  const { message } = req.body;
  const userId = req.user.id;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  try {
    // Insert comment
    const result = await pool.query(
      `
      INSERT INTO comments (document_id, user_id, message)
      VALUES ($1, $2, $3)
      RETURNING id, document_id, user_id, message, created_at
      `,
      [documentId, userId, message.trim()]
    );

    const comment = result.rows[0];

    // Get user name
    const userResult = await pool.query(
      `SELECT name FROM users WHERE id = $1`,
      [userId]
    );

    comment.user_name = userResult.rows[0].name;

    // Emit real-time comment event
    io.to(`document_${documentId}`).emit("new_comment", comment);

    res.json(comment);
  } catch (error) {
    console.error("addComment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============================================================
   GET COMMENTS (Discussion comments)
   GET /api/documents/:documentId/comments
============================================================ */
export const getComments = async (req, res) => {
  const { documentId } = req.params;

  try {
    const comments = await pool.query(
      `
      SELECT 
        c.id,
        c.document_id,
        c.user_id,
        c.message,
        c.created_at,
        u.name AS user_name
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.document_id = $1
      ORDER BY c.created_at ASC
      `,
      [documentId]
    );

    res.json(comments.rows);
  } catch (error) {
    console.error("getComments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
