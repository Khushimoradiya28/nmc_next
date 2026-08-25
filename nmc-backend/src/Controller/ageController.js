const Age = require("../Model/age");
const { generateSlug } = require('../helper');
const moment = require("moment-timezone");

exports.addAge = async (req, res, next) => {
    try {
        const { age_group, status } = req.body || {};

        if (age_group) {
            req.body.age_slug = generateSlug(age_group);
        }

        // Check for duplicate age_group with status = 1
        if (status === 1) {
            const exists = await Age.findOne({ age_group, status: 1 });
            if (exists) {
                return res.status(400).json({
                    status: 400,
                    message: `Active age_group "${age_group}" already exists`
                });
            }
        }

        // Also check if this age_group exists with status = 0 (optional)
        const inactive = await Age.findOne({ age_group, status: 0 });
        if (inactive) {
            // Reactivate it instead of creating new document
            inactive.status = status;
            inactive.updated_at = Date.now();
            const age = await inactive.save();
            return res.status(200).json({
                status: 200,
                message: `Age group "${age_group}" reactivated`,
                data: age
            });
        }

        // Create new age group
        const age = await Age.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Age added successfully",
            data: age,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllAge = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order,type,_id } = req.body || {};

        let statusFilter;
        if (Array.isArray(status)) {
        statusFilter = status.length ? status : [1, 0];
        } else if (status !== undefined && status !== null && status !== "") {
        statusFilter = [Number(status)]; 
        } else {
        statusFilter = [1, 0];
        }
            
        let query = { status: { $in: statusFilter } };
        if (_id) {
            query._id = _id;
        }
        if (search) {
            query.age_group = { $regex: search, $options: "i" };
        }

        let selectFields = {};
        if (type) {
        selectFields[type] = 1;
        selectFields["_id"] = 1; 
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        // let ageQuery = Age.find(query)
        //     .select(selectFields)
        //     .populate({ path: "created_by", select: "first_name last_name" })
        //     .populate({ path: "updated_by", select: "first_name last_name" })
        //     .sort({ [sortField]: sortDirection })
        //     .skip(pageOffset);
        let ageQuery = Age.find(query).select(selectFields);

        //If type is passed → DO NOT populate
        if (!type) {
        ageQuery = ageQuery
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" });
        }

        ageQuery = ageQuery
        .sort({ [sortField]: sortDirection })
        .skip(pageOffset);

        if (pageLimit > 0) {
            ageQuery = ageQuery.limit(pageLimit);
        }

        const age = await ageQuery;
        const count = await Age.countDocuments(query);
        if (type) {
        return res.status(200).json({
            status: 200,
            message: "Characters fetched successfully",
            count: count,
            data: age,
        });
        }
        const ageList = age.map((item) => {

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
            message: "Age fetched successfully",
            status: 200,
            count:count,
            data: ageList,
        });
    } catch (error) {
        next(error);
    }

};

exports.updateAge = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, ...rest } = req.body;

        const updateData = {};

        Object.keys(rest).forEach((key) => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== "") {
                updateData[key] = rest[key];
            }
        });

        updateData.updated_at = Date.now();

        const age = await Age.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!age) {
            return res.status(404).json({
                status: 404,
                error: { id: ["Age not found."] }
            });
        }

        res.status(200).json({
            status: 200,
            message: "Age updated successfully",
            data: age
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteAge= async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const age = await Age.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!age) {
            return res.status(404).json({ message: "age not found" });
        }
        res.status(200).json({ status: 200, message: "Age deleted successfully", data: age });
    } catch (error) {
        next(error);
    }
};