const express = require("express");
const router = express.Router();
const {
  getAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward,
} = require("../Controller/awardController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for awards image (stores in src/media/awards locally)
const upload = getMulterUpload("awards");

// Public / Listing Endpoints
router.get("/", getAwards);
router.post("/list", getAwards);
router.get("/:idOrSlug", getAwardById);

const { verifyToken } = require("../Middleware/authMiddleware");

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", verifyToken, upload.single("image"), createAward);
router.post("/add", verifyToken, upload.single("image"), createAward);
router.put("/:idOrSlug", verifyToken, upload.single("image"), updateAward);
router.post("/update", verifyToken, upload.single("image"), updateAward);
router.delete("/:idOrSlug", verifyToken, deleteAward);
router.post("/delete", verifyToken, deleteAward);

module.exports = router;
