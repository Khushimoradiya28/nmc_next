const Shipping = require("../Model/shipping");

exports.addShipping = async (req, res, next) => {
    try {
        const shipping = await Shipping.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Shipping added successfully",
            data: shipping,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllShipping= async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

        const statusFilter = status && status.length ? status : [1];
        let query = { status: { $in: statusFilter } };

        if (search) {
            query.shipping_rate = { $regex: search, $options: "i" };    
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let shippingQuery = Shipping.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            shippingQuery = shippingQuery.limit(pageLimit);
        }

        const shipping = await shippingQuery;
        const count = await Shipping.countDocuments(query);
        
        res.status(200).json({
            message: "Shipping  fetched successfully",
            status:200, 
            count,
            data: shipping,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteShipping = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const shipping = await Shipping.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!shipping) {
            return res.status(404).json({ message: "Shipping not found" });
        }
        res.status(200).json({status:200, message: "Shipping deleted successfully", data: shipping });
    } catch (error) {
        next(error);
    }
};