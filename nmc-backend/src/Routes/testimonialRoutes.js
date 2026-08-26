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
router.post("/list", getTestimonials);
router.get("/:idOrSlug", getTestimonialById);

// Admin / Write Operations
router.post("/", createTestimonial);
router.post("/add", createTestimonial);
router.put("/:idOrSlug", updateTestimonial);
router.post("/update", updateTestimonial);
router.delete("/:idOrSlug", deleteTestimonial);
router.post("/delete", deleteTestimonial);

module.exports = router;

