const express = require("express");
const router = express.Router();
const { addCategory, getAllCategories, updateCategory, deleteCategory } = require("../Controller/categoryController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("category");

// ✅ Routes
router.post("/add", upload.single("category_image"), validateInput, addCategory);
router.post("/list", getAllCategories);
router.post("/update", upload.single("category_image"), validateInput, updateCategory);
router.post("/delete", deleteCategory);

module.exports = router;