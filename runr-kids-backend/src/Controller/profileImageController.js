const ProfileImage = require("../Model/profileImage");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const moment = require("moment-timezone");

exports.addProfileImage = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "profile_image_cartoon");
        body.image_url = uploadResult.originalKey; 
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "profile_image_cartoon");
        body.image_url = result.originalPath;
      }
    }

    const item = await ProfileImage.create(body);

    res.status(200).json({
      status: 200,
      message: "Profile image added successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllProfileImages = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, type, _id } = req.body || {};

      let statusFilter;
      if (Array.isArray(status)) {
        statusFilter = status.length ? status : [1, 0];
      } else if (status !== undefined && status !== null && status !== "") {
        statusFilter = [Number(status)];
      } else {
        statusFilter = [1]; 
      }
    let query = { status: { $in: statusFilter } };

    if (_id) {
        query._id = _id;
      }

    if (search) {
      query.avtar_type = { $regex: search, $options: "i" };
    }
    let selectFields = {};
    if (type) {
      selectFields[type] = 1;
      selectFields["_id"] = 1; 
    }
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "created_at";  
    const sortDirection = sort_order === "asc" ? 1 : -1; 

    let itemQuery = ProfileImage.find(query).select(selectFields);

      if (!type) {
        itemQuery = itemQuery
          .populate({ path: "created_by", select: "first_name last_name" })
          .populate({ path: "updated_by", select: "first_name last_name" });
      }

      itemQuery = itemQuery
        .sort({ [sortField]: sortDirection })
        .skip(pageOffset);

    if (pageLimit > 0) {
        itemQuery = itemQuery.limit(pageLimit);
    }

    const items = await itemQuery;
    const count = await ProfileImage.countDocuments(query);

    if (type) {
      return res.status(200).json({
        status: 200,
        message: "Profile images fetched successfully",
        total: count,
        data: items,
      });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Bucket = config.AWS_BUCKET_NAME || "runrkids";
    const region = config.AWS_REGION || "ap-south-1";
    const s3Url = `https://${s3Bucket}.s3.${region}.amazonaws.com/media/profile_image_cartoon`;

    const formattedItems = items.map((item) => {
    const fileName = item.image_url ? item.image_url.split('/').pop() : null;
    
      return {
        ...item.toObject(),
        image_url: item.image_url
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/profile_image_cartoon/${fileName}`
          : null,
        created_at: moment(item.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(item.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        created_by: item.created_by ? item.created_by._id : null,
        created_by_name: item.created_by
            ? `${item.created_by.first_name} ${item.created_by.last_name}`
            : null,
        updated_by: item.updated_by ? item.updated_by._id : null,
        updated_by_name: item.updated_by
            ? `${item.updated_by.first_name} ${item.updated_by.last_name}`
            : null
      };
    });

    res.status(200).json({
      status: 200,
      message: "Profile images fetched successfully",
      total: count,
      data: formattedItems,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProfileImage = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "ID is required",
    });
  }

  try {
    const { id } = req.body;

    const item = await ProfileImage.findByIdAndUpdate(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Profile image not found"});
    }

    res.status(200).json({
      status: 200,
      message: "Profile image deleted successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};
