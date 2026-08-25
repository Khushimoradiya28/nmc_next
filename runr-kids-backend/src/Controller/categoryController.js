const Category = require("../Model/category");
const config = require("../Config/app");
const { generateSlug } = require("../helper");
const { saveLocalAndCreateWebp, uploadToS3AndCreateWebp, deleteLocalImages, deleteS3Objects } = require("../Utils/imageProcessor");
const moment = require("moment-timezone");
exports.addCategory = async (req, res, next) => {
  try {
    const body = req.body || {};

    if (body.category_name) {
      body.category_slug = generateSlug(body.category_name);
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "category");
        body.category_image = uploadResult.originalKey; 
        body.category_image_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "category");
        body.category_image = result.originalPath;
        body.category_image_webp = result.webpPath;
      }
    }

    const category = await Category.create(body);

    res.status(200).json({
      status: 200,
      message: "Category added successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order,type,_id,is_trending } = req.body || {};

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
    // Select fields dynamically
    let selectFields = {};
    if (type) {
      selectFields[type] = 1;
      selectFields["_id"] = 1; 
    }
    if (search) {
      query.category_name = { $regex: search, $options: "i" };    
    }

    if (is_trending !== undefined && is_trending !== null && is_trending !== "") {
      query.is_trending = Number(is_trending); // 1 or 0
    }
    
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "createdAt";  
    const sortDirection = sort_order === "asc" ? 1 : -1; 

    let categoryQuery = Category.find(query).select(selectFields);

    // If type NOT passed → include populate
    if (!type) {
      categoryQuery = categoryQuery
        .populate({ path: "created_by", select: "first_name last_name" })
        .populate({ path: "updated_by", select: "first_name last_name" });
    }

    categoryQuery = categoryQuery
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);
        if (pageLimit > 0) {
          categoryQuery = categoryQuery.limit(pageLimit);
        }

    const category = await categoryQuery;
    const count = await Category.countDocuments(query);

    // If type is passed → return only selected fields
    if (type) {
      return res.status(200).json({
        status: 200,
        message: "Categories fetched successfully",
        total: count,
        data: category,
      });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/category";

    const categories = category.map((category) => {
    const fileName = category.category_image ? category.category_image.split('/').pop() : null;
    
      return {
        ...category.toObject(),
        category_image: category.category_image
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/category/${fileName}`
          : null,
        created_at: moment(category.created_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(category.updated_at).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
        created_by: category.created_by ? category.created_by._id : null, // just ID
        created_by_name: category.created_by
            ? `${category.created_by.first_name} ${category.created_by.last_name}`
            : null, // full name
        updated_by: category.updated_by ? category.updated_by._id : null,
        updated_by_name: category.updated_by
            ? `${category.updated_by.first_name} ${category.updated_by.last_name}`
            : null
      };
    });

    res.status(200).json({
      status: 200,
      message: "Categories fetched successfully",
      total: count,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;
    const body = req.body || {};

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        status: 404,
        message: "Category not found",
      });
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const oldKeys = [];
        if (existingCategory.category_image)
          oldKeys.push(existingCategory.category_image.split('/').pop());
        if (existingCategory.category_image_webp)
          oldKeys.push(existingCategory.category_image_webp.split('/').pop());
        if (oldKeys.length > 0) {
          await deleteS3Objects(oldKeys, "category");
        }
      } else {
        if (existingCategory.category_image) {
          deleteLocalImages(existingCategory.category_image);
        }
        if (existingCategory.category_image_webp) {
          deleteLocalImages(existingCategory.category_image_webp);
        }
      }

      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "category");
        body.category_image = uploadResult.originalKey; 
        body.category_image_webp = uploadResult.webpKey;
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "category");
        body.category_image = result.originalPath;
        body.category_image_webp = result.webpPath;
      }
    }
    body.updated_at = Date.now();
    const updateCategory = await Category.findByIdAndUpdate(id, body, { new: true });

    res.status(200).json({
      status: 200,
      message: "Category updated successfully",
      data: updateCategory,
    });

  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Category ID is required",
    });
  }

  try {
    const { id } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found"});
    }

    res.status(200).json({
      status: 200,
      message: "Category deleted successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
};