const express = require("express");
const router = express.Router();
const AcademicProgram = require("../Model/academicProgram");
const CertificateCourse = require("../Model/certificateCourse");

/**
 * @desc    Get all active courses combined (Academic Programs + Professional Certificate Courses)
 *          Specially structured for Frontend Dropdowns & Enquiry / Admission / Contact Modals
 * @route   GET /api/courses/dropdown or GET /api/courses
 */
router.get("/dropdown", async (req, res, next) => {
  try {
    const [academicPrograms, certificateCourses] = await Promise.all([
      AcademicProgram.find({ is_deleted: false, status: "active" })
        .select("shortTitle fullName degreeBadge programType fees sort_order slug guid")
        .sort({ sort_order: 1, created_at: -1 }),

      CertificateCourse.find({ is_deleted: false, status: "active" })
        .select("title category badge duration fees sortOrder slug guid")
        .sort({ sortOrder: 1, created_at: -1 }),
    ]);

    // Format Academic Programs (Clean course name only, without fee in parentheses)
    const formattedAcademic = academicPrograms.map((prog) => {
      const courseName = prog.shortTitle || prog.fullName;
      return {
        id: prog._id,
        guid: prog.guid,
        slug: prog.slug,
        title: courseName,
        full_title: prog.fullName,
        display_label: courseName,
        course_type: "academic_program",
        group: prog.programType ? prog.programType.toUpperCase() + " Degree / Program" : "Academic Programs",
        category: prog.programType,
        fees: prog.fees || "",
      };
    });

    // Format Professional Certificate Courses (Clean course name only)
    const formattedCertificate = certificateCourses.map((cert) => {
      return {
        id: cert._id,
        guid: cert.guid,
        slug: cert.slug,
        title: cert.title,
        full_title: cert.title,
        display_label: cert.title,
        course_type: "certificate_course",
        group: "Professional Certificate Courses",
        category: cert.category || "Certificate",
        duration: cert.duration || "",
        fees: cert.fees || "",
      };
    });

    // Combined flat list ready for select dropdowns
    const combinedCourses = [...formattedAcademic, ...formattedCertificate];

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Courses dropdown list fetched successfully.",
      total: combinedCourses.length,
      data: combinedCourses,
      grouped: {
        academic_programs: formattedAcademic,
        certificate_courses: formattedCertificate,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Alias for GET /api/courses
router.get("/", (req, res, next) => {
  req.url = "/dropdown";
  router.handle(req, res, next);
});

module.exports = router;
