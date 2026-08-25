const Banner = require("../Model/banner");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const moment = require("moment-timezone");

exports.addBanner = async (req, res, next) => {
    try {
        const body = req.body || {};

        if (req.file) {
          if (config.NODE_ENV === "production") {
            const uploadResult = await uploadToS3AndCreateWebp(req.file, "banner");
            body.banner_img = uploadResult.originalKey; 
            body.banner_img_webp = uploadResult.webpKey;
          } else {
            const result = await saveLocalAndCreateWebp(req.file, "banner");
            body.banner_img = result.originalPath;
            body.banner_img_webp = result.webpPath;
          }
        }

        const banner = await Banner.create(body);

        res.status(200).json({
            status: 200,
            message: "Banner added successfully",
            data: banner,
        });
    } catch (err) {
        next(err);
    }
};

exports.getAllBanners = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order } = req.body || {};

        const statusFilter = status && status.length ? status : ["1", "0"];
        let query = { status: { $in: statusFilter } };

        if (search) {
            query.banner_title = { $regex: search, $options: "i" };    
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";  
        const sortDirection = sort_order === "asc" ? 1 : -1; 

        let bannerQuery = Banner.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            bannerQuery = bannerQuery.limit(pageLimit);
        }

        const banner = await bannerQuery;
        const count = await Banner.countDocuments(query);

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/banner";

        const banners = banner.map((banner) => {
        const fileName = banner.banner_img ? banner.banner_img.split("/").pop() : null;
        let webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;
    
          return {
            ...banner.toObject(),
            banner_img: fileName
              ? (config.NODE_ENV === "production"
                  ? `${s3Url}/${fileName}`
                  : `${baseUrl}/media/banner/${fileName}`
                )
              : null,
            banner_img_webp: webpFileName
              ? (config.NODE_ENV === "production"
                  ? `${s3Url}/${webpFileName}`
                  : `${baseUrl}/media/banner/${webpFileName}`
                )
              : null,
            created_at: moment(banner.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
            updated_at: moment(banner.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
          };
        });

        res.status(200).json({
            status: 200,
            message: "Banners fetched successfully",
            total: count,
            data: banners,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateBanner = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;
    const body = req.body || {};

    // ✅ Find existing banner
    const existingBanner = await Banner.findById(id);
    if (!existingBanner) {
      return res.status(404).json({
        status: 404,
        message: "Banner not found",
      });
    }

    // ✅ If new file uploaded
    if (req.file) {
      if (config.NODE_ENV === "production") {
        // 🔹 Delete old images from S3 (array is fine here)
        const oldKeys = [];
        if (existingBanner.banner_img)
          oldKeys.push(existingBanner.banner_img.split("/").pop());
        if (existingBanner.banner_img_webp)
          oldKeys.push(existingBanner.banner_img_webp.split("/").pop());
        if (oldKeys.length > 0) {
          await deleteS3Objects(oldKeys, "banner");
        }
      } else {
        // 🔹 Delete old local images one by one (not as array)
        if (existingBanner.banner_img) {
          deleteLocalImages(existingBanner.banner_img);
        }
        if (existingBanner.banner_img_webp) {
          deleteLocalImages(existingBanner.banner_img_webp);
        }
      }

      // ✅ Upload new banner image
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "banner");
        body.banner_img = uploadResult.originalKey;
        body.banner_img_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "banner");
        body.banner_img = result.originalPath;
        body.banner_img_webp = result.webpPath;
      }
    }
    body.updated_at = Date.now();
    // ✅ Update DB
    const updatedBanner = await Banner.findByIdAndUpdate(id, body, { new: true });

    res.status(200).json({
      status: 200,
      message: "Banner updated successfully",
      data: updatedBanner,
    });
  } catch (err) {
    next(err);
  }
};


exports.deleteBanner = async (req, res, next) => {

    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }

    try {
        const { id } = req.body;

        const banner = await Banner.findByIdAndUpdate(
            id,
            { status: "0", updated_at: Date.now() },
            { new: true }
        );
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        res.status(200).json({status:200, message: "Banner deleted successfully", data: banner });
    } catch (error) {
        next(error);
    }
};