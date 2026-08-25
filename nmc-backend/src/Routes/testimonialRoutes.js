const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../Controller/testimonialController");

// Public / Listing
router.get("/", getTestimonials);
router.get("/:id", getTestimonialById);

// Admin / Write Operations
router.post("/", createTestimonial);
router.put("/:id", updateTestimonial);
router.delete("/:id", deleteTestimonial);

module.exports = router;
