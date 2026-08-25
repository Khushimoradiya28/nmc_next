const express = require("express");
const router = express.Router();

const {
  addCoupon,
  getAllCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon
} = require("../Controller/couponController");

router.post("/add", addCoupon);
router.post("/list", getAllCoupon);
router.post("/update", updateCoupon);
router.post("/delete", deleteCoupon);
router.post("/validate", validateCoupon);

module.exports = router;
