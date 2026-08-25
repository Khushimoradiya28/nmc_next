const Tag = require("../Model/tag");
const { generateSlug } = require('../helper');
const moment = require("moment-timezone");

exports.addTag = async (req, res, next) => {
    try {
        const { tag_name, status } = req.body;

        // Validate
        if (!tag_name) {
            return res.status(400).json({
                status: 400,
                error: { tag_name: ["tag_name is required"] }
            });
        }

        // Generate slug
        const slug_name = generateSlug(tag_name);

        // Check for existing active tag
        if (status === 1) {
            const activeTag = await Tag.findOne({ slug_name, status: 1 });
            if (activeTag) {
                return res.status(400).json({
                    status: 400,
                    message: `Active tag "${tag_name}" already exists`
                });
            }
        }

        // Check for existing inactive tag
        const inactiveTag = await Tag.findOne({ slug_name, status: 0 });
        if (inactiveTag) {
            // Reactivate it
            inactiveTag.status = status; // usually 1
            inactiveTag.updated_at = Date.now();
            const tag = await inactiveTag.save();
            return res.status(200).json({
                status: 200,
                message: `Tag "${tag_name}" reactivated`,
                data: tag
            });
        }

        // Otherwise, create new tag
        const tag = await Tag.create({
            ...req.body,
            slug_name
        });

        res.status(200).json({
            status: 200,
            message: "Tag added successfully",
            data: tag
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllTag = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order, _id} = req.body;

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
            query.tag_name = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let tagQuery = Tag.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            tagQuery = tagQuery.limit(pageLimit);
        }

        const tag = await tagQuery;
        const count = await Tag.countDocuments(query);
        const tagList = tag.map((item) => {

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
            message: "Tag fetched successfully",
            status: 200,
            count,
            data: tagList,
        });
    } catch (error) {
        next(error);
    }

};

exports.updateTag = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, tag_name, ...rest } = req.body;

        const updateData = {};

        // Only update fields that are provided
        if (tag_name !== undefined) {
            updateData.tag_name = tag_name;
            updateData.slug_name = generateSlug(tag_name);
        }

        Object.keys(rest).forEach((key) => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== "") {
                updateData[key] = rest[key];
            }
        });

        updateData.updated_at = Date.now();

        // ✅ Check for duplicate tag_name (case-insensitive, excluding current tag)
        if (tag_name) {
            const existingTag = await Tag.findOne({
                tag_name: { $regex: `^${tag_name}$`, $options: "i" },
                _id: { $ne: id }
            });
            if (existingTag) {
                return res.status(400).json({
                    status: 400,
                    error: { tag_name: ["Tag name already exists."] }
                });
            }
        }

        const tag = await Tag.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!tag) {
            return res.status(404).json({
                status: 404,
                error: { id: ["Tag not found."] }
            });
        }

        res.status(200).json({
            status: 200,
            message: "Tag updated successfully",
            data: tag
        });

    } catch (err) {
        next(err); // pass other errors to global handler
    }
};

exports.deleteTag = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const tag = await Tag.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!tag) {
            return res.status(404).json({ message: "tag not found" });
        }
        res.status(200).json({ status: 200, message: "Tag deleted successfully", data: tag });
    } catch (error) {
        next(error);
    }
};