const Media = require("../Model/media");
const moment = require("moment-timezone");
const path = require('path');
const STORAGE_TYPE = process.env.STORAGE_TYPE;
const LOCAL_URL = process.env.LOCAL_URL;
const S3_URL = process.env.S3_URL;


exports.addMedia = async (req, res, next) => {
    try {
        if (req.file) {
            req.body.media_file = req.file.filename;
        }

        const media = await Media.create(req.body);

        res.status(200).json({
            status: 200,
            message: "Media added successfully",
            data: media
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllMedia = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order, year, month } = req.body;

        const statusFilter = typeof status !== "undefined" ? status : [0, 1];
        let query = { status: { $in: statusFilter } };

        if (search) query.media_title = { $regex: search, $options: "i" };

        if (year || month) {
            query.$expr = {};
            if (year) query.$expr.$eq = [{ $year: "$created_at" }, parseInt(year)];
            if (month) {
                query.$expr = year
                    ? { $and: [{ $eq: [{ $year: "$created_at" }, parseInt(year)] }, { $eq: [{ $month: "$created_at" }, parseInt(month)] }] }
                    : { $eq: [{ $month: "$created_at" }, parseInt(month)] };
            }
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;
        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let mediaQuery = Media.find(query)
            .populate({ path: "created_by", select: "first_name last_name" })
            .populate({ path: "updated_by", select: "first_name last_name" })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) mediaQuery = mediaQuery.limit(pageLimit);

        const media = await mediaQuery;
        const count = await Media.countDocuments(query);

        const mediaList = media.map((item) => {
            const originalFile = item.media_file || null;
            const webpFile = originalFile ? originalFile.replace(path.extname(originalFile), ".webp") : null;
            // console.log(webpFile);

            const baseUrl = STORAGE_TYPE === "s3"
                ? `${S3_URL}/media_images`
                : `${LOCAL_URL}/media_images`;
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
                    : null,
                media_original_file: originalFile ? `${baseUrl}/${originalFile}` : null,
                media_webp_file: webpFile ? `${baseUrl}/${webpFile}` : null,
            };
        });

        res.status(200).json({
            message: "Media fetched successfully",
            status: 200,
            count,
            data: mediaList,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMedia = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const media = await Media.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!media) {
            return res.status(404).json({ message: "media not found" });
        }
        res.status(200).json({ status: 200, message: "Media deleted successfully", data: media });
    } catch (error) {
        next(error);
    }
};

exports.updateMedia = async (req, res, next) => {

    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id, ...rest } = req.body;
        const updateData = {};

        // ✅ 1. If file uploaded → add media_file
        if (req.file) {
            updateData.media_file = req.file.filename;
        }

        // ✅ 2. Add dynamic fields from body
        Object.keys(rest).forEach((key) => {
            if (rest[key] !== undefined && rest[key] !== null && rest[key] !== "") {
                updateData[key] = rest[key];
            }
        });

        // ✅ update timestamp
        updateData.updated_at = Date.now();

        const updatedMedia = await Media.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMedia) {
            return res.status(404).json({ message: "Media not found" });
        }

        res.status(200).json({
            status: 200,
            message: "Media updated successfully",
            data: updatedMedia
        });

    } catch (error) {
        next(error);
    }
};
