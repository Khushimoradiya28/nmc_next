const express = require("express");
const router = express.Router();

const {
  addAge,
  getAllAge,
  updateAge,
  deleteAge,
} = require("../Controller/ageController");

router.post("/add", addAge);
router.post("/list", getAllAge);
router.post("/update", updateAge);
router.post("/delete", deleteAge);

module.exports = router;
