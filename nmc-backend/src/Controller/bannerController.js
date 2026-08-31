const Banner = require("../Model/banner");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
} = require("../Utils/imageProcessor");
const { logActivity } = require("../Utils/activityLogger");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format banner document with full image URLs and Asia/Kolkata timestamps
 */
const formatBanner = (item, req) => {
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
    _id: doc._id,
    title: doc.title || "",
    image: doc.image,
    image_webp: doc.image_webp || null,
    image_url: imageUrl,
    image_webp_url: webpUrl,
    guid: doc.guid,
    sort_order: doc.sort_order ?? 0,
    status: doc.status || "active",
    isActive: doc.isActive ?? true,
    is_deleted: doc.is_deleted ?? false,
    created_by: doc.created_by || null,
    updated_by: doc.updated_by || null,
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

// @desc    Get all banners with pagination, search, status filter
// @route   GET /api/banners or POST /api/banners/list
exports.getBanners = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort_by,
      sort_order,
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { title: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "sort_order";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [banners, totalCount] = await Promise.all([
      Banner.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      Banner.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Banners fetched successfully.",
      data: banners.map((banner) => formatBanner(banner, req)),
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

// @desc    Get single banner by ID or GUID
// @route   GET /api/banners/:id
exports.getBannerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Banner ID is required and cannot be blank."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const banner = await Banner.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!banner) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Banner not found or has been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Banner fetched successfully.",
      data: formatBanner(banner, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner (Supports multipart image upload or URL)
// @route   POST /api/banners or POST /api/banners/add
exports.createBanner = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    let imagePath = body.image ? body.image.toString().trim() : "";
    let webpPath = null;

    // Handle file upload via Multer
    if (req.file) {
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "banners");
        imagePath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "banners");
        imagePath = result.originalPath;
        webpPath = result.webpPath;
      }
    }

    if (!imagePath) {
      errors.push("image is required and cannot be blank. Please upload an image file or provide valid image path.");
    }

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.push("status must be either 'active' or 'inactive'.");
      }
    }

    if (errors.length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    const created_by = req.user ? req.user._id : (body.created_by || null);
    const status = body.status && ["active", "inactive"].includes(body.status.toString().toLowerCase().trim())
      ? body.status.toString().toLowerCase().trim()
      : "active";
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : status === "active";

    const newBanner = new Banner({
      title: body.title ? body.title.toString().trim() : "",
      image: imagePath,
      image_webp: webpPath,
      sort_order: typeof body.sort_order !== "undefined" && !isNaN(Number(body.sort_order)) ? Number(body.sort_order) : 0,
      status,
      isActive,
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newBanner.save();

    await logActivity({
      req,
      action: "CREATE",
      module: "banners",
      record_id: newBanner._id,
      record_title: newBanner.title || "Banner Image",
      description: `Created banner '${newBanner.title || "Untitled"}'`,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Banner created successfully.",
      data: formatBanner(newBanner, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update existing banner by ID or GUID
// @route   PUT /api/banners/:id or POST /api/banners/update
exports.updateBanner = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.guid));

    if (!id || !id.toString().trim()) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Banner ID (id / _id) is required for update."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const existingBanner = await Banner.findOne(query);
    if (!existingBanner) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Banner not found or has been deleted.",
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.push("status must be either 'active' or 'inactive'.");
      } else {
        existingBanner.status = statusLower;
        existingBanner.isActive = statusLower === "active";
      }
    }

    if (body.isActive !== undefined) {
      existingBanner.isActive = Boolean(body.isActive);
      existingBanner.status = existingBanner.isActive ? "active" : "inactive";
    }

    if (errors.length > 0) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors,
      });
    }

    if (body.title !== undefined) {
      existingBanner.title = body.title ? body.title.toString().trim() : "";
    }

    // Handle Image Replacement
    if (req.file) {
      let newOriginal, newWebp;
      if (isProduction()) {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "banners");
        newOriginal = uploadResult.originalKey;
        newWebp = uploadResult.webpKey;
        if (existingBanner.image) {
          await deleteS3Objects([existingBanner.image, existingBanner.image_webp].filter(Boolean));
        }
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "banners");
        newOriginal = result.originalPath;
        newWebp = result.webpPath;
        deleteLocalImages(existingBanner.image, existingBanner.image_webp);
      }
      existingBanner.image = newOriginal;
      existingBanner.image_webp = newWebp;
    } else if (body.image && body.image.toString().trim()) {
      existingBanner.image = body.image.toString().trim();
    }

    if (typeof body.sort_order !== "undefined" && !isNaN(Number(body.sort_order))) {
      existingBanner.sort_order = Number(body.sort_order);
    }

    if (req.user) {
      existingBanner.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingBanner.updated_by = body.updated_by;
    }

    existingBanner.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingBanner.save();

    await logActivity({
      req,
      action: "UPDATE",
      module: "banners",
      record_id: existingBanner._id,
      record_title: existingBanner.title || "Banner Image",
      description: `Updated banner '${existingBanner.title || "Untitled"}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Banner updated successfully.",
      data: formatBanner(existingBanner, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete banner by ID or GUID
// @route   DELETE /api/banners/:id or POST /api/banners/delete
exports.deleteBanner = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.guid));

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Banner ID (id / _id) is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim(), is_deleted: false }
      : { guid: id.toString().trim(), is_deleted: false };

    const banner = await Banner.findOne(query);
    if (!banner) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Banner not found or already deleted.",
      });
    }

    // Soft delete according to Global Rule 5
    banner.is_deleted = true;
    banner.status = "inactive";
    banner.isActive = false;
    banner.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) banner.updated_by = req.user.id;

    await banner.save();

    await logActivity({
      req,
      action: "DELETE",
      module: "banners",
      record_id: banner._id,
      record_title: banner.title || "Banner Image",
      description: `Deleted banner '${banner.title || "Untitled"}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Banner deleted successfully.",
      data: {
        id: banner._id,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
