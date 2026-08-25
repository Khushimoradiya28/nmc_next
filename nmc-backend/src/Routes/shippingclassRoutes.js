const express = require("express");
const router = express.Router();

const {
  addShippingClass,
  getAllShippingClass,
  deleteShippingClass,
} = require("../Controller/shippingclassController");

router.post("/add", addShippingClass);
router.post("/list", getAllShippingClass);
router.post("/delete", deleteShippingClass);

module.exports = router;
