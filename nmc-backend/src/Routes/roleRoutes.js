const express = require("express");
const router = express.Router();

const {
  addRole,
  getAllRoles,
  updateRole,
  deleteRole,
} = require("../Controller/roleController");

router.post("/add", addRole);
router.post("/list", getAllRoles);
router.post("/update", updateRole);
router.post("/delete", deleteRole);

module.exports = router;
