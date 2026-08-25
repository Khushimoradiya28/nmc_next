const express = require("express");
const router = express.Router();
const { addAddressType, getAllAddressType, updateAddressType, deleteAddressType } = require("../Controller/addressTypeController");

// ✅ Routes
router.post("/add", addAddressType);
router.post("/list", getAllAddressType);
router.post("/update", updateAddressType);
router.post("/delete", deleteAddressType);

module.exports = router;