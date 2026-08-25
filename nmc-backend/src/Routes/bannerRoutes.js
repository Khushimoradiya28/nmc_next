// require("dotenv").config();  
const express = require("express");
const router = express.Router();
const { addBanner, getAllBanners, updateBanner, deleteBanner } = require("../Controller/bannerController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("banner");

// ✅ Routes
router.post("/add", upload.single("banner_img"), validateInput, addBanner);
router.post("/list", getAllBanners);
router.post("/update", upload.single("banner_img"), validateInput, updateBanner);
router.post("/delete", deleteBanner);

module.exports = router;
