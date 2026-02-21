const jwt = require("jsonwebtoken");

/**
 * FIX: This file was completely empty - NO routes were protected.
 * This middleware verifies JWT tokens and attaches user info to req.user.
 */
const verifyToken = (req, res, next) => {
  try {
    // Extract token from Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId: "..." }
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

/**
 * Role-based access control middleware.
 * Usage: verifyRole("doctor", "superadmin")
 */
const verifyRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // verifyToken must run first to populate req.user
      if (!req.user || !req.user.userId) {
        return res.status(401).json({ message: "Authentication required." });
      }

      const User = require("../models/user.model");
      const user = await User.findById(req.user.userId).select("role");

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden. Insufficient permissions." });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      console.error("Role verification failed:", error.message);
      return res.status(500).json({ message: "Authorization error." });
    }
  };
};

module.exports = { verifyToken, verifyRole };
