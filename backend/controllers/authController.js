// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { pool } from "../db.js";
import { sendPasswordResetEmail } from "../utils/mailService.js";

/* -----------------------------------------------------
   LOGIN
----------------------------------------------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.must_change_password,
        u.failed_login_attempts,
        u.password_reset_expires,
        uc.company_id
      FROM users u
      LEFT JOIN user_companies uc ON uc.user_id = u.id
      WHERE u.email = $1
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // Block login if reset token still valid (prevents reuse)
    if (
      user.password_reset_token &&
      user.password_reset_expires &&
      user.password_reset_expires > new Date()
    ) {
      return res.status(403).json({
        message: "Password reset pending. Please use the reset link.",
        resetSuggested: true,
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);

    /* --------------------------------------------------
       ❌ WRONG PASSWORD
    -------------------------------------------------- */
    if (!match) {
      const attempts = (user.failed_login_attempts || 0) + 1;

      await pool.query(
        `
        UPDATE users
        SET failed_login_attempts = $1,
            last_failed_login = NOW()
        WHERE id = $2
        `,
        [attempts, user.id]
      );

      // Attempt 1 → generic
      if (attempts < 2) {
        return res.status(400).json({
          message: "Invalid email or password",
        });
      }

      // Attempt 2 → reset suggested
      return res.status(400).json({
        message: "Too many failed attempts. Please reset your password.",
        resetSuggested: true,
      });
    }

    /* --------------------------------------------------
       ✅ PASSWORD MATCH → RESET FAILED ATTEMPTS
    -------------------------------------------------- */
    await pool.query(
      `
      UPDATE users
      SET failed_login_attempts = 0,
          last_failed_login = NULL
      WHERE id = $1
      `,
      [user.id]
    );

    /* --------------------------------------------------
       🔐 FIRST LOGIN → FORCE PASSWORD CHANGE
    -------------------------------------------------- */
    if (user.must_change_password) {
      return res.json({
        mustChangePassword: true,
        userId: user.id,
      });
    }

    /* --------------------------------------------------
       🎟 ISSUE JWT
    -------------------------------------------------- */
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      company_id: user.company_id ?? null,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        company_id: user.company_id ?? null,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------------------
   REQUEST PASSWORD RESET (AFTER 2 FAILURES)
   - Invalidates any previous reset token
   - Clears failed login attempts
----------------------------------------------------- */
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log("🔐 RESET REQUEST FOR:", email);
    console.log("🔑 GENERATED TOKEN:", token);
    console.log("⏰ EXPIRES AT:", expires.toISOString());

    const result = await pool.query(
      `
      UPDATE users
      SET password_reset_token   = $1,
          password_reset_expires = $2,
          failed_login_attempts  = 0,
          last_failed_login      = NULL
      WHERE email = $3
      RETURNING id, name, email
      `,
      [token, expires, email]
    );

    // Prevent email enumeration
    if (result.rowCount === 0) {
      return res.json({ message: "If account exists, email sent" });
    }

    const user = result.rows[0];

    // Fire-and-forget email
    setTimeout(async () => {
      try {
        await sendPasswordResetEmail({
          toEmail: user.email,
          name: user.name,
          resetLink: `${process.env.FRONTEND_URL}/reset-password/${token}`,
        });
      } catch (e) {
        console.error("Reset email failed:", e.message);
      }
    }, 0);

    return res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("RequestReset Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------------------
   CONFIRM PASSWORD RESET
----------------------------------------------------- */
export const confirmPasswordReset = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await pool.query(
      `
      SELECT id
      FROM users
      WHERE password_reset_token = $1
        AND password_reset_expires > NOW()
      LIMIT 1
      `,
      [token]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `
      UPDATE users
      SET password_hash = $1,
          password_reset_token = NULL,
          password_reset_expires = NULL,
          failed_login_attempts = 0,
          must_change_password = false
      WHERE id = $2
      `,
      [hash, result.rows[0].id]
    );

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("ConfirmReset Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------------------
   SET NEW PASSWORD (FIRST LOGIN)
----------------------------------------------------- */
export const setNewPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newHash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      `UPDATE users 
       SET password_hash = $1, must_change_password = false
       WHERE id = $2`,
      [newHash, userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("SetNewPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------------------
   NORMAL CHANGE PASSWORD (NOT FIRST LOGIN)
----------------------------------------------------- */
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(
      oldPassword,
      result.rows[0].password_hash
    );
    if (!match) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [
      newHash,
      userId,
    ]);

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("ChangePassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* -----------------------------------------------------
   SECURE REFRESH TOKEN (PROTECTED + SAFE)
   - preserves company_id from the old token
----------------------------------------------------- */
export const refreshToken = async (req, res) => {
  console.log("🔄 Refresh called by:", req.user?.role, req.user?.email);

  const oldToken = req.body.token;

  if (!oldToken) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    // Decode token without checking expiration
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    // SECURITY CHECK — ROLE AND USER MUST MATCH REQUEST USER
    if (decoded.role !== req.user.role || decoded.id !== req.user.id) {
      console.log("❌ Token role/user mismatch. Blocking refresh.");
      return res.status(401).json({ message: "Invalid refresh attempt" });
    }

    // Preserve company_id when issuing new token
    const newPayload = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      company_id: decoded.company_id ?? null,
    };

    const newToken = jwt.sign(newPayload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log("🔄 Token refreshed for:", decoded.email, decoded.role);

    return res.json({ token: newToken });
  } catch (err) {
    console.error("RefreshToken Error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

/// password link expires and then link should disappear

export const validateResetToken = async (req, res) => {
  const { token } = req.params;

  console.log("🔍 VALIDATE RESET TOKEN:", token);

  try {
    const result = await pool.query(
      `
      SELECT id, password_reset_expires
      FROM users
      WHERE password_reset_token = $1
      `,
      [token]
    );

    console.log("📄 DB RESULT:", result.rows);

    if (
      result.rowCount === 0 ||
      result.rows[0].password_reset_expires < new Date()
    ) {
      console.log("❌ TOKEN INVALID OR EXPIRED");
      return res.status(400).json({ valid: false });
    }

    console.log("✅ TOKEN VALID");
    return res.json({ valid: true });
  } catch (err) {
    console.error("ValidateResetToken Error:", err);
    res.status(500).json({ valid: false });
  }
};
