const express = require("express");
const router = express.Router();
const { addBrand, getAllBrands, updateBrand, deleteBrand } = require("../Controller/brandsController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("brand");

// ✅ Routes
router.post("/add", upload.single("brand_logo"), validateInput, addBrand);
router.post("/list", getAllBrands);
router.post("/update", upload.single("brand_logo"), validateInput, updateBrand);
router.post("/delete", deleteBrand);

module.exports = router;