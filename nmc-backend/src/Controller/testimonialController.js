const Testimonial = require("../Model/testimonial");

// @desc    Get testimonials (filtered by type e.g. dignitary, student)
// @route   GET /api/testimonials?type=dignitary
exports.getTestimonials = async (req, res, next) => {
  try {
    const { type, isActive, search } = req.query;

    const filter = {};

    if (type) {
      if (!["dignitary", "student"].includes(type.toLowerCase())) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid type query parameter. Must be 'dignitary' or 'student'.",
        });
      }
      filter.type = type.toLowerCase();
    }

    if (typeof isActive !== "undefined") {
      filter.isActive = isActive === "true" || isActive === true;
    } else {
      // Default to active testimonials for public listing
      filter.isActive = true;
    }

    if (search && search.trim()) {
      filter.$or = [
        { authorName: { $regex: search.trim(), $options: "i" } },
        { designationSubtext: { $regex: search.trim(), $options: "i" } },
        { title: { $regex: search.trim(), $options: "i" } },
        { quote: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const testimonials = await Testimonial.find(filter).sort({
      sortOrder: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      status: 200,
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial by ID
// @route   GET /api/testimonials/:id
exports.getTestimonialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const {
      title,
      quote,
      authorName,
      designationSubtext,
      avatarUrl,
      rating,
      type,
      isActive,
      sortOrder,
    } = req.body;

    if (!quote || !authorName || !designationSubtext || !type) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Please provide all required fields: quote, authorName, designationSubtext, and type.",
      });
    }

    if (type === "dignitary" && (!title || !title.trim())) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Title is required for dignitary testimonials.",
      });
    }

    const testimonial = await Testimonial.create({
      title: title ? title.trim() : "",
      quote: quote.trim(),
      authorName: authorName.trim(),
      designationSubtext: designationSubtext.trim(),
      avatarUrl: avatarUrl ? avatarUrl.trim() : "",
      rating: typeof rating !== "undefined" ? Number(rating) : 5,
      type: type.toLowerCase(),
      isActive: typeof isActive !== "undefined" ? Boolean(isActive) : true,
      sortOrder: typeof sortOrder !== "undefined" ? Number(sortOrder) : 0,
      created_by: req.user ? req.user._id : undefined,
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing testimonial
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Testimonial not found",
      });
    }

    const targetType = body.type || existingTestimonial.type;
    const targetTitle = typeof body.title !== "undefined" ? body.title : existingTestimonial.title;

    if (targetType === "dignitary" && (!targetTitle || !targetTitle.trim())) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Title is required for dignitary testimonials.",
      });
    }

    if (body.rating) body.rating = Number(body.rating);
    if (typeof body.sortOrder !== "undefined") body.sortOrder = Number(body.sortOrder);
    if (typeof body.isActive !== "undefined") body.isActive = Boolean(body.isActive);
    if (req.user) body.updated_by = req.user._id;

    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Testimonial not found",
      });
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Testimonial deleted successfully",
      data: { id: testimonial._id },
    });
  } catch (error) {
    next(error);
  }
};
