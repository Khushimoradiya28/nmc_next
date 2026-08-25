// require("dotenv").config();  
const express = require("express");
const router = express.Router();
const { addUser, updateUser, getAllUsers, deleteUser, getAllCustomerOrder } = require("../Controller/userController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("profile");

// ✅ Routes
router.post("/add", upload.single("profile_img"), validateInput, addUser);
router.post("/update", upload.single("profile_img"), validateInput, updateUser);
router.post("/list", getAllUsers);
router.post("/delete", upload.single("profile_img"), validateInput, deleteUser);
router.post("/customer-order-list", getAllCustomerOrder);

module.exports = router;
