const express = require("express");
const router = express.Router();
const { getActivityLogs } = require("../Controller/activityLogController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/permissionGuard");

// Only super_admin / admin can view activity logs
router.get("/", verifyToken, requireRole(["super_admin", "admin"]), getActivityLogs);
router.post("/list", verifyToken, requireRole(["super_admin", "admin"]), getActivityLogs);

module.exports = router;
