const ActivityLog = require("../Model/activityLog");
const moment = require("moment-timezone");

/**
 * Format activity log entry with Asia/Kolkata timestamps
 */
const formatActivity = (item) => {
  const doc = item._doc || item;
  return {
    _id: doc._id,
    user: doc.user,
    user_name: doc.user_name,
    user_email: doc.user_email,
    role_name: doc.role_name,
    action: doc.action,
    module: doc.module,
    record_id: doc.record_id,
    record_title: doc.record_title,
    description: doc.description,
    changes: doc.changes,
    ip_address: doc.ip_address,
    created_at: moment(doc.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
  };
};

// @desc    Get all activity logs with filters (Super Admin Only)
// @route   GET /api/activity-logs or POST /api/activity-logs/list
exports.getActivityLogs = async (req, res, next) => {
  try {
    const queryParams = req.method === "POST" ? req.body : req.query;
    const {
      page = 1,
      limit = 15,
      role_name,
      role,
      module: mod,
      action,
      search,
      user_id,
      from_date,
      to_date,
      sort_by = "created_at",
      sort_order = "desc",
    } = queryParams || {};

    const filter = {};

    const targetRole = role_name || role;
    if (targetRole && targetRole !== "all") {
      const normalizedRole = targetRole.toLowerCase().trim();
      if (normalizedRole === "admin" || normalizedRole === "super_admin") {
        filter.role_name = { $in: ["admin", "super_admin", "Admin", "Super Admin", "Super_Admin"] };
      } else {
        filter.role_name = new RegExp(`^${normalizedRole}$`, "i");
      }
    }

    if (mod && mod !== "all") {
      const cleanMod = mod.toLowerCase().trim().replace(/s$/, "");
      filter.module = { $regex: new RegExp(`^${cleanMod}s?$`, "i") };
    }

    if (action && action !== "all") {
      filter.action = action.toUpperCase().trim();
    }

    if (user_id) {
      filter.user = user_id;
    }

    if (from_date || to_date) {
      filter.created_at = {};
      if (from_date) {
        filter.created_at.$gte = moment.tz(from_date, "Asia/Kolkata").startOf("day").toDate();
      }
      if (to_date) {
        filter.created_at.$lte = moment.tz(to_date, "Asia/Kolkata").endOf("day").toDate();
      }
    }

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      filter.$or = [
        { user_name: searchRegex },
        { user_email: searchRegex },
        { description: searchRegex },
        { record_title: searchRegex },
        { module: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page) || 1);
    const pageLimit = Math.max(1, parseInt(limit) || 20);
    const skip = (pageNum - 1) * pageLimit;

    const sortDirection = sort_order === "asc" ? 1 : -1;

    const [logs, totalCount] = await Promise.all([
      ActivityLog.find(filter)
        .populate("user", "first_name last_name email mobile role")
        .sort({ [sort_by]: sortDirection })
        .skip(skip)
        .limit(pageLimit),
      ActivityLog.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / pageLimit) || 1;

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Activity logs fetched successfully.",
      data: logs.map(formatActivity),
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
