const Testimonial = require("../Model/testimonial");
const moment = require("moment-timezone");
const { generateSlug } = require("../helper");

/**
 * Format testimonial record for client response with Asia/Kolkata timezone
 */
const formatTestimonial = (item) => {
  const doc = item._doc || item;
  return {
    ...doc,
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
    const { type, isActive, search, slug, limit, offset, sort_by, sort_order } = queryParams || {};

    const filter = {};

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
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    let testimonialQuery = Testimonial.find(filter)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email")
      .sort({ [sortField]: sortDirection, created_at: -1 })
      .skip(pageOffset);

    if (pageLimit > 0) {
      testimonialQuery = testimonialQuery.limit(pageLimit);
    }

    const testimonials = await testimonialQuery;
    const totalCount = await Testimonial.countDocuments(filter);

    return res.status(200).json({
      status: 200,
      success: true,
      count: totalCount,
      data: testimonials.map(formatTestimonial),
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
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

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
      data: formatTestimonial(testimonial),
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

    // 1. Normalize form field aliases
    // Testimonial Type: 'student' or 'dignitary' (accepts 'Student Testimonials', 'Dignitary Testimonials')
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

    // Name: Student Name / Dignitary Name
    const authorName = body.authorName || body.author_name || body.student_name || body.studentName || body.dignitary_name || body.dignitaryName || body.name;
    if (!authorName || !authorName.toString().trim()) {
      errors.authorName = [type === "student" ? "Student Name is mandatory." : "Dignitary Name is mandatory."];
    }

    // Designation / Subtext: Course/Subtext or Designation/Subtext
    const designationSubtext = body.designationSubtext || body.designation_subtext || body.course || body.course_subtext || body.designation || body.subtext;
    if (!designationSubtext || !designationSubtext.toString().trim()) {
      errors.designationSubtext = [type === "student" ? "Course / Subtext is mandatory." : "Designation / Subtext is mandatory."];
    }

    // Testimonial Quote
    const quote = body.quote || body.testimonial_quote || body.testimonialQuote || body.description;
    if (!quote || !quote.toString().trim()) {
      errors.quote = ["Testimonial Quote is mandatory."];
    }

    // Type-specific field validations
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
      // Dignitary does not use rating
      rating = null;
    }


    // Image / Photo
    const avatarUrl = body.avatarUrl || body.avatar_url || body.student_photo || body.profile_photo || body.image || body.photo || "";

    // Return all validation errors if any field is missing or invalid
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please fill all mandatory fields properly.",
        error: errors,
      });
    }

    // Determine created_by
    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newTestimonial = new Testimonial({
      type,
      title: title ? title.toString().trim() : "",
      authorName: authorName.toString().trim(),
      designationSubtext: designationSubtext.toString().trim(),
      quote: quote.toString().trim(),
      rating,
      avatarUrl: avatarUrl ? avatarUrl.toString().trim() : "",
      isActive: typeof body.isActive !== "undefined" ? (body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1") : true,
      sortOrder: typeof body.sortOrder !== "undefined" ? Number(body.sortOrder) : 0,
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newTestimonial.save();

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Testimonial created successfully",
      data: formatTestimonial(newTestimonial),
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
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const existingTestimonial = await Testimonial.findOne(query);
    if (!existingTestimonial) {
      return res.status(404).json({
        status: 404,
        message: "Testimonial not found",
      });
    }

    const body = req.body || {};
    const errors = {};

    // Check Type if updating
    let targetType = existingTestimonial.type;
    if (body.type || body.testimonial_type || body.testimonialType) {
      const rawType = body.type || body.testimonial_type || body.testimonialType;
      const lower = rawType.toString().toLowerCase().trim();
      if (lower.includes("dignitary")) targetType = "dignitary";
      else if (lower.includes("student")) targetType = "student";
      else targetType = lower;

      if (!["student", "dignitary"].includes(targetType)) {
        errors.type = ["Testimonial type must be either 'student' or 'dignitary'."];
      }
    }

    // Check Name if updating
    if (body.authorName !== undefined || body.author_name !== undefined || body.student_name !== undefined || body.dignitary_name !== undefined || body.name !== undefined) {
      const authorName = body.authorName || body.author_name || body.student_name || body.dignitary_name || body.name;
      if (!authorName || !authorName.toString().trim()) {
        errors.authorName = [targetType === "student" ? "Student Name cannot be blank." : "Dignitary Name cannot be blank."];
      } else {
        existingTestimonial.authorName = authorName.toString().trim();
      }
    }

    // Check Designation / Subtext if updating
    if (body.designationSubtext !== undefined || body.designation_subtext !== undefined || body.course !== undefined || body.designation !== undefined || body.subtext !== undefined) {
      const designationSubtext = body.designationSubtext || body.designation_subtext || body.course || body.designation || body.subtext;
      if (!designationSubtext || !designationSubtext.toString().trim()) {
        errors.designationSubtext = [targetType === "student" ? "Course / Subtext cannot be blank." : "Designation / Subtext cannot be blank."];
      } else {
        existingTestimonial.designationSubtext = designationSubtext.toString().trim();
      }
    }

    // Check Quote if updating
    if (body.quote !== undefined || body.testimonial_quote !== undefined || body.description !== undefined) {
      const quote = body.quote || body.testimonial_quote || body.description;
      if (!quote || !quote.toString().trim()) {
        errors.quote = ["Testimonial Quote cannot be blank."];
      } else {
        existingTestimonial.quote = quote.toString().trim();
      }
    }

    // Check Title / Headline
    if (body.title !== undefined || body.headline !== undefined || body.headline_title !== undefined) {
      const title = body.title !== undefined ? body.title : (body.headline !== undefined ? body.headline : body.headline_title);
      if (targetType === "dignitary" && (!title || !title.toString().trim())) {
        errors.title = ["Headline / Title is mandatory for Dignitary Testimonials."];
      } else {
        existingTestimonial.title = title ? title.toString().trim() : "";
      }
    } else if (targetType === "dignitary" && (!existingTestimonial.title || !existingTestimonial.title.trim())) {
      errors.title = ["Headline / Title is mandatory for Dignitary Testimonials."];
    }

    // Check Rating
    if (targetType === "dignitary") {
      existingTestimonial.rating = null;
    } else if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        errors.rating = ["Rating must be between 1 and 5 for student testimonials."];
      } else {
        existingTestimonial.rating = rating;
      }
    }


    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Validation failed. Please verify the submitted data.",
        error: errors,
      });
    }

    // Update remaining attributes
    existingTestimonial.type = targetType;
    if (body.avatarUrl !== undefined || body.avatar_url !== undefined || body.student_photo !== undefined || body.profile_photo !== undefined || body.image !== undefined) {
      const avatarUrl = body.avatarUrl !== undefined ? body.avatarUrl : (body.avatar_url !== undefined ? body.avatar_url : (body.student_photo !== undefined ? body.student_photo : (body.profile_photo !== undefined ? body.profile_photo : body.image)));
      existingTestimonial.avatarUrl = avatarUrl ? avatarUrl.toString().trim() : "";
    }
    if (typeof body.isActive !== "undefined") {
      existingTestimonial.isActive = body.isActive === true || body.isActive === "true" || body.isActive === 1 || body.isActive === "1";
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

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial updated successfully",
      data: formatTestimonial(existingTestimonial),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial by ID or Slug
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
    const query = isMongoId ? { _id: idOrSlug } : { slug: idOrSlug.toLowerCase() };

    const testimonial = await Testimonial.findOneAndDelete(query);
    if (!testimonial) {
      return res.status(404).json({
        status: 404,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial deleted successfully",
      data: {
        id: testimonial._id,
        slug: testimonial.slug,
      },
    });
  } catch (error) {
    next(error);
  }
};

