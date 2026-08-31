const User = require("../Model/user");
const Role = require("../Model/role");

/**
 * Middleware to restrict route access by role
 * @param {string[]} allowedRoles - Array of allowed role names (e.g. ['super_admin', 'admin'])
 */
const requireRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Authentication required. Please provide a valid token.",
        });
      }

      // Fetch user and role from database to get fresh role data
      const user = await User.findById(req.user.id).populate("role");
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "User account not found.",
        });
      }

      // Extract role name
      let userRoleName = "";
      if (user.role && typeof user.role === "object" && user.role.role_name) {
        userRoleName = user.role.role_name.toLowerCase().trim();
      } else if (req.user.role_name) {
        userRoleName = req.user.role_name.toLowerCase().trim();
      }

      // Map alias like 'admin' -> 'super_admin'
      if (userRoleName === "admin") userRoleName = "super_admin";

      // Attach detailed user & role to request
      req.user.role_name = userRoleName;
      req.user.first_name = user.first_name;
      req.user.last_name = user.last_name;
      req.user.email = user.email;

      const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase().trim());

      // If user is super_admin, grant full access
      if (userRoleName === "super_admin") {
        return next();
      }

      if (!normalizedAllowed.includes(userRoleName)) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: `Access denied. Users with '${userRoleName}' role are not permitted to perform this operation.`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { requireRole };
