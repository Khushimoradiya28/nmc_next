const Role = require("../Model/role");

exports.addRole = async (req, res, next) => {
    try {
        const { role_name, created_by } = req.body;

        // Check if ACTIVE record exists
        const activeRole = await Role.findOne({ role_name, status: 1 });
        if (activeRole) {
            return res.status(400).json({
                status: 400,
                message: `Role "${role_name}" already exists`,
            });
        }

        // Check if INACTIVE record exists
        const inactiveRole = await Role.findOne({ role_name, status: 0 });
        if (inactiveRole) {
            inactiveRole.status = 1;
            inactiveRole.updated_at = new Date();
            inactiveRole.updated_by = created_by || null;

            await inactiveRole.save();

            return res.status(200).json({
                status: 200,
                message: `Role added successfully`,
                data: inactiveRole
            });
        }

        // Else create a new role
        const newRole = await Role.create(req.body);

        return res.status(200).json({
            status: 200,
            message: "Role added successfully",
            data: newRole
        });

    } catch (err) {
        next(err);
    }
};


exports.getAllRoles = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order, _id } = req.body || {};

        let statusFilter;
            if (Array.isArray(status)) {
            statusFilter = status.length ? status : [1, 0];
            } else if (status !== undefined && status !== null && status !== "") {
            statusFilter = [Number(status)];  // convert single value into array
            } else {
            statusFilter = [1];
            }
        let query = { status: { $in: statusFilter } };

        if (_id) {
            query._id = _id;
        }

        if (search) {
            query.role_name = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let roleQuery = Role.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            roleQuery = roleQuery.limit(pageLimit);
        }

        const roles = await roleQuery;
        const count = await Role.countDocuments(query);

        res.status(200).json({
            message: "Roles fetched successfully",
            status: 200,
            count,
            data: roles,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateRole = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, role_name, status } = req.body;

        const updateData = {};
        if (role_name !== undefined) updateData.role_name = role_name;
        if (status !== undefined) updateData.status = status;
        updateData.updated_at = Date.now();

        const role = await Role.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!role) return res.status(404).json({ message: "Role not found" });

        res.status(200).json({
            status: 200,
            message: "Role updated successfully",
            data: role
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteRole = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const role = await Role.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!role) {
            return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json({status:200, message: "Role deleted successfully", data: role });
    } catch (error) {
        next(error);
    }
};