const Award = require("../Model/award");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format award item with full image URLs and Asia/Kolkata timestamps
 */
const formatAward = (item, req) => {
  const doc = item._doc || item;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let imageUrl = doc.image;
  let webpUrl = doc.image_webp;

  if (doc.image && !doc.image.startsWith("http")) {
    imageUrl = `${baseUrl}/${doc.image.replace(/\\/g, "/")}`;
  }
  if (doc.image_webp && !doc.image_webp.startsWith("http")) {
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

// @desc    Get all awards with pagination, search, status filter
// @route   GET /api/awards or POST /api/awards/list
exports.getAwards = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      slug,
      sort_by,
      sort_order
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (slug) {
      filter.slug = slug.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { slug: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "sort_order";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [awards, totalCount] = await Promise.all([
      Award.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      Award.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Awards fetched successfully",
      data: awards.map((award) => formatAward(award, req)),
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

// @desc    Get single award by ID or Slug
// @route   GET /api/awards/:idOrSlug
exports.getAwardById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Award ID or slug is required."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const award = await Award.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!award) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Award not found",
        error: {},
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Award fetched successfully",
      data: formatAward(award, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new award (Supports multipart image upload or URL)
// @route   POST /api/awards or POST /api/awards/add
exports.createAward = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = {};

    const title = body.title ? body.title.toString().trim() : "";
    const description = body.description ? body.description.toString().trim() : "";

    if (!title) {
      errors.title = ["Award title is mandatory."];
    }
    if (!description) {
      errors.description = ["Award description is mandatory."];
    }

    let imagePath = body.image ? body.image.toString().trim() : "";
    let webpPath = null;

    // If file is uploaded via multer
    if (req.file) {
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "awards");
        imagePath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "awards");
        imagePath = result.originalPath;
        webpPath = result.webpPath;
      }
    }

    if (!imagePath) {
      errors.image = ["Award image is mandatory. Upload an image file or provide image path."];
    }

    if (Object.keys(errors).length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed. Please fill all mandatory fields properly.",
        error: errors,
      });
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);

    const newAward = new Award({
      title,
      description,
      image: imagePath,
      image_webp: webpPath,
      sort_order: typeof body.sort_order !== "undefined" ? Number(body.sort_order) : 0,
      status: body.status && ["active", "inactive"].includes(body.status.toLowerCase()) ? body.status.toLowerCase() : "active",
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newAward.save();

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Award created successfully",
      data: formatAward(newAward, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update existing award by slug or ID
// @route   PUT /api/awards/:idOrSlug or POST /api/awards/update
exports.updateAward = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      deleteUploadedTemp(req.file);
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Award ID or slug is required for updating."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const existingAward = await Award.findOne(query);
    if (!existingAward) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Award not found",
        error: {},
      });
    }

    const body = req.body || {};
    const errors = {};

    if (body.title !== undefined) {
      if (!body.title.toString().trim()) {
        errors.title = ["Award title cannot be blank."];
      } else {
        existingAward.title = body.title.toString().trim();
      }
    }

    if (body.description !== undefined) {
      if (!body.description.toString().trim()) {
        errors.description = ["Award description cannot be blank."];
      } else {
        existingAward.description = body.description.toString().trim();
      }
    }

    if (body.status !== undefined) {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.status = ["Status must be either 'active' or 'inactive'."];
      } else {
        existingAward.status = statusLower;
      }
    }

    if (Object.keys(errors).length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed. Please verify the submitted data.",
        error: errors,
      });
    }

    // Handle Image Replacement
    if (req.file) {
      let newOriginal, newWebp;
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "awards");
        newOriginal = uploadResult.originalKey;
        newWebp = uploadResult.webpKey;
        if (existingAward.image) await deleteS3Objects([existingAward.image, existingAward.image_webp].filter(Boolean));
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "awards");
        newOriginal = result.originalPath;
        newWebp = result.webpPath;
        deleteLocalImages(existingAward.image, existingAward.image_webp);
      }
      existingAward.image = newOriginal;
      existingAward.image_webp = newWebp;
    } else if (body.image) {
      existingAward.image = body.image.toString().trim();
    }

    if (typeof body.sort_order !== "undefined") {
      existingAward.sort_order = Number(body.sort_order);
    }

    if (req.user) {
      existingAward.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingAward.updated_by = body.updated_by;
    }

    existingAward.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingAward.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Award updated successfully",
      data: formatAward(existingAward, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete award by slug or ID
// @route   DELETE /api/awards/:idOrSlug or POST /api/awards/delete
exports.deleteAward = async (req, res, next) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.id || (req.body && (req.body.slug || req.body.id));

    if (!idOrSlug) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Validation failed.",
        error: { id: ["Award ID or slug is required for deletion."] },
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    const query = isMongoId
      ? { _id: idOrSlug, is_deleted: false }
      : { slug: idOrSlug.toLowerCase(), is_deleted: false };

    const award = await Award.findOne(query);
    if (!award) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Award not found or already deleted",
        error: {},
      });
    }

    // Soft delete according to Global Rule 5
    award.is_deleted = true;
    award.status = "inactive";
    award.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) award.updated_by = req.user._id;

    await award.save();

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Award deleted successfully",
      data: {
        id: award._id,
        slug: award.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

