

// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Read header OR cookie
    const authHeader = req.headers.authorization || req.headers.Authorization;
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    console.log("✔ Token OK →", decoded);

    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

/* -------------------------------------------------------
   ✅ NEW: Allow Admin OR Tech Sales
------------------------------------------------------- */
export const requireAdminOrTechSales = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (req.user.role === "admin" || req.user.role === "techsales") {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};
