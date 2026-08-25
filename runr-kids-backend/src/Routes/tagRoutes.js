const express = require("express");
const router = express.Router();

const {
  addTag,
  getAllTag,
  deleteTag,
  updateTag,
} = require("../Controller/tagController");

router.post("/add", addTag);
router.post("/list", getAllTag);
router.post("/update", updateTag);
router.post("/delete", deleteTag);

module.exports = router;