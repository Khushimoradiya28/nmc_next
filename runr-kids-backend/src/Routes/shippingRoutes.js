const express = require("express");
const router = express.Router();

const {
  addShipping,
  getAllShipping,
  deleteShipping,
} = require("../Controller/shippingController");

router.post("/add", addShipping);
router.post("/list", getAllShipping);
router.post("/delete", deleteShipping);

module.exports = router;
