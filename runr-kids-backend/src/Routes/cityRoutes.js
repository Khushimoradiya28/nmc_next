const express = require("express");
const router = express.Router();

const {
  addCity,
  getAllCities,
  updateCity,
  deleteCity,
} = require("../Controller/cityController");

router.post("/add", addCity);
router.post("/list", getAllCities);
router.post("/update", updateCity);
router.post("/delete", deleteCity);

module.exports = router;
