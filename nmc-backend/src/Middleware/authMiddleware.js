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
    
    // Check if user exists, is active (status == '1') and not blocked
    const user = await User.findById(decoded.id)
      .select("status is_deleted last_logout role")
      .populate("role", "role_name status");

    if (!user || user.is_deleted) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: "User account no longer exists.",
      });
    }

    // Block inactive users from making API calls
    if (String(user.status) !== "1") {
      return res.status(403).json({
        status: 403,
        success: false,
        message: "Your account is deactivated. Please contact Super Admin.",
      });
    }

    if (user.last_logout) {
      const tokenTime = decoded.iat * 1000;
      if (tokenTime < user.last_logout.getTime()) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: "Session expired. Please login again.",
        });
      }
    }

    // Attach fresh user details and real role name to req.user
    const roleName = user.role && typeof user.role === "object" ? user.role.role_name : decoded.role_name || "staff";
    req.user = {
      ...decoded,
      id: user._id.toString(),
      role: user.role?._id || user.role,
      role_name: roleName,
      status: user.status,
    };
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
