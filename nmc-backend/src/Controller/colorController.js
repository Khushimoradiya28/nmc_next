const Color = require("../Model/color");
const moment = require("moment-timezone");

exports.addColor = async (req, res, next) => {
    try {
        const color = await Color.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Color added successfully",
            data: color,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllColors = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order,_id} = req.body || {};

        let statusFilter;
        if (Array.isArray(status)) {
            statusFilter = status.length ? status : [1, 0];
        } else if (status !== undefined && status !== null && status !== "") {
            statusFilter = [Number(status)]; 
        } else {
            statusFilter = [1]; 
        }
        let query = { status: { $in: statusFilter } };
        if (_id) {
            query._id = _id;
        }
        if (search) {
            query.color_name = { $regex: search, $options: "i" };    
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let colorQuery = Color.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            colorQuery = colorQuery.limit(pageLimit);
        }

        const colors = await colorQuery;
        const count = await Color.countDocuments(query);

         const colorsList = colors.map((item) => {
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
            message: "Colors fetched successfully",
            status:200, 
            count,
            data: colorsList,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateColor = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, color_name, color_code,updated_by, status } = req.body;

        const updateData = {};
        if (color_name !== undefined) updateData.color_name = color_name;
        if (color_code !== undefined) updateData.color_code = color_code;
        if (updated_by !== undefined) updateData.updated_by = updated_by;
        if (status !== undefined) updateData.status = status;
        updateData.updated_at = Date.now();

        const color = await Color.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!color) return res.status(404).json({ message: "Color not found" });

        res.status(200).json({
            status:200, 
            message: "Color updated successfully", 
            data: color 
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteColor = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const color = await Color.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!color) {
            return res.status(404).json({ message: "Color not found" });
        }
        res.status(200).json({status:200, message: "Color deleted successfully", data: color });
    } catch (error) {
        next(error);
    }
};