const express = require("express");
const router = express.Router();
const {
  getFacultyMembers,
  getFacultyByIdOrSlug,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} = require("../Controller/facultyController");
const { getMulterUpload } = require("../Utils/multerStorage");

// Multer upload config for faculty photo (stores in src/media/faculty/ locally)
const upload = getMulterUpload("faculty");

// Public / Listing Endpoints
router.get("/", getFacultyMembers);
router.post("/list", getFacultyMembers);
router.get("/:idOrSlug", getFacultyByIdOrSlug);

// Write Operations (Supports Multipart File Upload & JSON)
// Accepts photo/image file field name
const uploadPhoto = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

// Custom middleware to set req.file from fields
const handlePhotoFile = (req, res, next) => {
  if (req.files) {
    if (req.files.photo && req.files.photo[0]) {
      req.file = req.files.photo[0];
    } else if (req.files.image && req.files.image[0]) {
      req.file = req.files.image[0];
    }
  }
  next();
};

const { verifyToken } = require("../Middleware/authMiddleware");

router.post("/", verifyToken, uploadPhoto, handlePhotoFile, createFaculty);
router.post("/add", verifyToken, uploadPhoto, handlePhotoFile, createFaculty);
router.put("/:idOrSlug", verifyToken, uploadPhoto, handlePhotoFile, updateFaculty);
router.post("/update", verifyToken, uploadPhoto, handlePhotoFile, updateFaculty);
router.delete("/:idOrSlug", verifyToken, deleteFaculty);
router.post("/delete", verifyToken, deleteFaculty);

module.exports = router;
