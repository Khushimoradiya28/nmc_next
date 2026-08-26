const CertificateCourse = require("../Model/certificateCourse");
const moment = require("moment-timezone");
const { generateSlug } = require("../helper");

/**
 * Format certificate course record for client response with Asia/Kolkata timezone
 */
const formatCourse = (item) => {
  const doc = item._doc || item;
  return {
    ...doc,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Get certificate courses (filtered by category, slug, search, isActive)
// @route   GET /api/certificate-courses
// @route   POST /api/certificate-courses/list
exports.getCertificateCourses = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const { category, isActive, search, slug, limit, offset, sort_by, sort_order } = queryParams || {};

    const filter = {};

    if (category && category.trim()) {
      filter.category = { $regex: category.trim(), $options: "i" };
    }

    if (slug) {
      filter.slug = slug.toLowerCase().trim();
    }

    if (typeof isActive !== "undefined" && isActive !== null && isActive !== "") {
      filter.isActive = isActive === "true" || isActive === true || isActive === 1 || isActive === "1";
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { badge: searchRegex },
        { slug: searchRegex },
      ];
    }

    const sortField = sort_by || "sortOrder";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    let courseQuery = CertificateCourse.find(filter)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email")
      .sort({ [sortField]: sortDirection, created_at: -1 })
      .skip(pageOffset);

    if (pageLimit > 0) {
      courseQuery = courseQuery.limit(pageLimit);
    }

    const courses = await courseQuery;
    const totalCount = await CertificateCourse.countDocuments(filter);

    return res.status(200).json({
      status: 200,
      success: true,
      count: totalCount,
      data: courses.map(formatCourse),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate course by ID or Slug
// @route   GET /api/certificate-courses/:idOrSlug
exports.getCertificateCourseById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Certificate Course ID or slug is required."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const course = await CertificateCourse.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Certificate Course not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: formatCourse(course),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new certificate course
// @route   POST /api/certificate-courses
exports.createCertificateCourse = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = {};

    // Title validation
    const title = body.title || body.course_title || body.courseName || "";
    if (!title || !title.toString().trim()) {
      errors.title = ["Course title is mandatory."];
    }

    // Category validation
    const category = body.category || body.course_category || "";
    if (!category || !category.toString().trim()) {
      errors.category = ["Category is mandatory."];
    }

    // Description validation
    const description = body.description || body.course_description || "";
    if (!description || !description.toString().trim()) {
      errors.description = ["Course description is mandatory."];
    }

    // Duration validation
    const duration = body.duration || body.course_duration || "";
    if (!duration || !duration.toString().trim()) {
      errors.duration = ["Duration is mandatory."];
    }

    // Fees validation
    const fees = body.fees || body.course_fees || "";
    if (!fees || !fees.toString().trim()) {
      errors.fees = ["Fees is mandatory."];
    }

    // Return all validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please fill all mandatory fields properly.",
        error: errors,
      });
    }

    // Optional fields
    const badge = body.badge || body.course_badge || "";
    const highlights = body.highlights || body.course_highlights || [];
    const imageUrl = req.file ? req.file.filename : (body.imageUrl || body.image_url || body.image || "");
    const enrollUrl = body.enrollUrl || body.enroll_url || body.enroll_link || "";

    // Determine created_by
    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newCourse = new CertificateCourse({
      title: title.toString().trim(),
      category: category.toString().trim(),
      badge: badge ? badge.toString().trim() : "",
      description: description.toString().trim(),
      highlights: Array.isArray(highlights) ? highlights.map((h) => h.toString().trim()) : [],
      duration: duration.toString().trim(),
      fees: fees.toString().trim(),
      imageUrl: imageUrl ? imageUrl.toString().trim() : "",
      enrollUrl: enrollUrl ? enrollUrl.toString().trim() : "",
      isActive: typeof body.isActive !== "undefined" ? (body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1") : true,
      sortOrder: typeof body.sortOrder !== "undefined" ? Number(body.sortOrder) : 0,
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newCourse.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Certificate Course created successfully",
      data: formatCourse(newCourse),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing certificate course by ID or Slug
// @route   PUT /api/certificate-courses/:idOrSlug
exports.updateCertificateCourse = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || req.body.id || req.body.slug;
    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Certificate Course ID or slug is required for updating."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const existingCourse = await CertificateCourse.findOne(query);
    if (!existingCourse) {
      return res.status(404).json({
        status: 404,
        message: "Certificate Course not found",
      });
    }

    const body = req.body || {};
    const errors = {};

    // Title
    if (body.title !== undefined || body.course_title !== undefined || body.courseName !== undefined) {
      const title = body.title || body.course_title || body.courseName;
      if (!title || !title.toString().trim()) {
        errors.title = ["Course title cannot be blank."];
      } else {
        existingCourse.title = title.toString().trim();
      }
    }

    // Category
    if (body.category !== undefined || body.course_category !== undefined) {
      const category = body.category || body.course_category;
      if (!category || !category.toString().trim()) {
        errors.category = ["Category cannot be blank."];
      } else {
        existingCourse.category = category.toString().trim();
      }
    }

    // Description
    if (body.description !== undefined || body.course_description !== undefined) {
      const description = body.description || body.course_description;
      if (!description || !description.toString().trim()) {
        errors.description = ["Course description cannot be blank."];
      } else {
        existingCourse.description = description.toString().trim();
      }
    }

    // Duration
    if (body.duration !== undefined || body.course_duration !== undefined) {
      const duration = body.duration || body.course_duration;
      if (!duration || !duration.toString().trim()) {
        errors.duration = ["Duration cannot be blank."];
      } else {
        existingCourse.duration = duration.toString().trim();
      }
    }

    // Fees
    if (body.fees !== undefined || body.course_fees !== undefined) {
      const fees = body.fees || body.course_fees;
      if (!fees || !fees.toString().trim()) {
        errors.fees = ["Fees cannot be blank."];
      } else {
        existingCourse.fees = fees.toString().trim();
      }
    }

    // Return validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please verify the submitted data.",
        error: errors,
      });
    }

    // Optional fields update
    if (body.badge !== undefined || body.course_badge !== undefined) {
      existingCourse.badge = (body.badge || body.course_badge || "").toString().trim();
    }
    if (body.highlights !== undefined || body.course_highlights !== undefined) {
      const highlights = body.highlights || body.course_highlights || [];
      existingCourse.highlights = Array.isArray(highlights) ? highlights.map((h) => h.toString().trim()) : [];
    }
    if (req.file) {
      existingCourse.imageUrl = req.file.filename;
    } else if (body.imageUrl !== undefined || body.image_url !== undefined || body.image !== undefined) {
      existingCourse.imageUrl = (body.imageUrl || body.image_url || body.image || "").toString().trim();
    }
    if (body.enrollUrl !== undefined || body.enroll_url !== undefined || body.enroll_link !== undefined) {
      existingCourse.enrollUrl = (body.enrollUrl || body.enroll_url || body.enroll_link || "").toString().trim();
    }
    if (typeof body.isActive !== "undefined") {
      existingCourse.isActive = body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1";
    }
    if (typeof body.sortOrder !== "undefined") {
      existingCourse.sortOrder = Number(body.sortOrder);
    }

    // Updated by
    if (req.user) {
      existingCourse.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingCourse.updated_by = body.updated_by;
    }

    existingCourse.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingCourse.save();

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Certificate Course updated successfully",
      data: formatCourse(existingCourse),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate course by ID or Slug
// @route   DELETE /api/certificate-courses/:idOrSlug
exports.deleteCertificateCourse = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.id || req.body.slug));

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Certificate Course ID or slug is required for deletion."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const course = await CertificateCourse.findOneAndDelete(query);
    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Certificate Course not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Certificate Course deleted successfully",
      data: {
        id: course._id,
        slug: course.slug,
      },
    });
  } catch (error) {
    next(error);
  }
};
