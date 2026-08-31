const express = require("express");
const router = express.Router();
const {
  submitAdmissionLead,
  getAdmissionLeads,
  getAdmissionLeadById,
  updateAdmissionLead,
  deleteAdmissionLead,
} = require("../Controller/admissionLeadController");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/permissionGuard");

// 🌐 Public Endpoints (Frontend Admission Application Form)
router.post("/", submitAdmissionLead);
router.post("/submit", submitAdmissionLead);
router.post("/add", submitAdmissionLead);

// 🔒 Protected Endpoints (Super Admin & Department Only - Blocked for Content Role)
router.get("/", verifyToken, requireRole(["super_admin", "admin", "department"]), getAdmissionLeads);
router.post("/list", verifyToken, requireRole(["super_admin", "admin", "department"]), getAdmissionLeads);
router.get("/:id", verifyToken, requireRole(["super_admin", "admin", "department"]), getAdmissionLeadById);
router.put("/:id", verifyToken, requireRole(["super_admin", "admin", "department"]), updateAdmissionLead);
router.put("/update", verifyToken, requireRole(["super_admin", "admin", "department"]), updateAdmissionLead);
router.post("/update", verifyToken, requireRole(["super_admin", "admin", "department"]), updateAdmissionLead);

// Super admin delete
router.delete("/:id", verifyToken, requireRole(["super_admin", "admin"]), deleteAdmissionLead);
router.post("/delete", verifyToken, requireRole(["super_admin", "admin"]), deleteAdmissionLead);

module.exports = router;
