const ShippingMethod = require("../Model/shippingmethod");

exports.addShippingMethod = async (req, res, next) => {
    try {
        const shippingmethod = await ShippingMethod.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Shipping Method added successfully",
            data: shippingmethod,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllShippingMethod = async (req, res, next) => {
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

        let shippingmethodQuery = ShippingMethod.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            shippingmethodQuery = shippingmethodQuery.limit(pageLimit);
        }

        const shippingmethod = await shippingmethodQuery;
        const count = await ShippingMethod.countDocuments(query);
        
        res.status(200).json({
            message: "Shipping class fetched successfully",
            status:200, 
            count,
            data: shippingmethod,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteShippingMethod = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const shippingmethod = await ShippingMethod.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!shippingmethod ) {
            return res.status(404).json({ message: "Shipping Method not found" });
        }
        res.status(200).json({status:200, message: "Shipping Method deleted successfully", data: shippingmethod });
    } catch (error) {
        next(error);
    }
};