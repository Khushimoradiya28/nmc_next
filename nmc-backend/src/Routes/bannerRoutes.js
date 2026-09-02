const express = require("express");
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../Controller/bannerController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for banners image (stores in src/media/banners locally)
const upload = getMulterUpload("banners");

// Public / Listing Endpoints
router.get("/", getBanners);
router.post("/list", getBanners);
router.get("/:id", getBannerById);

const { verifyToken } = require("../Middleware/authMiddleware");

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", verifyToken, upload.single("image"), createBanner);
router.post("/add", verifyToken, upload.single("image"), createBanner);
router.put("/update", verifyToken, upload.single("image"), updateBanner);
router.post("/update", verifyToken, upload.single("image"), updateBanner);
router.put("/:id", verifyToken, upload.single("image"), updateBanner);
router.put("/", verifyToken, upload.single("image"), updateBanner);
router.delete("/:id", verifyToken, deleteBanner);
router.delete("/", verifyToken, deleteBanner);
router.post("/delete", verifyToken, deleteBanner);

module.exports = router;
