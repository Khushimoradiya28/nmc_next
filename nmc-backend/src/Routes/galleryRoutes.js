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

// Multer upload config for gallery items (accepts media_file, file, media, or image)
const upload = getGalleryUpload().fields([
  { name: "media_file", maxCount: 1 },
  { name: "file", maxCount: 1 },
  { name: "media", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Normalization middleware so req.file is populated regardless of field name
const normalizeUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return next(err);
    if (req.files) {
      req.file =
        (req.files.media_file && req.files.media_file[0]) ||
        (req.files.file && req.files.file[0]) ||
        (req.files.media && req.files.media[0]) ||
        (req.files.image && req.files.image[0]) ||
        null;
    }
    next();
  });
};

// Public / Listing Endpoints
router.get("/", getGalleries);
router.post("/list", getGalleries);
router.get("/:idOrSlug", getGalleryById);

const { verifyToken } = require("../Middleware/authMiddleware");

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", verifyToken, normalizeUpload, createGallery);
router.post("/add", verifyToken, normalizeUpload, createGallery);
router.put("/update", verifyToken, normalizeUpload, updateGallery);
router.post("/update", verifyToken, normalizeUpload, updateGallery);
router.put("/:idOrSlug", verifyToken, normalizeUpload, updateGallery);
router.put("/", verifyToken, normalizeUpload, updateGallery);
router.delete("/:idOrSlug", verifyToken, deleteGallery);
router.delete("/", verifyToken, deleteGallery);
router.post("/delete", verifyToken, deleteGallery);

module.exports = router;
