const express = require("express");
const router = express.Router();

const {
  addShippingMethod,
  getAllShippingMethod,
  deleteShippingMethod,
} = require("../Controller/shippingmethodController");

router.post("/add", addShippingMethod);
router.post("/list", getAllShippingMethod);
router.post("/delete", deleteShippingMethod);

module.exports = router;
