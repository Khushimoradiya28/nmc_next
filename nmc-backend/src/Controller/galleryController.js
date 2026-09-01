const Gallery = require("../Model/gallery");
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
 * Supported gallery categories map
 */
const VALID_CATEGORIES = ["campus_labs", "events_culture", "video_highlights"];

const normalizeCategory = (cat) => {
  if (!cat) return null;
  const str = cat.toString().toLowerCase().trim().replace(/[\s&/-]+/g, "_");
  if (str.includes("campus") || str.includes("lab")) return "campus_labs";
  if (str.includes("event") || str.includes("culture")) return "events_culture";
  if (str.includes("video") || str.includes("highlight")) return "video_highlights";
  if (VALID_CATEGORIES.includes(str)) return str;
  return null;
};

/**
 * Format gallery item with full accessible media URLs and Asia/Kolkata timestamps
 */
const formatGallery = (item, req) => {
  const doc = item._doc || item;
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  let mediaUrl = doc.media_file;
  let webpUrl = doc.media_file_webp;
  let thumbUrl = doc.thumbnail;

  if (doc.media_file && !doc.media_file.startsWith("http")) {
    mediaUrl = `${baseUrl}/${doc.media_file.replace(/\\/g, "/")}`;
  }
  if (doc.media_file_webp && !doc.media_file_webp.startsWith("http")) {
    webpUrl = `${baseUrl}/${doc.media_file_webp.replace(/\\/g, "/")}`;
  }
  if (doc.thumbnail && !doc.thumbnail.startsWith("http")) {
    thumbUrl = `${baseUrl}/${doc.thumbnail.replace(/\\/g, "/")}`;
  }

  return {
    _id: doc._id,
    title: doc.title || "",
    slug: doc.slug || "",
    guid: doc.guid,
    category: doc.category,
    media_type: doc.media_type,
    media_file: doc.media_file,
    media_file_webp: doc.media_file_webp || null,
    media_url: mediaUrl,
    media_file_webp_url: webpUrl,
    thumbnail: doc.thumbnail || null,
    thumbnail_url: thumbUrl,
    video_url: doc.video_url || null,
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

// @desc    Get all gallery items with category filter, pagination, search, status filter
// @route   GET /api/gallery or POST /api/gallery/list
exports.getGalleries = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      category,
      media_type,
      search,
      status,
      sort_by,
      sort_order,
    } = queryParams || {};

    const filter = { is_deleted: false };

    if (category && category !== "all") {
      const normalizedCat = normalizeCategory(category);
      if (normalizedCat) {
        filter.category = normalizedCat;
      }
    }

    if (media_type && ["image", "video"].includes(media_type.toLowerCase().trim())) {
      filter.media_type = media_type.toLowerCase().trim();
    }

    if (status && status !== "all") {
      filter.status = status.toLowerCase().trim();
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [{ title: searchRegex }, { slug: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;

    const sortField = sort_by || "sort_order";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const [items, totalCount] = await Promise.all([
      Gallery.find(filter)
        .populate("created_by", "first_name last_name email")
        .populate("updated_by", "first_name last_name email")
        .sort({ [sortField]: sortDirection, created_at: -1 })
        .skip(skip)
        .limit(pageLimit),
      Gallery.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gallery items fetched successfully.",
      data: items.map((item) => formatGallery(item, req)),
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

// @desc    Get single gallery item by ID / Slug / GUID
// @route   GET /api/gallery/:idOrSlug
exports.getGalleryById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    if (!idOrSlug || !idOrSlug.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Gallery ID or slug is required and cannot be blank."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug.toString().trim());
    const query = isMongoId
      ? { _id: idOrSlug.toString().trim(), is_deleted: false }
      : {
          $or: [
            { slug: idOrSlug.toString().toLowerCase().trim() },
            { guid: idOrSlug.toString().trim() },
          ],
          is_deleted: false,
        };

    const item = await Gallery.findOne(query)
      .populate("created_by", "first_name last_name email")
      .populate("updated_by", "first_name last_name email");

    if (!item) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Gallery item not found or has been deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gallery item fetched successfully.",
      data: formatGallery(item, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gallery item (Supports image/video upload or URL)
// @route   POST /api/gallery or POST /api/gallery/add
exports.createGallery = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const normalizedCategory = normalizeCategory(body.category);
    if (!body.category || !body.category.toString().trim()) {
      errors.push("category is required and cannot be blank. Allowed values: 'campus_labs', 'events_culture', 'video_highlights'.");
    } else if (!normalizedCategory) {
      errors.push("Invalid category. Allowed values are: 'campus_labs' (Campus & Labs), 'events_culture' (Events & Culture), 'video_highlights' (Video Highlights).");
    }

    let mediaPath = body.media_file ? body.media_file.toString().trim() : "";
    let webpPath = null;
    let detectedType = body.media_type ? body.media_type.toString().toLowerCase().trim() : "image";

    // Handle file upload via Multer
    if (req.file) {
      const ext = path.extname(req.file.originalname || "").toLowerCase();
      const isVideo = [".mp4", ".webm", ".mov", ".mkv"].includes(ext);
      detectedType = isVideo ? "video" : "image";

      const uploadResult = await uploadToS3AndCreateWebp(req.file, "gallery");
      mediaPath = uploadResult.originalKey || uploadResult.originalPath;
      webpPath = uploadResult.webpKey || uploadResult.webpPath;
    } else if (body.video_url && body.video_url.toString().trim()) {
      mediaPath = body.video_url.toString().trim();
      detectedType = "video";
    }

    if (!mediaPath) {
      errors.push("media_file or video_url is required. Please upload an image/video file or provide a video URL.");
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

    const newGallery = new Gallery({
      title: body.title ? body.title.toString().trim() : "",
      category: normalizedCategory,
      media_type: detectedType,
      media_file: mediaPath,
      media_file_webp: webpPath,
      video_url: body.video_url ? body.video_url.toString().trim() : (detectedType === "video" && mediaPath.startsWith("http") ? mediaPath : null),
      thumbnail: body.thumbnail ? body.thumbnail.toString().trim() : null,
      sort_order: typeof body.sort_order !== "undefined" && !isNaN(Number(body.sort_order)) ? Number(body.sort_order) : 0,
      status,
      isActive,
      created_by,
      updated_by: created_by,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newGallery.save();

    await logActivity({
      req,
      action: "CREATE",
      module: "gallery",
      record_id: newGallery._id,
      record_title: newGallery.title || "Gallery Item",
      description: `Added new ${newGallery.category} item '${newGallery.title || "Untitled"}'`,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "Gallery item created successfully.",
      data: formatGallery(newGallery, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update existing gallery item by ID / Slug / GUID
// @route   PUT /api/gallery/:idOrSlug or POST /api/gallery/update
exports.updateGallery = async (req, res, next) => {
  try {
    const idOrSlug =
      req.params.idOrSlug ||
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.slug || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.slug || req.query.guid));

    if (!idOrSlug || !idOrSlug.toString().trim()) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Gallery ID or slug is required for update."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug.toString().trim());
    const query = isMongoId
      ? { _id: idOrSlug.toString().trim(), is_deleted: false }
      : {
          $or: [
            { slug: idOrSlug.toString().toLowerCase().trim() },
            { guid: idOrSlug.toString().trim() },
          ],
          is_deleted: false,
        };

    const existingGallery = await Gallery.findOne(query);
    if (!existingGallery) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Gallery item not found or has been deleted.",
      });
    }

    const body = req.body || {};
    const errors = [];

    if (body.category !== undefined && body.category !== null && body.category !== "") {
      const normalizedCat = normalizeCategory(body.category);
      if (!normalizedCat) {
        errors.push("Invalid category. Allowed values: 'campus_labs', 'events_culture', 'video_highlights'.");
      } else {
        existingGallery.category = normalizedCat;
      }
    }

    if (body.status !== undefined && body.status !== null && body.status !== "") {
      const statusLower = body.status.toString().toLowerCase().trim();
      if (!["active", "inactive"].includes(statusLower)) {
        errors.push("status must be either 'active' or 'inactive'.");
      } else {
        existingGallery.status = statusLower;
        existingGallery.isActive = statusLower === "active";
      }
    }

    if (body.isActive !== undefined) {
      existingGallery.isActive = Boolean(body.isActive);
      existingGallery.status = existingGallery.isActive ? "active" : "inactive";
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
      existingGallery.title = body.title ? body.title.toString().trim() : "";
    }

    if (body.video_url !== undefined) {
      existingGallery.video_url = body.video_url ? body.video_url.toString().trim() : null;
    }

    if (body.thumbnail !== undefined) {
      existingGallery.thumbnail = body.thumbnail ? body.thumbnail.toString().trim() : null;
    }

    if (typeof body.sort_order !== "undefined" && !isNaN(Number(body.sort_order))) {
      existingGallery.sort_order = Number(body.sort_order);
    }

    // Handle File Replacement
    if (req.file) {
      const ext = path.extname(req.file.originalname || "").toLowerCase();
      const isVideo = [".mp4", ".webm", ".mov", ".mkv"].includes(ext);
      existingGallery.media_type = isVideo ? "video" : "image";

      const uploadResult = await uploadToS3AndCreateWebp(req.file, "gallery");
      const newOriginal = uploadResult.originalKey || uploadResult.originalPath;
      const newWebp = uploadResult.webpKey || uploadResult.webpPath;

      if (existingGallery.media_file) {
        await deleteS3Objects([existingGallery.media_file, existingGallery.media_file_webp].filter(Boolean));
        deleteLocalImages(existingGallery.media_file, existingGallery.media_file_webp);
      }

      existingGallery.media_file = newOriginal;
      existingGallery.media_file_webp = newWebp || null;
    } else if (body.media_file && body.media_file.toString().trim()) {
      existingGallery.media_file = body.media_file.toString().trim();
    }

    if (req.user) {
      existingGallery.updated_by = req.user._id;
    } else if (body.updated_by) {
      existingGallery.updated_by = body.updated_by;
    }

    existingGallery.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingGallery.save();

    await logActivity({
      req,
      action: "UPDATE",
      module: "gallery",
      record_id: existingGallery._id,
      record_title: existingGallery.title || "Gallery Item",
      description: `Updated ${existingGallery.category} item '${existingGallery.title || "Untitled"}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gallery item updated successfully.",
      data: formatGallery(existingGallery, req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Soft delete gallery item by ID / Slug / GUID
// @route   DELETE /api/gallery/:idOrSlug or POST /api/gallery/delete
exports.deleteGallery = async (req, res, next) => {
  try {
    const idOrSlug =
      req.params.idOrSlug ||
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.slug || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id || req.query.slug || req.query.guid));

    if (!idOrSlug || !idOrSlug.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["Gallery ID or slug is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug.toString().trim());
    const query = isMongoId
      ? { _id: idOrSlug.toString().trim(), is_deleted: false }
      : {
          $or: [
            { slug: idOrSlug.toString().toLowerCase().trim() },
            { guid: idOrSlug.toString().trim() },
          ],
          is_deleted: false,
        };

    const item = await Gallery.findOne(query);
    if (!item) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Gallery item not found or already deleted.",
      });
    }

    // Soft delete rule
    item.is_deleted = true;
    item.status = "inactive";
    item.isActive = false;
    item.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) item.updated_by = req.user.id;

    await item.save();

    await logActivity({
      req,
      action: "DELETE",
      module: "gallery",
      record_id: item._id,
      record_title: item.title || "Gallery Item",
      description: `Deleted ${item.category} item '${item.title || "Untitled"}'`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Gallery item deleted successfully.",
      data: {
        id: item._id,
        slug: item.slug,
        is_deleted: true,
      },
    });
  } catch (error) {
    next(error);
  }
};
