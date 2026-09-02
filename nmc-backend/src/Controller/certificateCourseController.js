const CertificateCourse = require("../Model/certificateCourse");
const moment = require("moment-timezone");
const config = require("../Config/app");
const { generateSlug } = require("../helper");
const {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
} = require("../Utils/imageProcessor");
const { logActivity } = require("../Utils/activityLogger");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format certificate course record for client response with Asia/Kolkata timezone & full image URLs
 */
const formatCourse = (item, req) => {
  const doc = item._doc || item;
  let fullImageUrl = doc.imageUrl || doc.image || "";

  if (fullImageUrl && !fullImageUrl.startsWith("http")) {
    const baseUrl = req ? `${req.protocol}://${req.get("host")}` : "http://localhost:5000";
    fullImageUrl = `${baseUrl}/${fullImageUrl.replace(/\\/g, "/")}`;
  }

  return {
    ...doc,
    imageUrl: fullImageUrl,
    image_url: fullImageUrl,
    image: fullImageUrl,
    images: fullImageUrl ? [fullImageUrl] : [],
    created_at: moment(doc.created_at || doc.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at || doc.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};



// @desc    Get certificate courses (filtered by category, slug, search, isActive)
// @route   GET /api/certificate-courses
// @route   POST /api/certificate-courses/list
exports.getCertificateCourses = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const { category, isActive, search, slug, limit, offset, sort_by, sort_order, status } = queryParams || {};

    const filter = { is_deleted: false };

    if (category && category.trim()) {
      filter.category = { $regex: category.trim(), $options: "i" };
    }

    if (status) {
      filter.status = status.toLowerCase().trim();
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
      data: courses.map((c) => formatCourse(c, req)),
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
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

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
      data: formatCourse(course, req),
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

    // Image processing
    let imagePath = (body.imageUrl || body.image_url || body.image || "").toString().trim();
    if (req.file) {
      const processed = await uploadToS3AndCreateWebp(req.file, "certificate_courses");
      imagePath = processed.originalKey || processed.originalPath;
    }


    // Generate unique slug
    let generatedSlug = generateSlug(title.trim());
    let uniqueSlug = generatedSlug;
    let counter = 1;
    while (await CertificateCourse.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${generatedSlug}-${counter}`;
      counter++;
    }

    const courseData = {
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      duration: duration.trim(),
      fees: fees.trim(),
      badge: (body.badge || body.course_badge || "").toString().trim(),
      highlights: body.highlights || body.course_highlights || [],
      imageUrl: imagePath,
      enrollUrl: (body.enrollUrl || body.enroll_url || body.enroll_link || "").toString().trim(),
      slug: uniqueSlug,
      isActive: typeof body.isActive !== "undefined" ? (body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1") : true,
      status: body.status ? body.status.toLowerCase().trim() : "active",
      is_deleted: false,
      sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : 0,
      created_by: req.user ? req.user._id : body.created_by || null,
      updated_by: req.user ? req.user._id : body.updated_by || null,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    };

    if (typeof courseData.highlights === "string") {
      try {
        courseData.highlights = JSON.parse(courseData.highlights);
      } catch (e) {
        courseData.highlights = courseData.highlights.split(",").map((h) => h.trim());
      }
    }

    const newCourse = await CertificateCourse.create(courseData);

    await logActivity({
      req,
      action: "CREATE",
      module: "certificate_courses",
      record_id: newCourse._id,
      record_title: newCourse.title,
      description: `Created certificate course '${newCourse.title}'`,
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Certificate Course created successfully",
      data: formatCourse(newCourse, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate course
// @route   PUT /api/certificate-courses/:idOrSlug
// @route   POST /api/certificate-courses/update (supports body.id / body.slug)
exports.updateCertificateCourse = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.id || req.body.slug));

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Certificate Course ID or slug is required for update."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existingCourse = await CertificateCourse.findOne(query);
    if (!existingCourse) {
      return res.status(404).json({
        status: 404,
        message: "Certificate Course not found",
      });
    }

    const body = req.body || {};

    if (body.title && body.title.trim()) {
      existingCourse.title = body.title.trim();
    }
    if (body.category && body.category.trim()) {
      existingCourse.category = body.category.trim();
    }
    if (body.description && body.description.trim()) {
      existingCourse.description = body.description.trim();
    }
    if (body.duration && body.duration.trim()) {
      existingCourse.duration = body.duration.trim();
    }
    if (body.fees && body.fees.trim()) {
      existingCourse.fees = body.fees.trim();
    }
    if (body.badge !== undefined || body.course_badge !== undefined) {
      existingCourse.badge = (body.badge || body.course_badge || "").toString().trim();
    }

    if (body.highlights !== undefined || body.course_highlights !== undefined) {
      let highlights = body.highlights || body.course_highlights;
      if (typeof highlights === "string") {
        try {
          highlights = JSON.parse(highlights);
        } catch (e) {
          highlights = highlights.split(",").map((h) => h.trim());
        }
      }
      existingCourse.highlights = Array.isArray(highlights) ? highlights.map((h) => h.toString().trim()) : [];
    }

    // Image Upload processing for update
    if (req.file) {
      if (existingCourse.imageUrl) {
        await deleteS3Objects([existingCourse.imageUrl]);
        deleteLocalImages(existingCourse.imageUrl);
      }
      const processed = await uploadToS3AndCreateWebp(req.file, "certificate_courses");
      existingCourse.imageUrl = processed.originalKey || processed.originalPath;
    } else {
      const explicitImg = (body.imageUrl || body.image_url || body.image || "").toString().trim();
      if (explicitImg) {
        existingCourse.imageUrl = explicitImg;
      }
    }




    if (body.enrollUrl !== undefined || body.enroll_url !== undefined || body.enroll_link !== undefined) {
      existingCourse.enrollUrl = (body.enrollUrl || body.enroll_url || body.enroll_link || "").toString().trim();
    }
    if (typeof body.isActive !== "undefined") {
      existingCourse.isActive = body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1";
    }
    if (typeof body.status !== "undefined") {
      existingCourse.status = body.status.toLowerCase().trim();
    }
    if (typeof body.sortOrder !== "undefined") {
      existingCourse.sortOrder = Number(body.sortOrder);
    }
    if (req.user) {
      existingCourse.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingCourse.updated_by = body.updated_by;
    }

    existingCourse.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingCourse.save();

    await logActivity({
      req,
      action: "UPDATE",
      module: "certificate_courses",
      record_id: existingCourse._id,
      record_title: existingCourse.title,
      description: `Updated certificate course '${existingCourse.title}'`,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Certificate Course updated successfully",
      data: formatCourse(existingCourse, req),
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Soft Delete certificate course by ID or Slug
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
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const course = await CertificateCourse.findOne(query);
    if (!course) {
      return res.status(404).json({
        status: 404,
        message: "Certificate Course not found or already deleted",
      });
    }

    // Soft delete
    course.is_deleted = true;
    course.status = "inactive";
    course.isActive = false;
    course.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) course.updated_by = req.user._id;

    await course.save();

    await logActivity({
      req,
      action: "DELETE",
      module: "certificate_courses",
      record_id: course._id,
      record_title: course.title,
      description: `Deleted certificate course '${course.title}'`,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Certificate Course deleted successfully",
      data: {
        id: course._id,
        slug: course.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

