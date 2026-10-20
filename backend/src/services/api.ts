// src/backend/main/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: "Token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    authenticate(req, res, () => {
      if (req.user.role !== role) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
      next();
    });
  };
}

module.exports = { authenticate, requireRole };
