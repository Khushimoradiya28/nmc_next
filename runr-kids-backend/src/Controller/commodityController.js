const Commodity = require("../Model/commodity");
const moment = require("moment-timezone");

exports.addCommodity = async (req, res, next) => {
    try {
        const commodity = await Commodity.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Commodity added successfully",
            data: commodity,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllCommodity = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order,_id } = req.body || {};

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
            query.commodity_name = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let commodityQuery = Commodity.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            commodityQuery = commodityQuery.limit(pageLimit);
        }

        const commodity = await commodityQuery;
        const count = await Commodity.countDocuments(query);
        const commodityList = commodity.map((item) => {

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
            status: 200,
            message: "Commodity fetched successfully",
            total: count,
            data: commodityList,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateCommodity = async (req, res, next) => {
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

        const commodity = await Commodity.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!commodity) {
            return res.status(404).json({
                status: 404,
                error: { id: ["Commodity not found."] }
            });
        }

        res.status(200).json({
            status: 200,
            message: "Commodity updated successfully",
            data: commodity
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteCommodity = async (req, res, next) => {

    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const commodity = await Commodity.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!commodity) {
            return res.status(404).json({ message: "Commodity not found" });
        }
        res.status(200).json({ status: 200, message: "Commodity deleted successfully", data: commodity });
    } catch (error) {
        next(error);
    }
};