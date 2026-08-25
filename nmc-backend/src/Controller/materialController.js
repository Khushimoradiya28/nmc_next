const Material = require("../Model/material");
const { generateSlug } = require('../helper');
const moment = require("moment-timezone");

exports.addMaterial = async (req, res, next) => {
    try {
        const { material_name, status } = req.body;

        // Validate material_name
        if (!material_name) {
            return res.status(400).json({
                status: 400,
                error: { material_name: ["material_name is required"] }
            });
        }

        // Generate slug
        const slug_name = generateSlug(material_name);

        // Check if active material already exists
        if (status === 1) {
            const activeMaterial = await Material.findOne({ slug_name, status: 1 });
            if (activeMaterial) {
                return res.status(400).json({
                    status: 400,
                    message: `Active material "${material_name}" already exists`
                });
            }
        }

        // Check if material exists but is inactive (status = 0)
        const inactiveMaterial = await Material.findOne({ slug_name, status: 0 });
        if (inactiveMaterial) {
            // Reactivate instead of creating new
            inactiveMaterial.status = status; // usually 1
            inactiveMaterial.updated_at = Date.now();
            const material = await inactiveMaterial.save();
            return res.status(200).json({
                status: 200,
                message: `Material "${material_name}" reactivated`,
                data: material
            });
        }

        // Otherwise, create new material
        const material = await Material.create({
            ...req.body,
            slug_name
        });

        res.status(200).json({
            status: 200,
            message: "Material added successfully",
            data: material
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllMaterial = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order,_id } = req.body;

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
            query.material_name = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let materialQuery = Material.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            materialQuery = materialQuery.limit(pageLimit);
        }

        const material = await materialQuery;
        const count = await Material.countDocuments(query);
        const materialList = material.map((item) => {

            return {
                ...item._doc,
                created_at: moment(item.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
                updated_at: moment(item.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
                created_by: item.created_by ? item.created_by._id : null, // just ID
                created_by_name: item.created_by
                    ? `${item.created_by.first_name} ${item.created_by.last_name}`
                    : null, // full name
                updated_by: item.updated_by ? item.updated_by._id : null,
                updated_by_name: item.updated_by
                    ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
                    : null
            };
        });

        res.status(200).json({
            message: "Material fetched successfully",
            status: 200,
            count,
            data: materialList,
        });
    } catch (error) {
        next(error);
    }
};

exports.updatedMaterial = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id, material_name, ...rest } = req.body;

        if (!id) {
            return res.status(400).json({ message: "ID is required" });
        }

        // ✅ Check duplicate name
        if (material_name) {
            const existingMaterial = await Material.findOne({
                material_name: { $regex: `^${material_name}$`, $options: 'i' },
                _id: { $ne: id }
            });

            if (existingMaterial) {
                return res.status(400).json({
                    status: 400,
                    message: "Material name already exists",
                });
            }
        }

        const updateData = {};
        Object.keys({ material_name, ...rest }).forEach((key) => {
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== "") {
                updateData[key] = req.body[key];
            }
        });

        // ✅ Auto-update slug when material_name changes
        if (material_name) {
            updateData.slug_name = generateSlug(material_name);
        }

        updateData.updated_at = Date.now();

        const updatedMaterial = await Material.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Material updated successfully",
            data: updatedMaterial
        });

    } catch (error) {
        next(err);
    }
};

exports.deleteMaterial = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const material = await Material.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!material) {
            return res.status(404).json({ message: "material not found" });
        }
        res.status(200).json({ status: 200, message: "Material deleted successfully", data: material });
    } catch (error) {
        next(error);
    }
};