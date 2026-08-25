const City = require("../Model/city");

exports.addCity = async (req, res, next) => {
    try {
        const city = await City.create(req.body);
        res.status(200).json({
            status: 200,
            message: "City added successfully",
            data: city,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllCities = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

        const statusFilter = status && status.length ? status : ["1", "0"];
        let query = { status: { $in: statusFilter } };

        if (search) {
            query.city_name = { $regex: search, $options: "i" };    
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let cityQuery = City.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            cityQuery = cityQuery.limit(pageLimit);
        }

        const cities = await cityQuery;
        const count = await City.countDocuments(query);
        
        res.status(200).json({
            message: "Cities fetched successfully",
            status:200, 
            count,
            data: cities,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCity = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id, city_name, status } = req.body;

        const updateData = {};
        if (city_name !== undefined) updateData.city_name = city_name;
        if (status !== undefined) updateData.status = status;
        updateData.updated_at = Date.now();

        const city = await City.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true,
            context: "query"
        });

        if (!city) return res.status(404).json({ message: "City not found" });

        res.status(200).json({
            status:200, 
            message: "City updated successfully", 
            data: city 
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCity = async (req, res, next) => {

    // ✅ Step 1: Always check ID first (before try-catch)
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const city = await City.findByIdAndUpdate(
            id,
            { status: "0", updated_at: Date.now() },
            { new: true }
        );
        if (!city) {
            return res.status(404).json({ message: "City not found" });
        }
        res.status(200).json({status:200, message: "City deleted successfully", data: city });
    } catch (error) {
        next(error);
    }
};