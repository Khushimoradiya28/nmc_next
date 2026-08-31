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
router.get("/roles", getRoles);
router.get("/list", getAllUsers);
router.post("/list", getAllUsers);
router.get("/:id", getUserById);

router.post("/add", upload.single("profile_img"), addUser);
router.post("/", upload.single("profile_img"), addUser);

router.put("/update", upload.single("profile_img"), updateUser);
router.post("/update", upload.single("profile_img"), updateUser);
router.put("/:id", upload.single("profile_img"), updateUser);

router.delete("/:id", deleteUser);
router.post("/delete", deleteUser);

module.exports = router;
