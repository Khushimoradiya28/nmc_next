const express = require("express");
const router = express.Router();

const {
  addMaterial,
  getAllMaterial,
  updatedMaterial,
  deleteMaterial,
} = require("../Controller/materialController");

router.post("/add", addMaterial);
router.post("/list", getAllMaterial);
router.post("/update", updatedMaterial);
router.post("/delete", deleteMaterial);

module.exports = router;
