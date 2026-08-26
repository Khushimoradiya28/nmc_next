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

// Admin / Write Operations (Supports Multipart File Upload & JSON)
router.post("/", upload.single("image"), createAward);
router.post("/add", upload.single("image"), createAward);
router.put("/:idOrSlug", upload.single("image"), updateAward);
router.post("/update", upload.single("image"), updateAward);
router.delete("/:idOrSlug", deleteAward);
router.post("/delete", deleteAward);

module.exports = router;
