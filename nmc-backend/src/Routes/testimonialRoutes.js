const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../Controller/testimonialController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for testimonial avatar/photo
const upload = getMulterUpload("testimonials");

const uploadPhoto = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "avatar", maxCount: 1 },
  { name: "avatarUrl", maxCount: 1 },
]);

const handlePhotoFile = (req, res, next) => {
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      req.file = req.files.photo[0];
    } else if (req.files.image && req.files.image[0]) {
      req.file = req.files.image[0];
    } else if (req.files.avatar && req.files.avatar[0]) {
      req.file = req.files.avatar[0];
    } else if (req.files.avatarUrl && req.files.avatarUrl[0]) {
      req.file = req.files.avatarUrl[0];
    }
  }
  next();
};

// Public / Listing
router.get("/", getTestimonials);
router.post("/list", getTestimonials);
router.get("/:idOrSlug", getTestimonialById);

const { verifyToken } = require("../Middleware/authMiddleware");

// Admin / Write Operations
router.post("/", verifyToken, uploadPhoto, handlePhotoFile, createTestimonial);
router.post("/add", verifyToken, uploadPhoto, handlePhotoFile, createTestimonial);
router.put("/:idOrSlug", verifyToken, uploadPhoto, handlePhotoFile, updateTestimonial);
router.post("/update", verifyToken, uploadPhoto, handlePhotoFile, updateTestimonial);
router.delete("/:idOrSlug", verifyToken, deleteTestimonial);
router.post("/delete", verifyToken, deleteTestimonial);

module.exports = router;
