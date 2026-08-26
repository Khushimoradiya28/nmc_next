const express = require("express");
const router = express.Router();
const { fileUpload } = require("../Utils/fileupload");
const {
  getCertificateCourses,
  getCertificateCourseById,
  createCertificateCourse,
  updateCertificateCourse,
  deleteCertificateCourse,
} = require("../Controller/certificateCourseController");

const upload = fileUpload("certificate_courses")("image");

// Public / Listing
router.get("/", getCertificateCourses);
router.post("/list", getCertificateCourses);
router.get("/:idOrSlug", getCertificateCourseById);

// Admin / Write Operations (with image upload support)
router.post("/", upload, createCertificateCourse);
router.post("/add", upload, createCertificateCourse);
router.put("/:idOrSlug", upload, updateCertificateCourse);
router.post("/update", upload, updateCertificateCourse);
router.delete("/:idOrSlug", deleteCertificateCourse);
router.post("/delete", deleteCertificateCourse);

module.exports = router;
