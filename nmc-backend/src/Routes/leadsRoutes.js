const express = require("express");
const router = express.Router();
const { addLead, getAllLeads } = require("../Controller/leadsController");

router.post("/addlead", addLead);
router.post("/list", getAllLeads);

module.exports = router;