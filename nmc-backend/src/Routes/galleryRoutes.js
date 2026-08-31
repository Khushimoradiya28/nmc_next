const express = require("express");
const router = express.Router();
const {
  getGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} = require("../Controller/galleryController");
const { getGalleryUpload } = require("../Utils/multerStorage");

// Multer upload config for gallery items (stored in src/media/gallery locally or S3 in production)
const upload = getGalleryUpload();

// Public / Listing Endpoints
router.get("/", getGalleries);
router.post("/list", getGalleries);
router.get("/:idOrSlug", getGalleryById);

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", upload.single("media_file"), createGallery);
router.post("/add", upload.single("media_file"), createGallery);
router.put("/update", upload.single("media_file"), updateGallery);
router.post("/update", upload.single("media_file"), updateGallery);
router.put("/:idOrSlug", upload.single("media_file"), updateGallery);
router.put("/", upload.single("media_file"), updateGallery);
router.delete("/:idOrSlug", deleteGallery);
router.delete("/", deleteGallery);
router.post("/delete", deleteGallery);

module.exports = router;
