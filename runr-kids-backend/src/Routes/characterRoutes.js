const express = require("express");
const router = express.Router();
const { addCharacter, getAllCharacters, updateCharacter, deleteCharacter } = require("../Controller/characterController");
const { getMulterUpload } = require("../Utils/multerStorage");
const { validateInput } = require("../Middleware/inputValidator");

const upload = getMulterUpload("character");

// ✅ Routes
router.post("/add", upload.single("character_image"), validateInput, addCharacter);
router.post("/list", getAllCharacters);
router.post("/update", upload.single("character_image"), validateInput, updateCharacter);
router.post("/delete", deleteCharacter);

module.exports = router;