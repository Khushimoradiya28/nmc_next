const express = require("express");
const router = express.Router();
const { addBlog, getAllBlogs, updateBlog, deleteBlog } = require("../Controller/blogController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("blog");

// Routes
router.post("/add", upload.single("blog_image"), validateInput, addBlog);
router.post("/list", getAllBlogs);
router.post("/update", upload.single("blog_image"), validateInput, updateBlog);
router.post("/delete", deleteBlog);

module.exports = router;
