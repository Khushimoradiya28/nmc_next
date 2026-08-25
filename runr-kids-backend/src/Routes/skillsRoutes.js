const express = require("express");
const router = express.Router();

const {
  addSkill,
  getAllSkill,
  updateSkill,
  deleteSkill,
} = require("../Controller/skillsController");

router.post("/add", addSkill);
router.post("/list", getAllSkill);
router.post("/update", updateSkill);
router.post("/delete", deleteSkill);

module.exports = router;
