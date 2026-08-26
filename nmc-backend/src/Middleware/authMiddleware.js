const jwt = require("jsonwebtoken");
const config = require("../Config/app");
const logger = require("../Utils/logger");

const SECRET_KEY = config.JWT_SECRET;

const User = require("../Model/user");

// Verifies JWT from Authorization header. Accepts either:
// - "Bearer <token>" or
// - the raw token string in the Authorization header
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({
      status: 403,
      message: "Access denied. No token provided.",
    });
  }

  // Support both "Bearer <token>" and raw token in the header
  let token;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7).trim();
  } else {
    token = authHeader.trim();
  }

  if (!token) {
    return res.status(403).json({
      status: 403,
      message: "Invalid token format.",
    });
  }

  // Helpful debug logs when not in production
  if (config.NODE_ENV !== "production") {
    if (!SECRET_KEY) logger.warn("[authMiddleware] JWT_SECRET is not set in environment");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Check if user has logged out since token issue
    const user = await User.findById(decoded.id).select("last_logout");
    if (user && user.last_logout) {
      // iat is in seconds, last_logout is Date (ms)
      const tokenTime = decoded.iat * 1000;
      if (tokenTime < user.last_logout.getTime()) {
           return res.status(403).json({
            status: 403,
            message: "Session expired. Please login again.",
          });
      }
    }

    req.user = decoded; 
    return next(); 
  } catch (error) {
    if (config.NODE_ENV !== "production") {
      logger.error("[authMiddleware] JWT verification error:", error && error.message ? error.message : error);
    }
    return res.status(403).json({
      status: 403,
      message: "Invalid or expired token.",
    });
  }
};
