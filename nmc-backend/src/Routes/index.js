const express = require('express');
const router = express.Router();

const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const mediaRoutes = require("./mediaRoutes");
const testimonialRoutes = require("./testimonialRoutes");
const certificateCourseRoutes = require("./certificateCourseRoutes");
const awardRoutes = require("./awardRoutes");
const academicProgramRoutes = require("./academicProgramRoutes");
const facultyRoutes = require("./facultyRoutes");
const bannerRoutes = require("./bannerRoutes");
const galleryRoutes = require("./galleryRoutes");
const activityLogRoutes = require("./activityLogRoutes");
const contactLeadRoutes = require("./contactLeadRoutes");
const admissionLeadRoutes = require("./admissionLeadRoutes");
const courseRoutes = require("./courseRoutes");

// All routes grouped under /api
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/users", userRoutes);
router.use("/role", roleRoutes);
router.use("/media", mediaRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/testimonial", testimonialRoutes);
router.use("/certificate-courses", certificateCourseRoutes);
router.use("/certificate-course", certificateCourseRoutes);
router.use("/awards", awardRoutes);
router.use("/award", awardRoutes);
router.use("/academic-programs", academicProgramRoutes);
router.use("/academic-program", academicProgramRoutes);
router.use("/banners", bannerRoutes);
router.use("/banner", bannerRoutes);
router.use("/gallery", galleryRoutes);
router.use("/galleries", galleryRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/activity-log", activityLogRoutes);
router.use("/contact", contactLeadRoutes);
router.use("/contact-us", contactLeadRoutes);
router.use("/leads", contactLeadRoutes);
router.use("/lead", contactLeadRoutes);
router.use("/admission", admissionLeadRoutes);
router.use("/admissions", admissionLeadRoutes);
router.use("/admission-lead", admissionLeadRoutes);
router.use("/admission-leads", admissionLeadRoutes);
router.use("/courses", courseRoutes);
router.use("/course", courseRoutes);

// Faculty & Master Faculty Routes
router.use("/faculty", facultyRoutes);
router.use("/faculties", facultyRoutes);
router.use("/master/faculty", facultyRoutes);

module.exports = router;

