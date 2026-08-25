const express = require("express");
const router = express.Router();
const { addGalleryImages, getAllGalleryImages, deleteGalleryImages } = require("../Controller/productGalleryController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("product_gallery");

// ✅ Route: Add multiple gallery images
router.post("/add", upload.array("product_gallery_url", 10), validateInput, addGalleryImages);
router.post("/list", getAllGalleryImages);
router.post("/delete", deleteGalleryImages);

module.exports = router;
