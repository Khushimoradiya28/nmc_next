const express = require("express");
const router = express.Router();
const {
  submitContactLead,
  getContactLeads,
  getContactLeadById,
  updateContactLead,
  deleteContactLead,
} = require("../Controller/contactLeadController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/permissionGuard");

// 🌐 Public Endpoints (Frontend Contact Page & Modal)
router.post("/", submitContactLead);
router.post("/submit", submitContactLead);
router.post("/add", submitContactLead);

// 🔒 Protected Endpoints (Super Admin & Department only - Blocked for Content Role)
router.get("/", verifyToken, requireRole(["super_admin", "admin", "department"]), getContactLeads);
router.post("/list", verifyToken, requireRole(["super_admin", "admin", "department"]), getContactLeads);
router.get("/:id", verifyToken, requireRole(["super_admin", "admin", "department"]), getContactLeadById);
router.put("/:id", verifyToken, requireRole(["super_admin", "admin", "department"]), updateContactLead);
router.put("/update", verifyToken, requireRole(["super_admin", "admin", "department"]), updateContactLead);
router.post("/update", verifyToken, requireRole(["super_admin", "admin", "department"]), updateContactLead);

// Super admin delete
router.delete("/:id", verifyToken, requireRole(["super_admin", "admin"]), deleteContactLead);
router.post("/delete", verifyToken, requireRole(["super_admin", "admin"]), deleteContactLead);

module.exports = router;
