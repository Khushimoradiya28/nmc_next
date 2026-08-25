const Brand = require("../Model/brand");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { generateSlug } = require("../helper");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const moment = require("moment-timezone");

exports.addBrand = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (body.brand_name) {
      body.brand_slug = generateSlug(body.brand_name);
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "brand");
        body.brand_logo = uploadResult.originalKey; 
        body.brand_logo_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "brand");
        body.brand_logo = result.originalPath;
        body.brand_logo_webp = result.webpPath;
      }
    }

    const brand = await Brand.create(body);

    res.status(200).json({
      status: 200,
      message: "Brand added successfully",
      data: brand,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllBrands = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, type, _id } = req.body || {};

      let statusFilter;
      if (Array.isArray(status)) {
        statusFilter = status.length ? status : [1, 0];
      } else if (status !== undefined && status !== null && status !== "") {
        statusFilter = [Number(status)];  // convert single value into array
      } else {
        statusFilter = [1, 0];
      }
    let query = { status: { $in: statusFilter } };

    if (_id) {
        query._id = _id;
      }

    if (search) {
      query.brand_name = { $regex: search, $options: "i" };    
    }
    let selectFields = {};
    if (type) {
      selectFields[type] = 1;
      selectFields["_id"] = 1; 
    }
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "createdAt";  
    const sortDirection = sort_order === "asc" ? 1 : -1; 

    let brandQuery = Brand.find(query).select(selectFields);

    // If type NOT passed → include created_by / updated_by
      if (!type) {
        brandQuery = brandQuery
          .populate({ path: "created_by", select: "first_name last_name" })
          .populate({ path: "updated_by", select: "first_name last_name" });
      }

      brandQuery = brandQuery
        .sort({ [sortField]: sortDirection })
        .skip(pageOffset);

    if (pageLimit > 0) {
      brandQuery = brandQuery.limit(pageLimit);
    }

    const brand = await brandQuery;
    const count = await Brand.countDocuments(query);

    if (type) {
      return res.status(200).json({
        status: 200,
        message: "Brands fetched successfully",
        total: count,
        data: brand,
      });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/brand";

    const brands = brand.map((brand) => {
    const fileName = brand.brand_logo ? brand.brand_logo.split('/').pop() : null;
    
      return {
        ...brand.toObject(),
        brand_logo: brand.brand_logo
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/brand/${fileName}`
          : null,
        created_at: moment(brand.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(brand.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        created_by: brand.created_by ? brand.created_by._id : null, // just ID
        created_by_name: brand.created_by
            ? `${brand.created_by.first_name} ${brand.created_by.last_name}`
            : null, // full name
        updated_by: brand.updated_by ? brand.updated_by._id : null,
        updated_by_name: brand.updated_by
            ? `${brand.updated_by.first_name} ${brand.updated_by.last_name}`
            : null
      };
    });

    res.status(200).json({
      status: 200,
      message: "Brands fetched successfully",
      total: count,
      data: brands,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBrand = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;
    const body = req.body || {};

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return res.status(404).json({
        status: 404,
        message: "Brand not found",
      });
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const oldKeys = [];
        if (existingBrand.brand_logo)
          oldKeys.push(existingBrand.brand_logo.split('/').pop());
        if (existingBrand.brand_logo_webp)
          oldKeys.push(existingBrand.brand_logo_webp.split('/').pop());
        if (oldKeys.length > 0) {
          await deleteS3Objects(oldKeys, "brand");
        }
      } else {
        if (existingBrand.brand_logo) {
          deleteLocalImages(existingBrand.brand_logo);
        }
        if (existingBrand.brand_logo_webp) {
          deleteLocalImages(existingBrand.brand_logo_webp);
        }
      }

      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "brand");
        body.brand_logo = uploadResult.originalKey; 
        body.brand_logo_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "brand");
        body.brand_logo = result.originalPath;
        body.brand_logo_webp = result.webpPath;
      }
    }
    
    body.updated_at = Date.now();
    const updateBrand = await Brand.findByIdAndUpdate(id, body, { new: true });
    res.status(200).json({
      status: 200,
      message: "Brand updated successfully",
      data: updateBrand,
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteBrand = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Brand ID is required",
    });
  }

  try {
    const { id } = req.body;

    const brand = await Brand.findByIdAndUpdate(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ message: "Brand not found"});
    }

    res.status(200).json({
      status: 200,
      message: "Brand deleted successfully",
      data: brand,
    });
  } catch (err) {
    next(err);
  }
};