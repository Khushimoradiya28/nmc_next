const Skill = require("../Model/skills");
const { generateSlug } = require('../helper');
const moment = require("moment-timezone");

exports.addSkill = async (req, res, next) => {
    try {
        const { skill_name, status } = req.body || {};

        // Validate
        if (!skill_name) {
            return res.status(400).json({
                status: 400,
                error: { skill_name: ["skill_name is required"] }
            });
        }

        // Generate slug
        const slug_name = generateSlug(skill_name);

        // Check for existing active skill
        if (status === 1) {
            const activeSkill = await Skill.findOne({ slug_name, status: 1 });
            if (activeSkill) {
                return res.status(400).json({
                    status: 400,
                    message: `Active skill "${skill_name}" already exists`
                });
            }
        }

        // Check for existing inactive skill
        const inactiveSkill = await Skill.findOne({ slug_name, status: 0 });
        if (inactiveSkill) {
            // Reactivate it
            inactiveSkill.status = status; // usually 1
            inactiveSkill.updated_at = Date.now();
            const skill = await inactiveSkill.save();
            return res.status(200).json({
                status: 200,
                message: `Skill "${skill_name}" reactivated`,
                data: skill
            });
        }

        // Otherwise, create new skill
        const skill = await Skill.create({
            ...req.body,
            slug_name
        });

        res.status(200).json({
            status: 200,
            message: "Skill added successfully",
            data: skill
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllSkill = async (req, res, next) => { 
    try {
        const { status, search, limit, offset, sort_by, sort_order,_id } = req.body || {};

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
            query.skill_name = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let skillQuery = Skill.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            skillQuery = skillQuery.limit(pageLimit);
        }

        const skill = await skillQuery;
        const count = await Skill.countDocuments(query);
        const skillList = skill.map((item) => {

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
            message: "Skill fetched successfully",
            status: 200,
            count,
            data: skillList,
        });
    } catch (error) {
        next(error);
    }

};

exports.updateSkill = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, skill_name, ...rest } = req.body;

        const updateData = {};

        // Only update fields that are provided
        if (skill_name !== undefined) {
            updateData.skill_name = skill_name;
            updateData.slug_name = generateSlug(skill_name);
        }

        Object.keys(rest).forEach((key) => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== "") {
                updateData[key] = rest[key];
            }
        });

        updateData.updated_at = Date.now();

        // ✅ Check for duplicate skill_name (case-insensitive, excluding current tag)
        if (skill_name) {
            const existingSkill = await Skill.findOne({
                skill_name: { $regex: `^${skill_name}$`, $options: "i" },
                _id: { $ne: id }
            });
            if (existingSkill) {
                return res.status(400).json({
                    status: 400,
                    error: { skill_name: ["Skill name already exists."] }
                });
            }
        }

        const skill = await Skill.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!skill) {
            return res.status(404).json({
                status: 404,
                error: { id: ["Skill not found."] }
            });
        }

        res.status(200).json({
            status: 200,
            message: "Skill updated successfully",
            data: skill
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteSkill = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const skill = await Skill.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!skill) {
            return res.status(404).json({ message: "skill not found" });
        }
        res.status(200).json({ status: 200, message: "Skill deleted successfully", data: skill });
    } catch (error) {
        next(error);
    }
};