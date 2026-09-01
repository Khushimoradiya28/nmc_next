const Faculty = require("../Model/faculty");
const config = require("../Config/app");
const { generateSlug } = require("../helper");
const {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
} = require("../Utils/imageProcessor");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format faculty record for client response with full image URLs
 */
const formatFaculty = (item, req) => {
  const doc = item._doc || item;
  let fullPhotoUrl = doc.photo_webp || doc.photo || doc.photo_url || doc.image_url || doc.image || "";

  if (fullPhotoUrl && !fullPhotoUrl.startsWith("http")) {
    const baseUrl = req ? `${req.protocol}://${req.get("host")}` : "http://localhost:5000";
    fullPhotoUrl = `${baseUrl}/${fullPhotoUrl.replace(/\\/g, "/").replace(/^\/+/, "")}`;
  }

  return {
    ...doc,
    photo: fullPhotoUrl,
    photo_url: fullPhotoUrl,
    photo_webp: fullPhotoUrl,
    photo_webp_url: fullPhotoUrl,
    image: fullPhotoUrl,
    image_url: fullPhotoUrl,
    image_webp_url: fullPhotoUrl,
  };
};

// Get all faculty members with filtering, search, and pagination
exports.getFacultyMembers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search = "",
      department = "",
      status = "",
      sortBy = "sortOrder",
      sortOrder = "asc",
    } = req.query;

    const query = { is_deleted: false };

    // Status filter
    if (status && status !== "all") {
      if (status === "active") {
        query.$or = [{ status: "active" }, { isActive: true }, { is_active: 1 }];
      } else if (status === "inactive") {
        query.$or = [{ status: "inactive" }, { isActive: false }, { is_active: 0 }];
      } else {
        query.status = status;
      }
    }

    // Department filter
    if (department && department !== "all") {
      query.department = { $regex: new RegExp(department, "i") };
    }

    // Search filter
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullName: searchRegex },
        { designation: searchRegex },
        { qualifications: searchRegex },
        { department: searchRegex },
        { keyHighlight: searchRegex },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    if (sortBy !== "created_at") {
      sortOptions.created_at = -1;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [facultyList, total] = await Promise.all([
      Faculty.find(query).sort(sortOptions).skip(skip).limit(limitNum).lean(),
      Faculty.countDocuments(query),
    ]);

    const formattedList = facultyList.map((item) => formatFaculty(item, req));

    res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty members fetched successfully",
      data: formattedList,
      meta: {
        total_records: total,
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
    });
  } catch (error) {
    console.error("Error in getFacultyMembers:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error fetching faculty members",
      error: error.message,
    });
  }
};

exports.getAllFaculty = exports.getFacultyMembers;

// Get single faculty member by ID or slug
exports.getFacultyByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let faculty;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      faculty = await Faculty.findOne({ _id: idOrSlug, is_deleted: false }).lean();
    } else {
      faculty = await Faculty.findOne({
        $or: [{ slug: idOrSlug }, { guid: idOrSlug }],
        is_deleted: false,
      }).lean();
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found",
      });
    }

    res.status(200).json({
      success: true,
      status: 200,
      data: formatFaculty(faculty, req),
    });
  } catch (error) {
    console.error("Error in getFacultyByIdOrSlug:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error fetching faculty member",
      error: error.message,
    });
  }
};

// Create new faculty member
exports.createFaculty = async (req, res) => {
  try {
    const facultyData = { ...req.body };

    // Image Upload processing (matches req.file from multer)
    if (req.file) {
      if (isProduction()) {
        const processed = await uploadToS3AndCreateWebp(req.file, "faculty");
        facultyData.photo = processed.originalLocation || processed.originalKey;
        facultyData.photo_webp = processed.webpLocation || processed.webpKey;
      } else {
        const processed = await saveLocalAndCreateWebp(req.file, "faculty");
        facultyData.photo = processed.originalPath || processed.originalRelativePath;
        facultyData.photo_webp = processed.webpPath || processed.webpRelativePath;
      }
    } else if (facultyData.photo && typeof facultyData.photo === "string" && facultyData.photo.startsWith("http")) {
      // Keep existing photo if passed as URL string
      facultyData.photo_webp = facultyData.photo;
    }

    if (typeof facultyData.expertise === "string") {
      try {
        facultyData.expertise = JSON.parse(facultyData.expertise);
      } catch {
        facultyData.expertise = facultyData.expertise.split("\n").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (facultyData.status) {
      facultyData.isActive = facultyData.status === "active";
      facultyData.is_active = facultyData.status === "active" ? 1 : 0;
    }

    if (facultyData.fullName && !facultyData.slug) {
      let generatedSlug = generateSlug(facultyData.fullName.trim());
      let uniqueSlug = generatedSlug;
      let counter = 1;
      while (await Faculty.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${generatedSlug}-${counter}`;
        counter++;
      }
      facultyData.slug = uniqueSlug;
    }

    const faculty = new Faculty(facultyData);
    await faculty.save();

    res.status(201).json({
      success: true,
      status: 201,
      message: "Faculty member created successfully",
      data: formatFaculty(faculty, req),
    });
  } catch (error) {
    console.error("Error in createFaculty:", error);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Error creating faculty member",
      error: error.message,
    });
  }
};

// Update faculty member
exports.updateFaculty = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const updateData = { ...req.body };

    let faculty;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      faculty = await Faculty.findOne({ _id: idOrSlug, is_deleted: false });
    } else {
      faculty = await Faculty.findOne({
        $or: [{ slug: idOrSlug }, { guid: idOrSlug }],
        is_deleted: false,
      });
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found",
      });
    }

    // Image Upload processing for update
    if (req.file) {
      if (isProduction()) {
        if (faculty.photo) await deleteS3Objects([faculty.photo]);
        if (faculty.photo_webp) await deleteS3Objects([faculty.photo_webp]);

        const processed = await uploadToS3AndCreateWebp(req.file, "faculty");
        updateData.photo = processed.originalLocation || processed.originalKey;
        updateData.photo_webp = processed.webpLocation || processed.webpKey;
      } else {
        if (faculty.photo) deleteLocalImages(faculty.photo);
        if (faculty.photo_webp) deleteLocalImages(faculty.photo_webp);

        const processed = await saveLocalAndCreateWebp(req.file, "faculty");
        updateData.photo = processed.originalPath || processed.originalRelativePath;
        updateData.photo_webp = processed.webpPath || processed.webpRelativePath;
      }
    } else {
      const explicitImg = (updateData.photo || updateData.photo_url || updateData.image || "").toString().trim();
      if (explicitImg && explicitImg.startsWith("http")) {
        updateData.photo = explicitImg;
        updateData.photo_webp = explicitImg;
      }
    }

    if (typeof updateData.expertise === "string") {
      try {
        updateData.expertise = JSON.parse(updateData.expertise);
      } catch {
        updateData.expertise = updateData.expertise.split("\n").map((s) => s.trim()).filter(Boolean);
      }
    }

    if (updateData.status) {
      updateData.isActive = updateData.status === "active";
      updateData.is_active = updateData.status === "active" ? 1 : 0;
    } else if (updateData.is_active !== undefined) {
      const isActive = updateData.is_active === 1 || updateData.is_active === "1" || updateData.is_active === true;
      updateData.isActive = isActive;
      updateData.status = isActive ? "active" : "inactive";
    }

    Object.assign(faculty, updateData);
    faculty.updated_at = new Date();
    await faculty.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty member updated successfully",
      data: formatFaculty(faculty, req),
    });
  } catch (error) {
    console.error("Error in updateFaculty:", error);
    res.status(400).json({
      success: false,
      status: 400,
      message: "Error updating faculty member",
      error: error.message,
    });
  }
};

// Soft delete faculty member
exports.deleteFaculty = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    let faculty;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      faculty = await Faculty.findOne({ _id: idOrSlug, is_deleted: false });
    } else {
      faculty = await Faculty.findOne({
        $or: [{ slug: idOrSlug }, { guid: idOrSlug }],
        is_deleted: false,
      });
    }

    if (!faculty) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Faculty member not found",
      });
    }

    faculty.is_deleted = true;
    faculty.updated_at = new Date();
    await faculty.save();

    res.status(200).json({
      success: true,
      status: 200,
      message: "Faculty member deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteFaculty:", error);
    res.status(500).json({
      success: false,
      status: 500,
      message: "Error deleting faculty member",
      error: error.message,
    });
  }
};
