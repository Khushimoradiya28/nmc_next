const ActivityLog = require("../Model/activityLog");
const moment = require("moment-timezone");
const logger = require("./logger");

/**
 * Record an activity in the database
 * @param {Object} params
 * @param {Object} params.req - Express request object containing logged-in user
 * @param {string} params.action - CREATE | UPDATE | DELETE | STATUS_CHANGE
 * @param {string} params.module - banners | gallery | testimonials | awards | certificate_courses | academic_programs | faculty | users
 * @param {string} [params.record_id] - ID of the affected document
 * @param {string} [params.record_title] - Name/title of the affected record
 * @param {string} params.description - Human-readable description of what changed
 * @param {Object} [params.changes] - Payload or metadata about changes
 */
const logActivity = async ({
  req,
  action,
  module: modName,
  record_id = null,
  record_title = "",
  description,
  changes = null,
}) => {
  try {
    const user = req && req.user ? req.user : null;
    if (!user || !user.id) return; // Ignore unauthenticated actions

    const userName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "Staff User";
    const userEmail = user.email || "";
    const roleName = (user.role_name || user.role || "staff").toString().toLowerCase().trim();

    const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || null;

    const logEntry = new ActivityLog({
      user: user.id,
      user_name: userName,
      user_email: userEmail,
      role_name: ["super_admin", "admin", "department", "content"].includes(roleName) ? roleName : "department",
      action: action.toUpperCase(),
      module: modName.toLowerCase(),
      record_id: record_id ? record_id.toString() : null,
      record_title: record_title || "",
      description: description || `${action} action performed on ${modName}`,
      changes,
      ip_address: ip,
      created_at: moment().tz("Asia/Kolkata").toDate(),
    });

    await logEntry.save();
  } catch (error) {
    logger.warn("[ActivityLogger] Error logging activity:", error.message);
  }
};

module.exports = { logActivity };
