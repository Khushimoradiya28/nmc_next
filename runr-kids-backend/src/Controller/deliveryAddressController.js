const DeliveryAddress = require("../Model/deliveryAddress");
const mongoose = require("mongoose");

exports.addDeliveryAddress = async (req, res, next) => {
    try {

        const payload = { ...req.body, user_id: req.user.id };
        const deliveryAddress = await DeliveryAddress.create(payload);
        res.status(200).json({
            status: 200,
            message: "Delivery address added successfully",
            data: deliveryAddress,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllDeliveryAddress = async (req, res, next) => {
    try {

        const { status, limit, offset, sort_by, sort_order, user_id } = req.body || {};

        if (!user_id) {
            return res.status(400).json({
                status: 400,
                message: "user_id is required"
            });
        }

        const statusFilter = status && status.length ? status : [1];
        let query = { status: { $in: statusFilter } };

        if (user_id) {
            query.user_id = new mongoose.Types.ObjectId(user_id);
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "created_at";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let deliveryAddressQuery = DeliveryAddress.find(query)
            .populate("address_type_id")
            .populate("user_id")
            .populate("user_id", "first_name last_name mobile")
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            deliveryAddressQuery = deliveryAddressQuery.limit(pageLimit);
        }

        const rawData = await deliveryAddressQuery;

        const deliveryAddresses = rawData.map(item => ({
            _id: item._id,
            address_type_id: item.address_type_id?._id || null,
            address_type: item.address_type_id?.address_type || null,

            user_id: item.user_id?._id || null,
            user_first_name: item.user_id?.first_name || null,
            user_last_name: item.user_id?.last_name || null,
            user_mobile: item.user_id?.mobile || null,

            checkout_address_type: item.checkout_address_type,
            country: item.country,
            state: item.state,
            city: item.city,
            street_address: item.street_address,
            // flat_house_office: item.flat_house_office,
            postal_code: item.postal_code,
            alternate_phone: item.alternate_phone,
            status: item.status,
            guid: item.guid,
            created_at: item.created_at,
            updated_at: item.updated_at,
            __v: item.__v
        }));

        const count = await DeliveryAddress.countDocuments(query);

        res.status(200).json({
            message: "Delivery addresses fetched successfully",
            status: 200,
            count,
            data: deliveryAddresses,
        });

    } catch (error) {
        next(error);
    }
};

exports.updateDeliveryAddress = async (req, res, next) => {

    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, country, state, city, street_address, postal_code,checkout_address_type,alternate_phone, status, address_type_id } = req.body;

        const updateData = {};
        if (country !== undefined) updateData.country = country;
        if (state !== undefined) updateData.state = state;
        if (city !== undefined) updateData.city = city;
        if (street_address !== undefined) updateData.street_address = street_address;
        // if (flat_house_office !== undefined) updateData.flat_house_office = flat_house_office;
        if (postal_code !== undefined) updateData.postal_code = postal_code;
        if (checkout_address_type !== undefined) updateData.checkout_address_type = checkout_address_type;
        if (alternate_phone !== undefined) updateData.alternate_phone = alternate_phone;
        if (status !== undefined) updateData.status = status;

        // ✔ NEW - update relation
        if (address_type_id !== undefined) updateData.address_type_id = address_type_id;

        updateData.updated_at = Date.now();

        const deliveryAddress = await DeliveryAddress.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            updateData, 
            {
                new: true,
                runValidators: true,
                context: "query"
            }
        ).populate("address_type_id");

        if (!deliveryAddress) return res.status(404).json({ message: "Delivery address not found" });

        res.status(200).json({
            status: 200,
            message: "Delivery address updated successfully",
            data: deliveryAddress
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteDeliveryAddress = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const deliveryAddress = await DeliveryAddress.findOneAndUpdate(
            { _id: id, user_id: req.user.id },
            { status: "0", updated_at: Date.now() },
            { new: true }
        );
        if (!deliveryAddress) {
            return res.status(404).json({ message: "Delivery address not found" });
        }
        res.status(200).json({ status: 200, message: "Delivery address deleted successfully", data: deliveryAddress });
    } catch (error) {
        next(error);
    }
};