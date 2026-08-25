const mongoose = require('mongoose');
const ProductGallery = require("../Model/productGallery");
const config = require("../Config/app");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");

exports.addGalleryImages = async (req, res, next) => {
  try {
    const { product_id } = req.body || {};

    if (!product_id) {
      return res.status(400).json({
        status: 400,
        message: "product_id is required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "No gallery images uploaded",
      });
    }

    let images = [];

    for (const file of req.files) {
      let originalPath, webpPath;

      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(file, "product_gallery");
        originalPath = uploadResult.originalKey;
        webpPath = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(file, "product_gallery");
        originalPath = result.originalPath;
        webpPath = result.webpPath;
      }

      images.push({
        product_id,
        product_gallery_url: originalPath,
        product_gallery_url_webp: webpPath,
      });
    }

    // ✅ Bulk insert all gallery images
    const savedImages = await ProductGallery.insertMany(images);

    res.status(200).json({
      status: 200,
      message: "Gallery images added successfully",
      data: savedImages,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllGalleryImages = async (req, res, next) => {
  try {
    const { status, product_id, limit, offset, sort_by, sort_order } = req.body || {};

    // ✅ Manual validation first
    if (!product_id) {
      return res.status(400).json({
        status: 400,
        error: {
          product_id: ["Product ID is required"],
        },
      });
    }

    // ✅ Define query early
    const statusFilter = status && status.length ? status : ["1", "0"];
    let query = { status: { $in: statusFilter } };

    // ✅ Then safely add product_id filter
    query.product_id = product_id;

    // ✅ Pagination + Sorting
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let galleryQuery = ProductGallery.find(query)
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      galleryQuery = galleryQuery.limit(pageLimit);
    }

    const galleryImage = await galleryQuery;
    const count = await ProductGallery.countDocuments(query);

    // ✅ Handle URLs
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product_gallery";

    const galleryImages = galleryImage.map((img) => {
      const fileName = img.product_gallery_url
        ? img.product_gallery_url.split("/").pop()
        : null;

      return {
        ...img.toObject(),
        product_gallery_url: fileName
          ? (config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/product_gallery/${fileName}`)
          : null,
      };
    });

    // ✅ Final response
    return res.status(200).json({
      status: 200,
      total: count,
      message: "Product Gallery fetched successfully",
      data: galleryImages,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGalleryImages = async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Gallery Image ID is required",
      });
    }

    const galleryImage = await ProductGallery.findById(id);

    if (!galleryImage) {
      return res.status(404).json({
        status: 404,
        message: "Gallery Image not found",
      });
    }

    // Delete from storage
    if (config.NODE_ENV === "production") {
      const keysToDelete = [];
      if (galleryImage.product_gallery_url) keysToDelete.push(galleryImage.product_gallery_url);
      
      if (galleryImage.product_gallery_url) {
         const originalKey = galleryImage.product_gallery_url;
         const ext = originalKey.split('.').pop();
         const webpKey = originalKey.replace(`.${ext}`, '.webp');
         keysToDelete.push(webpKey);
      }
      
      await deleteS3Objects(keysToDelete);
    } else {
      deleteLocalImages(galleryImage.product_gallery_url, null);
    }

    await ProductGallery.findByIdAndDelete(id);

    res.status(200).json({
      status: 200,
      message: "Gallery Image deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

