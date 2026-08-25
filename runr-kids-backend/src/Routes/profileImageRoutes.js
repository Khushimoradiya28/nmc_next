const express = require("express");
const router = express.Router();
const { addProfileImage, getAllProfileImages, deleteProfileImage } = require("../Controller/profileImageController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("profile_image_cartoon");

// Routes
router.post("/add", upload.single("image_url"), validateInput, addProfileImage);
router.post("/list", getAllProfileImages);
router.post("/delete", deleteProfileImage);

module.exports = router;
