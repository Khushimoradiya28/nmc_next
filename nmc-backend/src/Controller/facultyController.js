const Faculty = require("../Model/faculty");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format faculty document with full image URLs and Asia/Kolkata timestamps
 */
const formatFaculty = (item, req) => {
  const doc = item._doc || item;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let imageUrl = doc.photo || "";
  let webpUrl = doc.photo_webp || "";

  if (doc.photo && !doc.photo.startsWith("http")) {
    imageUrl = `${baseUrl}/${doc.photo.replace(/\\/g, "/")}`;
  }
  if (doc.photo_webp && !doc.photo_webp.startsWith("http")) {
    webpUrl = `${baseUrl}/${doc.photo_webp.replace(/\\/g, "/")}`;
  }

  // Format expertise array
  let expertiseArray = doc.expertise || [];
  if (typeof expertiseArray === "string") {
    try {
      expertiseArray = JSON.parse(expertiseArray);
    } catch (e) {
      expertiseArray = expertiseArray.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }

  return {
    ...doc,
    expertise: expertiseArray,
    photo_url: imageUrl,
    image_url: imageUrl,
    photo_webp_url: webpUrl,
    image_webp_url: webpUrl,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

/**
 * Helper to delete temp local file on validation error
 */
const deleteUploadedTemp = (file) => {
  if (file && !isProduction()) {
    const uploadedFilePath = path.join(__dirname, "../../", file.path);
    if (fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath);
      } catch (e) {
        // ignore
      }
    }
  }
};

/**
 * Helper to parse expertise from comma-separated string or array
 */
const parseExpertise = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((item) => String(item).trim()).filter(Boolean);
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
    } catch (e) {
      // Fallback: comma separated string
    }
    return input.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

// @desc    Get all faculty members with pagination, search, filters
// @route   GET /api/faculty or GET /api/master/faculty
exports.getFacultyMembers = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      department,
      badgeTag,
      badge,
      slug,
      sort_by,
      sort_order,
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status.toLowerCase().trim() !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (department && department.trim()) {
      filter.department = { $regex: department.trim(), $options: "i" };
    }

    const selectedBadge = badgeTag || badge;
    if (selectedBadge && selectedBadge.trim()) {
      filter.badgeTag = { $regex: selectedBadge.trim(), $options: "i" };
    }

    if (slug) {
      filter.slug = slug.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { fullName: searchRegex },
        { designation: searchRegex },
        { qualifications: searchRegex },
        { department: searchRegex },
        { overview: searchRegex },
        { keyHighlight: searchRegex },
        { slug: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "sortOrder";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [facultyList, totalCount] = await Promise.all([
      Faculty.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      Faculty.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty members fetched successfully",
      data: facultyList.map((item) => formatFaculty(item, req)),
      meta: {
        total_records: totalCount,
        current_page: pageNum,
        total_pages: totalPages,
        limit: pageLimit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty member by ID or Slug
// @route   GET /api/faculty/:idOrSlug or GET /api/master/faculty/:idOrSlug
exports.getFacultyByIdOrSlug = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Faculty ID or slug is required."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const faculty = await Faculty.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!faculty) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found",
        error: {},
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty member fetched successfully",
      data: formatFaculty(faculty, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new faculty member (Supports FormData with image upload or photo path)
// @route   POST /api/faculty or POST /api/master/faculty
exports.createFaculty = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = {};

    const fullName = (body.fullName || body.name || "").toString().trim();
    const designation = (body.designation || body.role || "").toString().trim();
    const badgeTag = (body.badgeTag || body.badge || "").toString().trim();
    const qualifications = (body.qualifications || body.qualification || "").toString().trim();
    const department = (body.department || body.stream || "").toString().trim();
    const experience = (body.experience || "").toString().trim();
    const overview = (body.overview || body.biography || "").toString().trim();
    const keyHighlight = (body.keyHighlight || body.highlightBannerText || "").toString().trim();
    const parsedExpertise = parseExpertise(body.expertise);

    let photoPath = (body.photo || body.image || "").toString().trim();
    let webpPath = "";

    // Field-by-field mandatory validation
    if (!fullName) {
      errors.fullName = ["Full Name is mandatory."];
    }
    if (!designation) {
      errors.designation = ["Designation & Role is mandatory."];
    }
    if (!badgeTag) {
      errors.badgeTag = ["Badge Tag is mandatory."];
    }
    if (!qualifications) {
      errors.qualifications = ["Qualifications is mandatory."];
    }
    if (!department) {
      errors.department = ["Department/Stream is mandatory."];
    }
    if (!experience) {
      errors.experience = ["Experience is mandatory."];
    }
    if (!overview) {
      errors.overview = ["Overview/Biography is mandatory."];
    }
    if (!keyHighlight) {
      errors.keyHighlight = ["Key Highlight is mandatory."];
    }
    if (!parsedExpertise || parsedExpertise.length === 0) {
      errors.expertise = ["Expertise areas are mandatory."];
    }
    if (!req.file && !photoPath) {
      errors.photo = ["Faculty Photo is mandatory."];
    }

    if (Object.keys(errors).length > 0) {
      deleteUploadedTemp(req.file);
      const errorList = Object.values(errors).flat();
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        error: errors,
        errors: errorList,
      });
    }

    // Handle Multer image upload
    if (req.file) {
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "faculty");
        photoPath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "faculty");
        photoPath = result.originalPath;
        webpPath = result.webpPath;
      }
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newFaculty = new Faculty({
      fullName,
      designation,
      photo: photoPath,
      photo_webp: webpPath,
      badgeTag,
      qualifications,
      department,
      experience,
      overview,
      expertise: parsedExpertise,
      keyHighlight,
      sortOrder: typeof body.sortOrder !== "undefined" ? Number(body.sortOrder) : 0,
      status: body.status && ["active", "inactive"].includes(body.status.toLowerCase()) ? body.status.toLowerCase() : "active",
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newFaculty.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Faculty member created successfully",
      data: formatFaculty(newFaculty, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update existing faculty member by slug or ID
// @route   PUT /api/faculty/:idOrSlug or PUT /api/master/faculty/:idOrSlug
exports.updateFaculty = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      deleteUploadedTemp(req.file);
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Faculty ID or slug is required for updating."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existingFaculty = await Faculty.findOne(query);
    if (!existingFaculty) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found",
        error: {},
      });
    }

    const body = req.body || {};
    const errors = {};

    if (body.fullName !== undefined || body.name !== undefined) {
      const val = (body.fullName || body.name || "").toString().trim();
      if (!val) {
        errors.fullName = ["Full Name cannot be blank."];
      } else {
        existingFaculty.fullName = val;
      }
    }

    if (body.designation !== undefined || body.role !== undefined) {
      const val = (body.designation || body.role || "").toString().trim();
      if (!val) {
        errors.designation = ["Designation & Role cannot be blank."];
      } else {
        existingFaculty.designation = val;
      }
    }

    if (body.status !== undefined) {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.status = ["Status must be either 'active' or 'inactive'."];
      } else {
        existingFaculty.status = statusLower;
      }
    }

    if (Object.keys(errors).length > 0) {
      deleteUploadedTemp(req.file);
      const errorList = Object.values(errors).flat();
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        error: errors,
        errors: errorList,
      });
    }

    // Handle photo replacement
    if (req.file) {
      let newOriginal, newWebp;
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "faculty");
        newOriginal = uploadResult.originalKey;
        newWebp = uploadResult.webpKey;
        if (existingFaculty.photo) await deleteS3Objects([existingFaculty.photo, existingFaculty.photo_webp].filter(Boolean));
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "faculty");
        newOriginal = result.originalPath;
        newWebp = result.webpPath;
        deleteLocalImages(existingFaculty.photo, existingFaculty.photo_webp);
      }
      existingFaculty.photo = newOriginal;
      existingFaculty.photo_webp = newWebp;
    } else if (body.photo || body.image) {
      existingFaculty.photo = (body.photo || body.image).toString().trim();
    }

    if (body.badgeTag !== undefined || body.badge !== undefined) {
      existingFaculty.badgeTag = (body.badgeTag || body.badge || "").toString().trim();
    }
    if (body.qualifications !== undefined || body.qualification !== undefined) {
      existingFaculty.qualifications = (body.qualifications || body.qualification || "").toString().trim();
    }
    if (body.department !== undefined || body.stream !== undefined) {
      existingFaculty.department = (body.department || body.stream || "").toString().trim();
    }
    if (body.experience !== undefined) {
      existingFaculty.experience = body.experience.toString().trim();
    }
    if (body.overview !== undefined || body.biography !== undefined) {
      existingFaculty.overview = (body.overview || body.biography || "").toString().trim();
    }
    if (body.expertise !== undefined) {
      existingFaculty.expertise = parseExpertise(body.expertise);
    }
    if (body.keyHighlight !== undefined || body.highlightBannerText !== undefined) {
      existingFaculty.keyHighlight = (body.keyHighlight || body.highlightBannerText || "").toString().trim();
    }
    if (typeof body.sortOrder !== "undefined") {
      existingFaculty.sortOrder = Number(body.sortOrder);
    }

    if (req.user) {
      existingFaculty.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingFaculty.updated_by = body.updated_by;
    }

    existingFaculty.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingFaculty.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty member updated successfully",
      data: formatFaculty(existingFaculty, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete faculty member by slug or ID
// @route   DELETE /api/faculty/:idOrSlug or DELETE /api/master/faculty/:idOrSlug
exports.deleteFaculty = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Faculty ID or slug is required for deletion."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const faculty = await Faculty.findOne(query);
    if (!faculty) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found or already deleted",
        error: {},
      });
    }

    // Soft delete according to Global Rule 5
    faculty.is_deleted = true;
    faculty.status = "inactive";
    faculty.isActive = false;
    faculty.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) faculty.updated_by = req.user._id;

    await faculty.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty member deleted successfully",
      data: {
        id: faculty._id,
        slug: faculty.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
