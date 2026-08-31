const express = require("express");
const router = express.Router();
const {
  addUser,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  getRoles,
} = require("../Controller/userController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { verifyToken } = require("../Middleware/authMiddleware");
const { requireRole } = require("../Middleware/permissionGuard");

const upload = getMulterUpload("profile");

// 🔒 STRICT SUPER_ADMIN ONLY ACCESS FOR USER MANAGEMENT
router.get("/roles", verifyToken, getRoles);
router.get("/list", verifyToken, requireRole(["super_admin", "admin"]), getAllUsers);
router.post("/list", verifyToken, requireRole(["super_admin", "admin"]), getAllUsers);
router.get("/:id", verifyToken, requireRole(["super_admin", "admin"]), getUserById);

router.post("/add", verifyToken, requireRole(["super_admin", "admin"]), upload.single("profile_img"), addUser);
router.post("/", verifyToken, requireRole(["super_admin", "admin"]), upload.single("profile_img"), addUser);

router.put("/update", verifyToken, requireRole(["super_admin", "admin"]), upload.single("profile_img"), updateUser);
router.post("/update", verifyToken, requireRole(["super_admin", "admin"]), upload.single("profile_img"), updateUser);
router.put("/:id", verifyToken, requireRole(["super_admin", "admin"]), upload.single("profile_img"), updateUser);

router.delete("/:id", verifyToken, requireRole(["super_admin", "admin"]), deleteUser);
router.post("/delete", verifyToken, requireRole(["super_admin", "admin"]), deleteUser);

module.exports = router;
