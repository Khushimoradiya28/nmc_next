const express = require("express");
const router = express.Router();
const { addTicket, getAllTickets, updateTicket, deleteTicket } = require("../Controller/supportTicketController");

router.post("/add", addTicket);
router.post("/list", getAllTickets);
router.post("/update", updateTicket);
router.post("/delete", deleteTicket);

module.exports = router;
