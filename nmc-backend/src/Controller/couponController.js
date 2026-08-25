const Coupon = require("../Model/coupon");
const moment = require("moment-timezone");

exports.addCoupon = async (req, res, next) => {
    try {
        const { coupon_code, status } = req.body;

        // Check if an active coupon with the same code already exists
        if (status === 1) {
            const activeCoupon = await Coupon.findOne({ coupon_code, status: 1 });
            if (activeCoupon) {
                return res.status(400).json({
                    status: 400,
                    message: `Active coupon "${coupon_code}" already exists`
                });
            }
        }

        // Check if a coupon exists but is inactive (status = 0)
        const inactiveCoupon = await Coupon.findOne({ coupon_code, status: 0 });
        if (inactiveCoupon) {
            // Reactivate it instead of creating a new document
            inactiveCoupon.status = status; // usually 1
            inactiveCoupon.updated_at = Date.now();
            const coupon = await inactiveCoupon.save();
            return res.status(200).json({
                status: 200,
                message: `Coupon "${coupon_code}" reactivated`,
                data: coupon
            });
        }

        // Otherwise, create a new coupon
        const coupon = await Coupon.create(req.body);
        res.status(200).json({
            status: 200,
            message: "Coupon added successfully",
            data: coupon,
        });

    } catch (err) {
        next(err);
    }
};

exports.getAllCoupon = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order } = req.body;

          let statusFilter;
            if (Array.isArray(status)) {
            statusFilter = status.length ? status : [1, 0];
            } else if (status !== undefined && status !== null && status !== "") {
            statusFilter = [Number(status)];  // convert single value into array
            } else {
            statusFilter = [1];
            }
        let query = { status: { $in: statusFilter } };

        if (search) {
            query.coupon_code = { $regex: search, $options: "i" };
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let couponQuery = Coupon.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            couponQuery = couponQuery.limit(pageLimit);
        }

        const coupon = await couponQuery;
        const count = await Coupon.countDocuments(query);
        const couponList = coupon.map((item) => {

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
            message: "Coupon fetched successfully",
            status: 200,
            count,
            data: couponList,
        });
    } catch (error) {
        next(error);
    }

};

exports.updateCoupon = async (req, res, next) => {
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

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!coupon) {
            return res.status(404).json({
                status: 404,
                error: { id: ["Coupon not found."] }
            });
        }

        res.status(200).json({
            status: 200,
            message: "Coupon updated successfully",
            data: coupon
        });

    } catch (err) {
        next(err);
    }
};

exports.deleteCoupon = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!coupon) {
            return res.status(404).json({ message: "coupon not found" });
        }
        res.status(200).json({ status: 200, message: "Coupon deleted successfully", data: coupon });
    } catch (error) {
        next(error);
    }
};

exports.validateCoupon = async (req, res, next) => {
    try {
        const { coupon_code } = req.body;

        if (!coupon_code) {
            return res.status(400).json({ status: 400, message: "Coupon code is required" });
        }

        const coupon = await Coupon.findOne({ coupon_code: coupon_code, status: 1 });

        if (!coupon) {
            return res.status(404).json({ status: 404, message: "Invalid coupon code" });
        }

        const now = moment().tz("Asia/Kolkata");

        res.status(200).json({
            status: 200,
            message: "Coupon applied successfully",
            data: {
                coupon_code: coupon.coupon_code,
                discount_type: coupon.discount_type,
                coupon_percentage: coupon.coupon_percentage,
                coupon_id: coupon._id
            }
        });

    } catch (error) {
        next(error);
    }
};