const Testimonial = require("../Model/testimonial");
const moment = require("moment-timezone");
const config = require("../Config/app");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const { generateSlug } = require("../helper");
const { logActivity } = require("../Utils/activityLogger");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format testimonial record for client response with Asia/Kolkata timezone and resolved URLs
 */
const formatTestimonial = (item, req) => {
  const doc = item._doc || item;
  let avatarUrl = doc.avatarUrl || "";

  if (avatarUrl && !avatarUrl.startsWith("http://") && !avatarUrl.startsWith("https://") && !avatarUrl.startsWith("blob:") && req) {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const cleanPath = avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`;
    avatarUrl = `${baseUrl}${cleanPath}`;
  }

  return {
    ...doc,
    avatarUrl,
    created_at: moment(doc.created_at || doc.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at || doc.updatedAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Get testimonials (filtered by type e.g. dignitary, student, slug, or search)
// @route   GET /api/testimonials or GET /api/testimonial
// @route   POST /api/testimonials/list (supports body filters)
exports.getTestimonials = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const { type, isActive, search, slug, limit, offset, sort_by, sort_order, status } = queryParams || {};

    const filter = { is_deleted: false };

    if (type) {
      if (!["dignitary", "student"].includes(type.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          error: {
            type: ["Invalid type parameter. Must be 'student' or 'dignitary'."],
          },
        });
      }
      filter.type = type.toLowerCase();
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
        { authorName: searchRegex },
        { designationSubtext: searchRegex },
        { title: searchRegex },
        { quote: searchRegex },
        { slug: searchRegex },
      ];
    }

    const sortField = sort_by || "sortOrder";
    const sortDirection = sort_order === "desc" ? -1 : (sort_by ? 1 : 1);
    const sortOption = { [sortField]: sortDirection, created_at: -1 };

    let query = Testimonial.find(filter).sort(sortOption);

    if (offset && !isNaN(Number(offset))) {
      query = query.skip(Number(offset));
    }

    if (limit && !isNaN(Number(limit))) {
      query = query.limit(Number(limit));
    }

    const [testimonials, totalCount] = await Promise.all([
      query.exec(),
      Testimonial.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: 200,
      success: true,
      count: totalCount,
      data: testimonials.map(item => formatTestimonial(item, req)),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial by ID or Slug
// @route   GET /api/testimonials/:idOrSlug
exports.getTestimonialById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Testimonial ID or slug is required."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const testimonial = await Testimonial.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!testimonial) {
      return res.status(404).json({
        status: 404,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: formatTestimonial(testimonial, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial (maps both Student and Dignitary form fields)
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = {};

    let rawType = body.type || body.testimonial_type || body.testimonialType;
    let type = "";
    if (rawType) {
      const lower = rawType.toString().toLowerCase().trim();
      if (lower.includes("dignitary")) type = "dignitary";
      else if (lower.includes("student")) type = "student";
      else type = lower;
    }

    if (!type) {
      errors.type = ["Testimonial type is mandatory (must be 'student' or 'dignitary')."];
    } else if (!["student", "dignitary"].includes(type)) {
      errors.type = ["Testimonial type must be either 'student' or 'dignitary'."];
    }

    const authorName = body.authorName || body.author_name || body.student_name || body.studentName || body.dignitary_name || body.dignitaryName || body.name;
    if (!authorName || !authorName.toString().trim()) {
      errors.authorName = [type === "student" ? "Student Name is mandatory." : "Dignitary Name is mandatory."];
    }

    const designationSubtext = body.designationSubtext || body.designation_subtext || body.course || body.course_subtext || body.designation || body.subtext;
    if (!designationSubtext || !designationSubtext.toString().trim()) {
      errors.designationSubtext = [type === "student" ? "Course / Subtext is mandatory." : "Designation / Subtext is mandatory."];
    }

    const quote = body.quote || body.testimonial_quote || body.testimonialQuote || body.description;
    if (!quote || !quote.toString().trim()) {
      errors.quote = ["Testimonial Quote is mandatory."];
    }

    let title = body.title || body.headline || body.headline_title || body.headlineTitle || "";
    if (type === "dignitary") {
      if (!title || !title.toString().trim()) {
        errors.title = ["Headline / Title is mandatory for Dignitary Testimonials."];
      }
    }

    let rating = null;
    if (type === "student") {
      if (body.rating === undefined || body.rating === null || body.rating === "") {
        errors.rating = ["Rating is mandatory for Student Testimonials."];
      } else {
        const numRating = Number(body.rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
          errors.rating = ["Rating must be a valid number between 1 and 5."];
        } else {
          rating = numRating;
        }
      }
    } else {
      rating = null;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please fill all mandatory fields properly.",
        error: errors,
      });
    }

    let avatarUrl = "";
    if (req.file) {
      const uploadResult = await uploadToS3AndCreateWebp(req.file, "testimonials");
      avatarUrl = uploadResult.originalKey || uploadResult.originalPath;
    } else if (body.avatarUrl || body.avatar_url || body.student_photo || body.profile_photo || body.image || body.photo) {
      const rawAvatar = body.avatarUrl || body.avatar_url || body.student_photo || body.profile_photo || body.image || body.photo;
      if (!rawAvatar.startsWith("blob:")) {
        avatarUrl = rawAvatar.toString().trim();
      }
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newTestimonial = new Testimonial({
      type,
      title: title ? title.toString().trim() : "",
      authorName: authorName.toString().trim(),
      designationSubtext: designationSubtext.toString().trim(),
      quote: quote.toString().trim(),
      rating,
      avatarUrl,
      isActive: typeof body.isActive !== "undefined" ? (body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1") : true,
      status: body.status ? body.status.toLowerCase().trim() : "active",
      sortOrder: typeof body.sortOrder !== "undefined" ? Number(body.sortOrder) : 0,
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newTestimonial.save();

    await logActivity({
      req,
      action: "CREATE",
      module: "testimonials",
      record_id: newTestimonial._id,
      record_title: newTestimonial.authorName || newTestimonial.title,
      description: `Created testimonial for '${newTestimonial.authorName || newTestimonial.title}'`,
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Testimonial created successfully",
      data: formatTestimonial(newTestimonial, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing testimonial by ID or Slug
// @route   PUT /api/testimonials/:idOrSlug
exports.updateTestimonial = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || req.body.id || req.body.slug;

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Testimonial ID or slug is required for updating."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existingTestimonial = await Testimonial.findOne(query);
    if (!existingTestimonial) {
      return res.status(404).json({
        status: 404,
        message: "Testimonial not found",
        error: { id: ["Testimonial not found or already deleted."] },
      });
    }

    const body = req.body || {};
    const errors = {};

    const type = body.type ? body.type.toLowerCase().trim() : existingTestimonial.type;
    if (body.type && !["dignitary", "student"].includes(type)) {
      errors.type = ["Testimonial type must be either 'student' or 'dignitary'."];
    }

    if (body.authorName !== undefined) {
      if (!body.authorName.toString().trim()) {
        errors.authorName = ["Author Name cannot be blank."];
      } else {
        existingTestimonial.authorName = body.authorName.toString().trim();
      }
    }

    if (body.designationSubtext !== undefined) {
      if (!body.designationSubtext.toString().trim()) {
        errors.designationSubtext = ["Designation / Subtext cannot be blank."];
      } else {
        existingTestimonial.designationSubtext = body.designationSubtext.toString().trim();
      }
    }

    if (body.quote !== undefined) {
      if (!body.quote.toString().trim()) {
        errors.quote = ["Quote/Testimonial text cannot be blank."];
      } else {
        existingTestimonial.quote = body.quote.toString().trim();
      }
    }

    if (type === "student") {
      if (body.rating !== undefined) {
        const numRating = Number(body.rating);
        if (isNaN(numRating) || numRating < 1 || numRating > 5) {
          errors.rating = ["Rating must be a valid number between 1 and 5."];
        } else {
          existingTestimonial.rating = numRating;
        }
      }
    } else {
      existingTestimonial.rating = null;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please verify the submitted data.",
        error: errors,
      });
    }

    if (body.title !== undefined) {
      existingTestimonial.title = body.title ? body.title.toString().trim() : "";
    }

    if (body.type !== undefined) {
      existingTestimonial.type = type;
    }

    if (req.file) {
      if (existingTestimonial.avatarUrl) {
        await deleteS3Objects([existingTestimonial.avatarUrl]);
        deleteLocalImages(existingTestimonial.avatarUrl);
      }
      const uploadResult = await uploadToS3AndCreateWebp(req.file, "testimonials");
      existingTestimonial.avatarUrl = uploadResult.originalKey || uploadResult.originalPath;
    } else if (body.avatarUrl || body.avatar_url || body.student_photo || body.profile_photo || body.image || body.photo) {
      const explicitAvatar = body.avatarUrl || body.avatar_url || body.student_photo || body.profile_photo || body.image || body.photo;
      if (!explicitAvatar.startsWith("blob:")) {
        existingTestimonial.avatarUrl = explicitAvatar.toString().trim();
      }
    }

    if (typeof body.isActive !== "undefined") {
      existingTestimonial.isActive = body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1";
    }
    if (typeof body.status !== "undefined") {
      existingTestimonial.status = body.status.toLowerCase().trim();
    }
    if (typeof body.sortOrder !== "undefined") {
      existingTestimonial.sortOrder = Number(body.sortOrder);
    }
    if (req.user) {
      existingTestimonial.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingTestimonial.updated_by = body.updated_by;
    }

    existingTestimonial.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingTestimonial.save();

    await logActivity({
      req,
      action: "UPDATE",
      module: "testimonials",
      record_id: existingTestimonial._id,
      record_title: existingTestimonial.authorName || existingTestimonial.title,
      description: `Updated testimonial for '${existingTestimonial.authorName || existingTestimonial.title}'`,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial updated successfully",
      data: formatTestimonial(existingTestimonial, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Soft Delete testimonial by ID or Slug
// @route   DELETE /api/testimonials/:idOrSlug
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.id || req.body.slug));

    if (!idOrSlug) {
      return res.status(400).json({
        status: 400,
        error: { id: ["Testimonial ID or slug is required for deletion."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const testimonial = await Testimonial.findOne(query);
    if (!testimonial) {
      return res.status(404).json({
        status: 404,
        message: "Testimonial not found or already deleted",
      });
    }

    testimonial.is_deleted = true;
    testimonial.status = "inactive";
    testimonial.isActive = false;
    testimonial.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) testimonial.updated_by = req.user._id;

    await testimonial.save();

    await logActivity({
      req,
      action: "DELETE",
      module: "testimonials",
      record_id: testimonial._id,
      record_title: testimonial.authorName || testimonial.title,
      description: `Deleted testimonial for '${testimonial.authorName || testimonial.title}'`,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial deleted successfully",
      data: {
        id: testimonial._id,
        slug: testimonial.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

