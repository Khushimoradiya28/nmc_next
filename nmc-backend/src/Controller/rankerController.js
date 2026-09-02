const Ranker = require("../Model/ranker");
const AcademicProgram = require("../Model/academicProgram");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format ranker item with resolved image URLs and Asia/Kolkata timestamps.
 * - Frontend public assets ("/assets/...") are returned as-is (frontend serves them).
 * - Backend-uploaded media gets the backend base URL prepended.
 */
const formatRanker = (item, req) => {
  const doc = item._doc || item;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

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

const deleteUploadedTemp = (file) => {
  if (file && !isProduction()) {
    const uploadedFilePath = path.join(__dirname, "../../", file.path);
    if (fs.existsSync(uploadedFilePath)) {
      try { fs.unlinkSync(uploadedFilePath); } catch (e) { /* ignore */ }
    }
  }
};

// @desc    Get all rankers (pagination, search, programme/academicYear/semesterYear filters)
// @route   GET /api/rankers or POST /api/rankers/list
exports.getRankers = async (req, res, next) => {
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
      semesterYear,
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
    if (programme && programme.trim() && programme.toLowerCase() !== "all") {
      filter.programme = { $regex: `^${programme.trim()}$`, $options: "i" };
    }
    if (academicYear && academicYear.toString().trim() && academicYear.toString().toLowerCase() !== "all") {
      filter.academicYear = academicYear.toString().trim();
    }
    if (semesterYear && semesterYear.toString().trim() && semesterYear.toString().toLowerCase() !== "all") {
      filter.semesterYear = { $regex: `^${semesterYear.trim()}$`, $options: "i" };
    }
    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { programme: searchRegex },
        { semesterYear: searchRegex },
        { slug: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "rankNum";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [rankers, totalCount] = await Promise.all([
      Ranker.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      Ranker.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Rankers fetched successfully.",
      data: rankers.map((r) => formatRanker(r, req)),
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

// @desc    Get single ranker by ID or Slug
// @route   GET /api/rankers/:idOrSlug
exports.getRankerById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    if (!idOrSlug) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Ranker ID or slug is required."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const ranker = await Ranker.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!ranker) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Ranker not found.",
        error: {},
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Ranker fetched successfully.",
      data: formatRanker(ranker, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new ranker
// @route   POST /api/rankers or POST /api/rankers/add
exports.createRanker = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const name = body.name ? body.name.toString().trim() : "";
    const programme = body.programme ? body.programme.toString().trim() : "";
    const semesterYear = body.semesterYear ? body.semesterYear.toString().trim() : "";
    const academicYear = body.academicYear ? body.academicYear.toString().trim() : "";
    const rankRaw = body.rankNum !== undefined ? body.rankNum.toString().trim() : "";
    const rankLabel = body.rankLabel ? body.rankLabel.toString().trim() : "University Rank Holder";

    if (!name) errors.push("name is required and cannot be blank (e.g. PAREKH KHUSHBHU).");
    if (!programme) errors.push("programme is required and cannot be blank (e.g. BA).");
    if (!semesterYear) errors.push("semesterYear is required and cannot be blank (e.g. BA SEM-1).");
    if (!academicYear) errors.push("academicYear is required and cannot be blank (e.g. 2011-12).");

    let rankNum = null;
    if (!rankRaw) {
      errors.push("rankNum is required and cannot be blank (e.g. 1).");
    } else {
      rankNum = parseInt(rankRaw);
      if (isNaN(rankNum) || rankNum < 1) {
        errors.push("rankNum must be a valid positive number (e.g. 1, 2, 3).");
      }
    }

    let imagePath = body.image ? body.image.toString().trim() : "";
    let webpPath = null;

    if (req.file) {
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "rankers");
        imagePath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "rankers");
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

    const newRanker = new Ranker({
      name,
      programme,
      semesterYear,
      academicYear,
      rankNum,
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

    await newRanker.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Ranker created successfully.",
      data: formatRanker(newRanker, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update ranker by slug or ID
// @route   PUT /api/rankers/:idOrSlug or POST /api/rankers/update
exports.updateRanker = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));
    if (!idOrSlug) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Ranker ID or slug is required for updating."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existing = await Ranker.findOne(query);
    if (!existing) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Ranker not found.",
        error: {},
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.name !== undefined) {
      if (!body.name.toString().trim()) errors.push("name cannot be blank.");
      else existing.name = body.name.toString().trim();
    }
    if (body.programme !== undefined) {
      if (!body.programme.toString().trim()) errors.push("programme cannot be blank.");
      else existing.programme = body.programme.toString().trim();
    }
    if (body.semesterYear !== undefined) {
      if (!body.semesterYear.toString().trim()) errors.push("semesterYear cannot be blank.");
      else existing.semesterYear = body.semesterYear.toString().trim();
    }
    if (body.academicYear !== undefined) {
      if (!body.academicYear.toString().trim()) errors.push("academicYear cannot be blank.");
      else existing.academicYear = body.academicYear.toString().trim();
    }
    if (body.rankNum !== undefined) {
      const rn = parseInt(body.rankNum.toString().trim());
      if (isNaN(rn) || rn < 1) errors.push("rankNum must be a valid positive number.");
      else existing.rankNum = rn;
    }
    if (body.rankLabel !== undefined) {
      existing.rankLabel = body.rankLabel.toString().trim() || "University Rank Holder";
    }
    if (body.status !== undefined) {
      const s = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(s)) errors.push("status must be either 'active' or 'inactive'.");
      else { existing.status = s; existing.isActive = s === "active"; }
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

    // Image replacement
    if (req.file) {
      let newOriginal, newWebp;
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "rankers");
        newOriginal = uploadResult.originalKey;
        newWebp = uploadResult.webpKey;
        if (existing.image) await deleteS3Objects([existing.image, existing.image_webp].filter(Boolean));
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "rankers");
        newOriginal = result.originalPath;
        newWebp = result.webpPath;
        deleteLocalImages(existing.image, existing.image_webp);
      }
      existing.image = newOriginal;
      existing.image_webp = newWebp;
    } else if (body.image) {
      existing.image = body.image.toString().trim();
    }

    if (typeof body.sort_order !== "undefined") existing.sort_order = Number(body.sort_order);
    if (req.user) existing.updated_by = req.user._id;
    else if (body.updated_by) existing.updated_by = body.updated_by;

    existing.updated_at = moment().tz("Asia/Kolkata").toDate();
    await existing.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Ranker updated successfully.",
      data: formatRanker(existing, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete ranker by slug or ID
// @route   DELETE /api/rankers/:idOrSlug or POST /api/rankers/delete
exports.deleteRanker = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));
    if (!idOrSlug) {
      return res.status(422).json({
        success: false,
        status: 422,
        message: "Validation error: Unable to process input fields",
        errors: ["Ranker ID or slug is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const ranker = await Ranker.findOne(query);
    if (!ranker) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Ranker not found or already deleted.",
        error: {},
      });
    }

    ranker.is_deleted = true;
    ranker.status = "inactive";
    ranker.isActive = false;
    ranker.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) ranker.updated_by = req.user._id;
    else if (req.body && req.body.updated_by) ranker.updated_by = req.body.updated_by;

    await ranker.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Ranker deleted successfully.",
      data: { id: ranker._id, slug: ranker.slug, is_deleted: true },
    });
  } catch (error) {
    next(error);
  }
};
