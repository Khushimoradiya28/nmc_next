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

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", upload.single("image"), createBanner);
router.post("/add", upload.single("image"), createBanner);
router.put("/update", upload.single("image"), updateBanner);
router.post("/update", upload.single("image"), updateBanner);
router.put("/:id", upload.single("image"), updateBanner);
router.put("/", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);
router.delete("/", deleteBanner);
router.post("/delete", deleteBanner);

module.exports = router;
