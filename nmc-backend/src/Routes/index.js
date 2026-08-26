const express = require("express");
const authRoutes = require("./authRoutes");
const router = express.Router();

router.use("/auth", authRoutes);

const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const mediaRoutes = require("./mediaRoutes");
const testimonialRoutes = require("./testimonialRoutes");
const certificateCourseRoutes = require("./certificateCourseRoutes");

// All routes grouped under /api
router.use("/user", userRoutes);
router.use("/role", roleRoutes);
router.use("/media", mediaRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/testimonial", testimonialRoutes);
router.use("/certificate-courses", certificateCourseRoutes);
router.use("/certificate-course", certificateCourseRoutes);

module.exports = router;
