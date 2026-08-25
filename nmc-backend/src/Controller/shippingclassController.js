const ShippingClass = require("../Model/shippingclass");

exports.addShippingClass = async (req, res, next) => {
    try {
        const shippingclass = await ShippingClass.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Shipping Class added successfully",
            data: shippingclass,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllShippingClass = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

        const statusFilter = status && status.length ? status : [1];
        let query = { status: { $in: statusFilter } };

        if (search) {
            query.shipping_class_name = { $regex: search, $options: "i" };    
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let shippingclassQuery = ShippingClass.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            shippingclassQuery = shippingclassQuery.limit(pageLimit);
        }

        const shippingclass = await shippingclassQuery;
        const count = await ShippingClass.countDocuments(query);
        
        res.status(200).json({
            message: "Shipping class fetched successfully",
            status:200, 
            count,
            data: shippingclass,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteShippingClass = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const shippingclass = await ShippingClass.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!shippingclass) {
            return res.status(404).json({ message: "Shipping Class not found" });
        }
        res.status(200).json({status:200, message: "Shipping Class deleted successfully", data: shippingclass });
    } catch (error) {
        next(error);
    }
};