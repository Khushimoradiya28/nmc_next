const GoldMedalist = require("../Model/goldMedalist");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format gold medalist item with full image URLs and Asia/Kolkata timestamps
 */
const formatMedalist = (item, req) => {
  const doc = item._doc || item;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Frontend public assets (e.g. "/assets/toppers/name.jpg") must be served by the
  // frontend as-is. Backend-uploaded media gets the backend base URL prepended.
  const isPublicAsset = (p) => typeof p === "string" && p.replace(/\\/g, "/").startsWith("/assets/");
  const isAbsolute = (p) => typeof p === "string" && p.startsWith("http");

  let imageUrl = doc.image;
  let webpUrl = doc.image_webp;

  if (doc.image && !isAbsolute(doc.image) && !isPublicAsset(doc.image)) {
    imageUrl = `${baseUrl}/${doc.image.replace(/\\/g, "/")}`;
  }
  if (doc.image_webp && !isAbsolute(doc.image_webp) && !isPublicAsset(doc.image_webp)) {
    webpUrl = `${baseUrl}/${doc.image_webp.replace(/\\/g, "/")}`;
  }

  return {
    ...doc,
    image_url: imageUrl,
    image_webp_url: webpUrl,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

/**
 * Helper to delete temp local file on error
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

// @desc    Get all gold medalists with pagination, search, filters
// @route   GET /api/gold-medalists or POST /api/gold-medalists/list
exports.getMedalists = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      slug,
      programme,
      academicYear,
      sort_by,
      sort_order,
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (slug) {
      filter.slug = slug.toLowerCase().trim();
    }

    // Programme filter (All Programmes dropdown)
    if (programme && programme.trim() && programme.toLowerCase() !== "all") {
      filter.programme = { $regex: `^${programme.trim()}$`, $options: "i" };
    }

    // Academic Year filter (All Years dropdown)
    if (academicYear && academicYear.toString().trim() && academicYear.toString().toLowerCase() !== "all") {
      filter.academicYear = academicYear.toString().trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { programme: searchRegex },
        { subCourse: searchRegex },
        { rank: searchRegex },
        { slug: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "sort_order";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [medalists, totalCount] = await Promise.all([
      GoldMedalist.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      GoldMedalist.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gold medalists fetched successfully.",
      data: medalists.map((m) => formatMedalist(m, req)),
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

// @desc    Get single gold medalist by ID or Slug
// @route   GET /api/gold-medalists/:idOrSlug
exports.getMedalistById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Gold medalist ID or slug is required."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const medalist = await GoldMedalist.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!medalist) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Gold medalist not found.",
        error: {},
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gold medalist fetched successfully.",
      data: formatMedalist(medalist, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gold medalist (supports multipart image upload or URL)
// @route   POST /api/gold-medalists or POST /api/gold-medalists/add
exports.createMedalist = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const name = body.name ? body.name.toString().trim() : "";
    const programme = body.programme ? body.programme.toString().trim() : "";
    const subCourse = body.subCourse ? body.subCourse.toString().trim() : "";
    const academicYear = body.academicYear ? body.academicYear.toString().trim() : "";
    const rank = body.rank ? body.rank.toString().trim() : "";
    const rankLabel = body.rankLabel ? body.rankLabel.toString().trim() : "UNIVERSITY RANK HOLDER";

    if (!name) {
      errors.push("name is required and cannot be blank (e.g. Parekh Khushbu).");
    }
    if (!programme) {
      errors.push("programme is required and cannot be blank (e.g. B.A.).");
    }
    if (!subCourse) {
      errors.push("subCourse is required and cannot be blank (e.g. TYBA).");
    }
    if (!academicYear) {
      errors.push("academicYear is required and cannot be blank (e.g. 2015-16).");
    }
    if (!rank) {
      errors.push("rank is required and cannot be blank (e.g. 1ST RANK).");
    }

    let imagePath = body.image ? body.image.toString().trim() : "";
    let webpPath = null;

    if (req.file) {
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "gold-medalists");
        imagePath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "gold-medalists");
        imagePath = result.originalPath;
        webpPath = result.webpPath;
      }
    }

    if (!imagePath) {
      errors.push("image is required. Upload an image file or provide image path.");
    }

    if (errors.length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newMedalist = new GoldMedalist({
      name,
      programme,
      subCourse,
      academicYear,
      rank,
      rankLabel,
      image: imagePath,
      image_webp: webpPath,
      sort_order: typeof body.sort_order !== "undefined" ? Number(body.sort_order) : 0,
      status: body.status && ["active", "inactive"].includes(body.status.toLowerCase()) ? body.status.toLowerCase() : "active",
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newMedalist.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Gold medalist created successfully.",
      data: formatMedalist(newMedalist, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update existing gold medalist by slug or ID
// @route   PUT /api/gold-medalists/:idOrSlug or POST /api/gold-medalists/update
exports.updateMedalist = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Gold medalist ID or slug is required for updating."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existingMedalist = await GoldMedalist.findOne(query);
    if (!existingMedalist) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Gold medalist not found.",
        error: {},
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.name !== undefined) {
      if (!body.name.toString().trim()) {
        errors.push("name cannot be blank.");
      } else {
        existingMedalist.name = body.name.toString().trim();
      }
    }

    if (body.programme !== undefined) {
      if (!body.programme.toString().trim()) {
        errors.push("programme cannot be blank.");
      } else {
        existingMedalist.programme = body.programme.toString().trim();
      }
    }

    if (body.subCourse !== undefined) {
      if (!body.subCourse.toString().trim()) {
        errors.push("subCourse cannot be blank.");
      } else {
        existingMedalist.subCourse = body.subCourse.toString().trim();
      }
    }

    if (body.academicYear !== undefined) {
      if (!body.academicYear.toString().trim()) {
        errors.push("academicYear cannot be blank.");
      } else {
        existingMedalist.academicYear = body.academicYear.toString().trim();
      }
    }

    if (body.rank !== undefined) {
      if (!body.rank.toString().trim()) {
        errors.push("rank cannot be blank.");
      } else {
        existingMedalist.rank = body.rank.toString().trim();
      }
    }

    if (body.rankLabel !== undefined) {
      existingMedalist.rankLabel = body.rankLabel.toString().trim() || "UNIVERSITY RANK HOLDER";
    }

    if (body.status !== undefined) {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.push("status must be either 'active' or 'inactive'.");
      } else {
        existingMedalist.status = statusLower;
        existingMedalist.isActive = statusLower === "active";
      }
    }

    if (errors.length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    // Handle Image Replacement
    if (req.file) {
      let newOriginal, newWebp;
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "gold-medalists");
        newOriginal = uploadResult.originalKey;
        newWebp = uploadResult.webpKey;
        if (existingMedalist.image) await deleteS3Objects([existingMedalist.image, existingMedalist.image_webp].filter(Boolean));
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "gold-medalists");
        newOriginal = result.originalPath;
        newWebp = result.webpPath;
        deleteLocalImages(existingMedalist.image, existingMedalist.image_webp);
      }
      existingMedalist.image = newOriginal;
      existingMedalist.image_webp = newWebp;
    } else if (body.image) {
      existingMedalist.image = body.image.toString().trim();
    }

    if (typeof body.sort_order !== "undefined") {
      existingMedalist.sort_order = Number(body.sort_order);
    }

    if (req.user) {
      existingMedalist.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingMedalist.updated_by = body.updated_by;
    }

    existingMedalist.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingMedalist.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gold medalist updated successfully.",
      data: formatMedalist(existingMedalist, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete gold medalist by slug or ID
// @route   DELETE /api/gold-medalists/:idOrSlug or POST /api/gold-medalists/delete
exports.deleteMedalist = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Gold medalist ID or slug is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const medalist = await GoldMedalist.findOne(query);
    if (!medalist) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Gold medalist not found or already deleted.",
        error: {},
      });
    }

    // Soft delete according to Global Rule 5
    medalist.is_deleted = true;
    medalist.status = "inactive";
    medalist.isActive = false;
    medalist.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) medalist.updated_by = req.user._id;
    else if (req.body && req.body.updated_by) medalist.updated_by = req.body.updated_by;

    await medalist.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gold medalist deleted successfully.",
      data: {
        id: medalist._id,
        slug: medalist.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
