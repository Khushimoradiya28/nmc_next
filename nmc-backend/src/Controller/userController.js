const User = require("../Model/user");
const Role = require("../Model/role");
const Order = require("../Model/productOrder");

const ProfileImage = require("../Model/profileImage");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects, copyImage } = require("../Utils/imageProcessor");

exports.addUser = async (req, res, next) => {
  try {
    const body = req.body || {};

    Object.keys(body).forEach(key => {
      body[key.toLowerCase()] = body[key];
    });

    if (!body.mobile) {
      return res.status(400).json({
        status: 400,
        message: "Mobile number is required",
      });
    }

    const orConditions = [];
    if (body.email) orConditions.push({ email: body.email });
    if (body.mobile) orConditions.push({ mobile: body.mobile });

    const existingUser = await User.findOne({
      $or: orConditions,
    });

    if (existingUser) {
      if (req.file && config.NODE_ENV !== "production") {
        // delete local file if created by multer
        const imagePath = path.join(__dirname, "../media/profile", req.file.filename);
        if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }
      return res.status(400).json({
        status: 400,
        message:
          existingUser.email === body.email
            ? "Email already exists"
            : "Mobile number already exists",
      });
    }

    body.utm_source || req.body.USOURCE || null;
    body.utm_medium || req.body.UMEDIUM || null;
    body.utm_campaign || req.body.UCAMPAIGN || null;
    body.utm_content || req.body.UCONTENT || null;
    body.utm_term || req.body.UTERM || null;

    body.ireferrer || req.body.IREFERRER || null;
    body.lreferrer || req.body.LREFERRER || null;
    body.ilandingpage || req.body.ILANDPAGE || null;
    body.visits ? parseInt(req.body.visits) : (req.body.VISITS ? parseInt(req.body.VISITS) : 0);

    let roleDoc = null;
    if (body.role_id) {
      roleDoc = await Role.findById(body.role_id);
      if (!roleDoc) {
        return res.status(400).json({
          status: 400,
          message: "Invalid role_id"
        });
      }
    }

    body.role = roleDoc ? roleDoc._id : null;

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "profile");
        body.profile_img = uploadResult.originalKey;
        body.profile_img_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "profile");
        body.profile_img = result.originalPath;
        body.profile_img_webp = result.webpPath;
      }
    }

    const user = await User.create(body);

    res.status(200).json({
      status: 200,
      message: "User created successfully",
      data: user,
    });

  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, _id, role_id, is_keep_update } = req.body || {};

    const statusFilter = status && status.length ? status : ["1", "0"];
    let query = { status: { $in: statusFilter } };

    if (_id) {
      query._id = _id;
    }

    if (role_id) {
      query.role = role_id;
    }

    if (is_keep_update) {
      query.is_keep_update = is_keep_update;
    }

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let userQuery = User.find(query)
      .populate("role", "role_name")
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) userQuery = userQuery.limit(pageLimit);

    const user = await userQuery;
    const count = await User.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/profile";

    const users = user.map((user) => {
      const fileName = user.profile_img ? user.profile_img.split("/").pop() : null;

      return {
        ...user.toObject(),
        role_id: user.role?._id || null,
        role_name: user.role?.role_name || null,
        profile_img: fileName
          ? (config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/profile/${fileName}`
          )
          : null,
      };
    });

    res.status(200).json({
      message: "Users fetched successfully",
      status: 200,
      count,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// helper already provided by you
const getFileName = (imgPath) => {
  if (!imgPath) return null;
  return imgPath.split("/").pop();
};

const isProduction = () => config.NODE_ENV === "production";

exports.updateUser = async (req, res, next) => {

  const deleteUploadedTemp = () => {
    if (req.file && !isProduction()) {
      const uploadedFilePath = path.join(__dirname, "../media/profile", req.file.filename);
      if (fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath);
        } catch (e) {
          console.warn("Failed to delete temp file:", e.message);
        }
      }
    }
  };

  if (!req.body || !req.body.id) {
    deleteUploadedTemp();
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;
    const existingUser = await User.findById(id);
    if (!existingUser) {
      deleteUploadedTemp();
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    const fields = [
      "first_name",
      "last_name",
      "email",
      // "password",
      "birthday",
      "status",
      "is_keep_update",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    if (req.body.role_id !== undefined) {
      const roleDoc = await Role.findById(req.body.role_id);
      if (!roleDoc) {
        deleteUploadedTemp();
        return res.status(400).json({
          status: 400,
          message: "Invalid role_id",
        });
      }
      updateData.role = roleDoc._id;
    }

    if (req.file) {
      let newOriginal, newWebp;
      try {
        if (isProduction()) {
          const uploadResult = await uploadToS3AndCreateWebp(req.file, "profile");
          newOriginal = uploadResult.originalKey;
          newWebp = uploadResult.webpKey;
        } else {
          const result = await saveLocalAndCreateWebp(req.file, "profile");
          newOriginal = result.originalPath;
          newWebp = result.webpPath;
        }
      } catch (err) {
        deleteUploadedTemp();
        throw err;
      }

      const oldOriginal = existingUser.profile_img;
      const oldWebp = existingUser.profile_img_webp;
      
      try {
        if (isProduction()) {
            const keysToDelete = new Set();
            if (oldOriginal) keysToDelete.add(oldOriginal);
            if (oldWebp) keysToDelete.add(oldWebp);
  
            if (!oldWebp && oldOriginal) {
              const ext = path.extname(oldOriginal);
              const derived = oldOriginal.endsWith(ext) ? oldOriginal.replace(new RegExp(`${ext}$`), ".webp") : oldOriginal + ".webp";
              keysToDelete.add(derived);
            }
  
            const keys = Array.from(keysToDelete).filter(Boolean);
            if (keys.length > 0) await deleteS3Objects(keys);
          } else {
            deleteLocalImages(oldOriginal, oldWebp);
          }
      } catch (err) {
          console.warn("Failed to delete old images:", err.message);
      }

      updateData.profile_img = newOriginal;
      updateData.profile_img_webp = newWebp;
    } else if (req.body.profile_image_id) {
        // Handle Default Cartoon Selection
        const cartoonImage = await ProfileImage.findById(req.body.profile_image_id);
        if (!cartoonImage) {
            return res.status(400).json({ status: 400, message: "Invalid profile_image_id" });
        }

        let newOriginal, newWebp;
        try {
            const copied = await copyImage(cartoonImage.image_url, "profile");
            newOriginal = copied.original;
            newWebp = copied.webp;
        } catch (err) {
            console.error("Failed to copy profile image:", err);
             // Proceed without failing everything? Or fail? Best to fail if image selection was explicit.
             return res.status(500).json({ status: 500, message: "Failed to set profile image" });
        }
        
        const oldOriginal = existingUser.profile_img;
        const oldWebp = existingUser.profile_img_webp;

        try {
            if (isProduction()) {
                const keysToDelete = new Set();
                if (oldOriginal) keysToDelete.add(oldOriginal);
                if (oldWebp) keysToDelete.add(oldWebp);
      
                if (!oldWebp && oldOriginal) {
                  const ext = path.extname(oldOriginal);
                  const derived = oldOriginal.endsWith(ext) ? oldOriginal.replace(new RegExp(`${ext}$`), ".webp") : oldOriginal + ".webp";
                  keysToDelete.add(derived);
                }
      
                const keys = Array.from(keysToDelete).filter(Boolean);
                if (keys.length > 0) await deleteS3Objects(keys);
              } else {
                deleteLocalImages(oldOriginal, oldWebp);
              }
        } catch (err) {
            console.warn("Failed to delete old images:", err.message);
        }

        updateData.profile_img = newOriginal;
        updateData.profile_img_webp = newWebp;
    }

    updateData.updated_at = Date.now();

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query",
    });

    return res.status(200).json({
      status: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    // ensure uploaded temp removed in dev
    deleteUploadedTemp();
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {

  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { status: "0", updated_at: Date.now() },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ status: 200, message: "User deleted successfully", data: user });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomerOrder = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

    // 1. Find Customer Role to filter by it
    const customerRole = await Role.findOne({ role_name: { $regex: /^customer$/i } });
    
    // If role doesn't exist, returns empty
    if (!customerRole) {
      return res.status(200).json({
        message: "Customer role not found",
        status: 200,
        count: 0,
        data: [],
      });
    }

    const statusFilter = status && status.length ? status : ["1"];
    let query = { 
      role: customerRole._id,
      status: { $in: statusFilter } 
    };

    if (search) {
      query.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let userQuery = User.find(query)
      .populate("role", "role_name")
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) userQuery = userQuery.limit(pageLimit);

    const users = await userQuery;
    const count = await User.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/profile";

    // Process users and get order counts
    const usersWithOrderCount = await Promise.all(users.map(async (user) => {
      const fileName = user.profile_img ? user.profile_img.split("/").pop() : null;
      
      const profileImgUrl = fileName
        ? (config.NODE_ENV === "production"
          ? `${s3Url}/${fileName}`
          : `${baseUrl}/media/profile/${fileName}`
        )
        : null;

      // Count orders for this user
      const totalOrders = await Order.countDocuments({ user_id: user._id });

      return {
        ...user.toObject(),
        role_id: user.role?._id || null,
        role_name: user.role?.role_name || null,
        profile_img: profileImgUrl,
        total_orders: totalOrders
      };
    }));

    res.status(200).json({
      message: "Customer orders fetched successfully",
      status: 200,
      count,
      data: usersWithOrderCount,
    });

  } catch (error) {
    next(error);
  }
};