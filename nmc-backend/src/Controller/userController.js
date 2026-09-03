const User = require("../Model/user");
const Role = require("../Model/role");
const moment = require("moment-timezone");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
  resolvePublicMediaUrl,
} = require("../Utils/imageProcessor");
const { logActivity } = require("../Utils/activityLogger");

const isProduction = () => config.NODE_ENV === "production";

/**
 * Format user output with full URLs (S3 or local) and Asia/Kolkata timestamps
 */
const formatUser = (user, req) => {
  const doc = user._doc || user;

  const profileImgUrl = resolvePublicMediaUrl(doc.profile_img, req);
  const profileImgWebpUrl = resolvePublicMediaUrl(doc.profile_img_webp, req) || profileImgUrl;

  let roleInfo = null;
  if (doc.role && typeof doc.role === "object") {
    roleInfo = {
      _id: doc.role._id,
      role_name: doc.role.role_name,
    };
  }

  return {
    _id: doc._id,
    first_name: doc.first_name || "",
    last_name: doc.last_name || "",
    email: doc.email || "",
    mobile: doc.mobile || "",
    role: roleInfo || doc.role,
    role_name: doc.role?.role_name || null,
    profile_img: doc.profile_img || null,
    profile_img_webp: doc.profile_img_webp || null,
    profile_img_url: profileImgUrl,
    profile_img_webp_url: profileImgWebpUrl,
    image: profileImgWebpUrl || profileImgUrl || doc.profile_img || null,
    status: doc.status || "1",
    guid: doc.guid,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
    updated_at: moment(doc.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

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

// @desc    Get all staff/admin users (Super Admin Only)
// @route   GET /api/user/list or POST /api/user/list
exports.getAllUsers = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 10,
      search,
      status,
      role_id,
      role_name,
      sort_by = "created_at",
      sort_order = "desc",
    } = queryParams || {};

    const query = {};

    const targetId = queryParams?._id || queryParams?.id;
    if (targetId) {
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(targetId.toString().trim());
      if (isMongoId) {
        query._id = targetId.toString().trim();
      } else {
        query.guid = targetId.toString().trim();
      }
    }

    if (status && status !== "all") {
      query.status = status.toString().trim();
    }

    if (role_id) {
      query.role = role_id;
    } else if (role_name && role_name !== "all") {
      const targetRole = await Role.findOne({
        role_name: { $regex: new RegExp(`^${role_name.trim()}$`, "i") },
      });
      if (targetRole) {
        query.role = targetRole._id;
      }
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { first_name: searchRegex },
        { last_name: searchRegex },
        { email: searchRegex },
        { mobile: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 10);
    const skip = (pageNum - 1) * pageLimit;
    const sortDirection = sort_order === "asc" ? 1 : -1;

    const [users, totalCount] = await Promise.all([
      User.find(query)
        .populate("role", "role_name")
        .sort({ [sort_by]: sortDirection })
        .skip(skip)
        .limit(pageLimit),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Users fetched successfully.",
      data: users.map((u) => formatUser(u, req)),
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

// @desc    Get single user by ID
// @route   GET /api/user/:id
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["User ID is required."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim() }
      : { guid: id.toString().trim() };

    const user = await User.findOne(query).populate("role", "role_name");
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User fetched successfully.",
      data: formatUser(user, req),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new staff user with role (Super Admin Only)
// @route   POST /api/user/add or POST /api/user
exports.addUser = async (req, res, next) => {
  try {
    const body = req.body || {};
    const errors = [];

    const email = body.email ? body.email.toString().toLowerCase().trim() : "";
    const mobile = body.mobile ? body.mobile.toString().trim() : "";
    const password = body.password ? body.password.toString().trim() : "";
    const roleInput = body.role_name || body.role_id || body.role;

    const first_name = body.first_name ? body.first_name.toString().trim() : "";
    const last_name = body.last_name ? body.last_name.toString().trim() : "";

    if (!first_name) {
      errors.push("first_name is required and cannot be blank.");
    } else if (!/^[A-Za-z\s]+$/.test(first_name)) {
      errors.push("first_name must contain letters only.");
    }

    if (!last_name) {
      errors.push("last_name is required and cannot be blank.");
    } else if (!/^[A-Za-z\s]+$/.test(last_name)) {
      errors.push("last_name must contain letters only.");
    }

    if (!email) errors.push("email is required and cannot be blank.");
    if (!mobile) {
      errors.push("mobile is required and cannot be blank.");
    } else if (!/^\d{10}$/.test(mobile)) {
      errors.push("mobile must be exactly 10 digits.");
    }
    if (!password) errors.push("password is required and cannot be blank (min 6 chars).");
    if (password && password.length < 6) errors.push("password must be at least 6 characters long.");
    if (!roleInput) errors.push("role_name or role_id is required ('super_admin', 'department', 'content').");

    // Resolve Role
    let roleDoc = null;
    if (roleInput) {
      const isId = /^[0-9a-fA-F]{24}$/.test(roleInput.toString().trim());
      if (isId) {
        roleDoc = await Role.findById(roleInput.toString().trim());
      } else {
        const normalizedRole = roleInput.toString().trim();
        roleDoc = await Role.findOne({
          role_name: { $regex: new RegExp(`^${normalizedRole}$`, "i") },
        });

        // Auto-create role if it doesn't exist
        if (!roleDoc && ["super_admin", "admin", "department", "content"].includes(normalizedRole.toLowerCase())) {
          roleDoc = await Role.create({
            role_name: normalizedRole,
            status: 1,
          });
        }
      }
    }

    if (!roleDoc) {
      errors.push("Invalid role specified. Supported roles: 'super_admin', 'department', 'content'.");
    }

    // Check duplicate email / mobile
    const orConditions = [];
    if (email) orConditions.push({ email });
    if (mobile) orConditions.push({ mobile });

    if (orConditions.length > 0) {
      const existing = await User.findOne({ $or: orConditions });
      if (existing) {
        if (existing.email === email) errors.push("A user with this email address already exists.");
        if (mobile && existing.mobile === mobile) errors.push("A user with this mobile number already exists.");
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

    let profilePath = null;
    let profileWebpPath = null;

    if (req.file) {
      const uploadResult = await uploadToS3AndCreateWebp(req.file, "profile");
      profilePath = uploadResult.originalKey || uploadResult.originalPath;
      profileWebpPath = uploadResult.webpKey || uploadResult.webpPath;
    }

    const newUser = new User({
      first_name: body.first_name ? body.first_name.toString().trim() : "",
      last_name: body.last_name ? body.last_name.toString().trim() : "",
      email,
      mobile: mobile || undefined,
      password,
      role: roleDoc._id,
      profile_img: profilePath,
      profile_img_webp: profileWebpPath,
      status: body.status !== undefined ? body.status.toString().trim() : "1",
      created_by: req.user ? req.user.id : null,
      updated_by: req.user ? req.user.id : null,
      created_at: moment().tz("Asia/Kolkata").toDate(),
      updated_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await newUser.save();

    // Log Activity
    await logActivity({
      req,
      action: "CREATE",
      module: "users",
      record_id: newUser._id,
      record_title: `${newUser.first_name} ${newUser.last_name} (${roleDoc.role_name})`,
      description: `Created new user account with role '${roleDoc.role_name}'`,
    });

    return res.status(201).json({
      success: true,
      status: 201,
      message: "User created successfully.",
      data: formatUser(await User.findById(newUser._id).populate("role", "role_name"), req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Update user details, role or status (Super Admin Only)
// @route   PUT /api/user/update or POST /api/user/update or PUT /api/user/:id
exports.updateUser = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id));

    if (!id || !id.toString().trim()) {
      deleteUploadedTemp(req.file);
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["User ID (id / _id) is required for update."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim() }
      : { guid: id.toString().trim() };

    const existingUser = await User.findOne(query);
    if (!existingUser) {
      deleteUploadedTemp(req.file);
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    const body = req.body || {};
    const errors = [];

    // Role update
    const roleInput = body.role_name || body.role_id || body.role;
    if (roleInput) {
      const isId = /^[0-9a-fA-F]{24}$/.test(roleInput.toString().trim());
      let roleDoc = null;
      if (isId) {
        roleDoc = await Role.findById(roleInput.toString().trim());
      } else {
        roleDoc = await Role.findOne({
          role_name: { $regex: new RegExp(`^${roleInput.toString().trim()}$`, "i") },
        });
      }

      if (!roleDoc) {
        errors.push("Invalid role specified.");
      } else {
        existingUser.role = roleDoc._id;
      }
    }

    if (body.first_name !== undefined && body.first_name.toString().trim()) {
      const fn = body.first_name.toString().trim();
      if (!/^[A-Za-z\s]+$/.test(fn)) {
        errors.push("first_name must contain letters only.");
      } else {
        existingUser.first_name = fn;
      }
    }

    if (body.last_name !== undefined && body.last_name.toString().trim()) {
      const ln = body.last_name.toString().trim();
      if (!/^[A-Za-z\s]+$/.test(ln)) {
        errors.push("last_name must contain letters only.");
      } else {
        existingUser.last_name = ln;
      }
    }

    if (body.email !== undefined && body.email.toString().trim()) {
      const newEmail = body.email.toString().toLowerCase().trim();
      const duplicate = await User.findOne({ email: newEmail, _id: { $ne: existingUser._id } });
      if (duplicate) {
        errors.push("Email is already in use by another user.");
      } else {
        existingUser.email = newEmail;
      }
    }

    if (body.mobile !== undefined && body.mobile.toString().trim()) {
      const newMobile = body.mobile.toString().trim();
      const duplicate = await User.findOne({ mobile: newMobile, _id: { $ne: existingUser._id } });
      if (duplicate) {
        errors.push("Mobile number is already in use by another user.");
      } else {
        existingUser.mobile = newMobile;
      }
    }

    if (body.password !== undefined && body.password.toString().trim()) {
      const pass = body.password.toString().trim();
      if (pass.length < 6) {
        errors.push("Password must be at least 6 characters long.");
      } else {
        existingUser.password = pass; // will be hashed via pre-save hook
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

    if (body.first_name !== undefined) existingUser.first_name = body.first_name.toString().trim();
    if (body.last_name !== undefined) existingUser.last_name = body.last_name.toString().trim();
    if (body.status !== undefined) existingUser.status = body.status.toString().trim();

    // Handle Profile Image Replacement
    if (req.file) {
      if (existingUser.profile_img) {
        await deleteS3Objects([existingUser.profile_img, existingUser.profile_img_webp].filter(Boolean));
        deleteLocalImages(existingUser.profile_img, existingUser.profile_img_webp);
      }
      const uploadResult = await uploadToS3AndCreateWebp(req.file, "profile");
      existingUser.profile_img = uploadResult.originalKey || uploadResult.originalPath;
      existingUser.profile_img_webp = uploadResult.webpKey || uploadResult.webpPath;
    }

    if (req.user) existingUser.updated_by = req.user.id;
    existingUser.updated_at = moment().tz("Asia/Kolkata").toDate();

    await existingUser.save();

    // Log Activity
    await logActivity({
      req,
      action: "UPDATE",
      module: "users",
      record_id: existingUser._id,
      record_title: `${existingUser.first_name} ${existingUser.last_name}`,
      description: `Updated user profile/role/status`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User updated successfully.",
      data: formatUser(await User.findById(existingUser._id).populate("role", "role_name"), req),
    });
  } catch (error) {
    deleteUploadedTemp(req.file);
    next(error);
  }
};

// @desc    Delete/Deactivate user (Super Admin Only)
// @route   DELETE /api/user/:id or POST /api/user/delete
exports.deleteUser = async (req, res, next) => {
  try {
    const id =
      req.params.id ||
      (req.body && (req.body.id || req.body._id || req.body.guid)) ||
      (req.query && (req.query.id || req.query._id));

    if (!id || !id.toString().trim()) {
      return res.status(422).json({
        status: 422,
        success: false,
        message: "Validation error: Unable to process input fields",
        errors: ["User ID is required for deletion."],
      });
    }

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(id.toString().trim());
    const query = isMongoId
      ? { _id: id.toString().trim() }
      : { guid: id.toString().trim() };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found or already deleted.",
      });
    }

    // Soft delete or deactivate
    user.status = "0";
    user.updated_at = moment().tz("Asia/Kolkata").toDate();
    if (req.user) user.updated_by = req.user.id;

    await user.save();

    // Log Activity
    await logActivity({
      req,
      action: "DELETE",
      module: "users",
      record_id: user._id,
      record_title: `${user.first_name} ${user.last_name}`,
      description: `Deactivated/deleted user account`,
    });

    return res.status(200).json({
      success: true,
      status: 200,
      message: "User deleted successfully.",
      data: {
        id: user._id,
        status: user.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Roles list for dropdown in admin portal
// @route   GET /api/user/roles or GET /api/role/list
exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find({ status: 1 }).select("role_name status guid");
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Roles fetched successfully.",
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};