const express = require("express");
const router = express.Router();
const { getMulterUpload } = require("../Utils/multerStorage");
const {
  getCertificateCourses,
  getCertificateCourseById,
  createCertificateCourse,
  updateCertificateCourse,
  deleteCertificateCourse,
} = require("../Controller/certificateCourseController");

const upload = getMulterUpload("certificate_courses");

const cpUpload = (req, res, next) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imageUrl", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ])(req, res, (err) => {
    if (err) return next(err);
    // Set req.file if uploaded through any of the field names
    if (req.files) {
      if (req.files.image && req.files.image[0]) req.file = req.files.image[0];
      else if (req.files.imageUrl && req.files.imageUrl[0]) req.file = req.files.imageUrl[0];
      else if (req.files.file && req.files.file[0]) req.file = req.files.file[0];
    }
    next();
  });
};

// Public / Listing
router.get("/", getCertificateCourses);
router.post("/list", getCertificateCourses);
router.get("/:idOrSlug", getCertificateCourseById);

const { verifyToken } = require("../Middleware/authMiddleware");

// Admin / Write Operations (with flexible image field upload support)
router.post("/", verifyToken, cpUpload, createCertificateCourse);
router.post("/add", verifyToken, cpUpload, createCertificateCourse);
router.put("/:idOrSlug", verifyToken, cpUpload, updateCertificateCourse);
router.post("/update", verifyToken, cpUpload, updateCertificateCourse);
router.delete("/:idOrSlug", verifyToken, deleteCertificateCourse);
router.post("/delete", verifyToken, deleteCertificateCourse);


module.exports = router;

