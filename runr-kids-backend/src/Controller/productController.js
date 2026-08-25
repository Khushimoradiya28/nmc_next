const Product = require("../Model/product");
const axios = require("axios");
const sharp = require("sharp");
const config = require("../Config/app");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx-js-style");
const {
  saveLocalAndCreateWebp,
  uploadToS3AndCreateWebp,
  deleteLocalImages,
  deleteS3Objects,
} = require("../Utils/imageProcessor");
const { generateSlug, calculateDiscount, escapeRegex } = require("../helper");
const moment = require("moment-timezone");
const RelationalTag = require("../Model/relationaltag");
const Tag = require("../Model/tag");
const Skill = require("../Model/skills");
const Material = require("../Model/material");
const Brand = require("../Model/brand");
const Color = require("../Model/color");
const Commodity = require("../Model/commodity");
const RelationalCharacter = require("../Model/relationalcharacter");
const Character = require("../Model/character");
// const RelationalBrand = require("../Model/relationalbrand");
// const Brand = require("../Model/brand");
const RelationalCategory = require("../Model/relationalcategory");
const Category = require("../Model/category");
const RelationalAge = require("../Model/relationalage");
const Age = require("../Model/age");
const Wishlist = require("../Model/productwishlist");
const ProductGallery = require("../Model/productGallery");
const mongoose = require("mongoose");
const Cart = require("../Model/productCart");
const logger = require("../Utils/logger");

exports.addProduct = async (req, res, next) => {
  let uploadedFiles = [];
  try {
    const body = req.body || {};

    if (body.product_name) {
      body.product_slug = generateSlug(body.product_name);
    }

    if (body.material_id) {
      const material = await Material.findById(body.material_id).select(
        "material_name"
      );
      body.material_name = material?.material_name || null;
    }

    if (body.skill_id) {
      const skill = await Skill.findById(body.skill_id).select("skill_name");
      body.skill_name = skill?.skill_name || null;
    }

    if (body.commodity_id) {
      const commodity = await Commodity.findById(body.commodity_id).select(
        "commodity_name"
      );
      body.commodity_name = commodity?.commodity_name || null;
    }

    if (body.brand_id) {
      const brand = await Brand.findById(body.brand_id).select("brand_name");
      body.brand_name = brand?.brand_name || null;
    }

    if (req.file) {
      if (config.NODE_ENV === "production") {
        const uploadResult = await uploadToS3AndCreateWebp(req.file, "product");
        body.product_img = uploadResult.originalKey;
        body.product_img_webp = uploadResult.webpKey;

        uploadedFiles.push(uploadResult.originalKey, uploadResult.webpKey);
      } else {
        const result = await saveLocalAndCreateWebp(req.file, "product");
        body.product_img = result.originalPath;
        body.product_img_webp = result.webpPath;

        uploadedFiles.push(result.originalPath, result.webpPath);
      }
    }

    const product = await Product.create(body);

    res.status(200).json({
      status: 200,
      message: "Product added successfully",
      data: product,
    });
  } catch (err) {
    try {
      if (config.NODE_ENV === "production") {
        await deleteS3Objects(uploadedFiles);
      } else {
        for (const filePath of uploadedFiles) {
          deleteLocalImages(filePath);
        }
      }
    } catch (cleanupErr) {
      console.warn("Error cleaning up uploaded files:", cleanupErr.message);
    }

    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, guid } =
      req.body || {};

    let statusFilter;
    if (Array.isArray(status)) {
      statusFilter = status.length ? status : [1, 0];
    } else if (status !== undefined && status !== null && status !== "") {
      statusFilter = [Number(status)];
    } else {
      statusFilter = [1];
    }
    let query = { status: { $in: statusFilter } };

    if (search) {
      const escapedSearch = escapeRegex(search.trim());
      query.product_name = { $regex: escapedSearch, $options: "i" };
    }
    if (guid) {
      query.guid = guid;
    }
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let productQuery = Product.find(query)
      .populate([
        { path: "created_by", select: "first_name last_name" },
        { path: "updated_by", select: "first_name last_name" },
      ])

      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      productQuery = productQuery.limit(pageLimit);
    }

    const product = await productQuery;
    const count = await Product.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product";

    const products = product.map((item) => {
      const {
        created_by,
        updated_by,
        ...rest // remove nested populated fields
      } = item.toObject();
      const fileName = item.product_img
        ? item.product_img.split("/").pop()
        : null;
      let webpFileName = null;
      if (fileName) {
        const withoutExt = fileName.substring(0, fileName.lastIndexOf("."));
        webpFileName = `${withoutExt}.webp`;
      }
      return {
        ...rest,
        product_img: fileName
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/product/${fileName}`
          : null,
        product_img_webp: webpFileName
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${webpFileName}`
            : `${baseUrl}/media/product/${webpFileName}`
          : null,
        created_by_name: created_by
          ? `${created_by.first_name} ${created_by.last_name}`
          : null,
        created_by: created_by ? created_by._id : null,
        updated_by: updated_by ? updated_by._id : null,
        updated_by_name: updated_by
          ? `${updated_by.first_name} ${updated_by.last_name}`
          : null,
        created_at: item.created_at
          ? moment(item.created_at)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DD HH:mm:ss")
          : null,
        updated_at: item.updated_at
          ? moment(item.updated_at)
              .tz("Asia/Kolkata")
              .format("YYYY-MM-DD HH:mm:ss")
          : null,
      };
    });

    res.status(200).json({
      message: "Products fetched successfully",
      status: 200,
      count,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {
    const { id } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: 0, updated_at: Date.now() },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

//Aditya
exports.getAllHomeproductsList = async (req, res, next) => {
  try {
    const { limit, offset } = req.body || {};

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const productQuery = Product.find(
      { status: 1, is_trending: 1, is_stock: 1, is_bestseller: 1 },
      {
        product_name: 1,
        product_slug: 1,
        product_img: 1,
        actual_price: 1,
        offer_price: 1,
        is_stock: 1,
        product_dimensions: 1,
        net_quantity: 1,
        product_weight: 1,
        stock_quantity: 1,
      }
    );

    const products = await productQuery.skip(pageOffset).limit(pageLimit);

    // const S3_BASE_URL ="https://runrkids.s3.ap-south-1.amazonaws.com/";

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    const imageBaseUrl =
      config.NODE_ENV === "production"
        ? "https://runrkids.s3.ap-south-1.amazonaws.com/"
        : baseUrl + "/";

    const count = await Product.countDocuments({
      status: 1,
      is_trending: 1,
      is_stock: 1,
      is_bestseller: 1,
    });

    const finalData = products.map((p) => {
      // Extract filename only
      const fileName = p.product_img ? p.product_img.split("/").pop() : null;

      // convert jpg/png → webp
      const webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;

      return {
        _id: p._id,
        product_name: p.product_name,
        product_slug: p.product_slug,
        actual_price: p.actual_price,
        offer_price: p.offer_price,
        discount: calculateDiscount(p.actual_price, p.offer_price) + "%",
        product_dimensions: p.product_dimensions,
        net_quantity: p.net_quantity,
        product_weight: p.product_weight,
        stock_quantity: p.stock_quantity,

        // original image
        // product_img: p.product_img,
        product_img_url: fileName
          ? imageBaseUrl + "media/product/" + fileName
          : null,

        // webp compression version
        product_img_webp_url: webpFileName
          ? imageBaseUrl + "media/product/" + webpFileName
          : null,
      };
    });

    res.status(200).json({
      message: "Home Products fetched successfully",
      status: 200,
      count: count,
      data: finalData,
    });
  } catch (error) {
    next(error);
  }
};

// Without Lookup
exports.getAllProductsList = async (req, res, next) => {
  try {
    const {
      status,
      search,
      limit,
      offset,
      sort_by,
      sort_order,
      type,
      guid,
      _id,
      categoryidlist,
      characteridlist,
      // brandidlist,
      ageidlist,
      brand_id,
      // priceSort,
      user_id,
      product_slug,
    } = req.body || {};

    if (!type) {
      return res.status(400).json({
        status: 400,
        message: "type is required. Accepted: product_list, product_detail",
      });
    }

    // ================= STATUS FILTER =================
    let statusFilter = [1];
    if (status)
      statusFilter = Array.isArray(status) ? status : [Number(status)];
    let query = { status: { $in: statusFilter } };

    // ================= STOCK FILTER =================
    if (req.body.is_stock != null) {
      query.is_stock = String(req.body.is_stock); // "1" or "0"
    }
    if (search) {
      const escapedSearch = escapeRegex(search.trim());
      query.$or = [
        { product_title: { $regex: escapedSearch, $options: "i" } },
        { product_name: { $regex: escapedSearch, $options: "i" } },
        { product_sku: { $regex: escapedSearch, $options: "i" } },
      ];
    }
    if (guid) query.guid = guid;
    if (product_slug) query.product_slug = product_slug;

    // ================= RELATIONAL FILTERS =================
    function ensureArray(item) {
      if (!item) return [];
      return Array.isArray(item) ? item : [item];
    }

    const categoryIds = ensureArray(categoryidlist);
    const characterIds = ensureArray(characteridlist);
    const ageIds = ensureArray(ageidlist);

    // BRAND FILTER (direct field filter)
    if (brand_id) {
      const brandIds = ensureArray(brand_id)
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));

      query.brand_id = { $in: brandIds };
    }

    // PRICE FILTER (direct field filter)
    const minPrice = req.body.min_price;
    const maxPrice = req.body.max_price;

    if (minPrice != null || maxPrice != null) {
      query.offer_price = {};
      if (minPrice != null) query.offer_price.$gte = Number(minPrice);
      if (maxPrice != null) query.offer_price.$lte = Number(maxPrice);
    }

    // ========= STRICT RELATIONAL FILTERS (AND LOGIC) ==========
    async function getProductIds(list, model, field) {
      if (!Array.isArray(list) || list.length === 0) return null;

      const rows = await model
        .find({
          [field]: {
            $in: list
              .filter((id) => mongoose.Types.ObjectId.isValid(id))
              .map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .select("product_id");

      // NO MATCH → stop everything
      if (rows.length === 0) return [];

      return rows.map((r) => r.product_id.toString());
    }

    const categoryProductIds = await getProductIds(
      categoryIds,
      RelationalCategory,
      "category_id"
    );
    const characterProductIds = await getProductIds(
      characterIds,
      RelationalCharacter,
      "character_id"
    );
    const ageProductIds = await getProductIds(ageIds, RelationalAge, "age_id");

    let idProductIds = null;
    if (_id) {
      const ids = ensureArray(_id);
      if (ids.length > 0) {
        idProductIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));
      }
    }

    // If any filter returns empty → return empty response
    if (
      (categoryIds.length && categoryProductIds?.length === 0) ||
      (characterIds.length && characterProductIds?.length === 0) ||
      (ageIds.length && ageProductIds?.length === 0)
    ) {
      return res.status(200).json({
        status: 200,
        message: "Products fetched successfully",
        count: 0,
        data: [],
      });
    }

    // Build intersection of relational product IDs
    let intersectionList = [
      categoryProductIds,
      characterProductIds,
      ageProductIds,
      idProductIds,
    ].filter((arr) => Array.isArray(arr)); // only arrays

    if (intersectionList.length > 0) {
      let productIdsSet = intersectionList.reduce((acc, arr) => {
        if (acc === null) return new Set(arr);
        return new Set(arr.filter((id) => acc.has(id)));
      }, null);

      // Intersection empty → return nothing
      if (!productIdsSet || productIdsSet.size === 0) {
        return res.status(200).json({
          status: 200,
          message: "Products fetched successfully",
          count: 0,
          data: [],
        });
      }

      // Add STRICT relational filter result into main query
      query._id = {
        $in: [...productIdsSet].map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    // ================= PAGINATION & SORT =================
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    // ================= FETCH PRODUCTS =================
    const productDocs = await Product.find(query)
      .collation({ locale: "en", strength: 2 })
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset)
      .limit(pageLimit)
      .lean();

    const productIds = productDocs.map((p) => p._id);

    // ================= FETCH RELATIONS IN PARALLEL =================
    const [
      categories,
      relCategories,
      characters,
      relCharacters,
      tags,
      relTags,
      ages,
      relAges,
      galleries,
      // wishlistItems,
      colors,
    ] = await Promise.all([
      Category.find().lean(),
      RelationalCategory.find({ product_id: { $in: productIds } }).lean(),
      Character.find().lean(),
      RelationalCharacter.find({ product_id: { $in: productIds } }).lean(),
      Tag.find().lean(),
      RelationalTag.find({ product_id: { $in: productIds } }).lean(),
      Age.find().lean(),
      RelationalAge.find({ product_id: { $in: productIds } }).lean(),
      ProductGallery.find({ product_id: { $in: productIds } }).lean(),
      // user_id
      //   ? Wishlist.find({ user_id, status: 1, product_id: { $in: productIds } }).lean()
      //   : [],
      Color.find().lean(),
    ]);

    // ================ FETCH WISHLIST IF USER/VISITOR PROVIDED =================
    let wishlistQuery = { status: 1, product_id: { $in: productIds } };

    if (user_id || req.body.visitor_tag) {
      wishlistQuery.$or = [];

      if (user_id) {
        wishlistQuery.$or.push({ user_id });
      }

      if (req.body.visitor_tag) {
        wishlistQuery.$or.push({ visitor_tag: req.body.visitor_tag });
      }
    }
    const wishlistItems =
      user_id || req.body.visitor_tag
        ? await Wishlist.find(wishlistQuery).lean()
        : [];

    // ================= FETCH CART IF USER/VISITOR PROVIDED =================
    let cartQuery = { status: 1, product_id: { $in: productIds } };

    if (user_id || req.body.visitor_tag) {
      cartQuery.$or = [];

      if (user_id) {
        cartQuery.$or.push({ user_id });
      }

      if (req.body.visitor_tag) {
        cartQuery.$or.push({ visitor_tag: req.body.visitor_tag });
      }
    }

    const cartItems =
      user_id || req.body.visitor_tag
        ? await Cart.find(cartQuery).lean()
        : [];

    // ================= CREATE RELATION MAPS =================
    const byProduct = (rows, key = "product_id") => {
      const map = {};
      rows.forEach((r) => {
        const pid = r[key]?.toString();
        if (!map[pid]) map[pid] = [];
        map[pid].push(r);
      });
      return map;
    };

    const relCategoryMap = byProduct(relCategories);
    const relCharacterMap = byProduct(relCharacters);
    const relTagMap = byProduct(relTags);
    const relAgeMap = byProduct(relAges);
    const galleryMap = byProduct(galleries);
    const wishlistMap = byProduct(wishlistItems);
    const cartMap = byProduct(cartItems);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url =
      config.NODE_ENV === "production"
        ? "https://runrkids.s3.ap-south-1.amazonaws.com/media/product"
        : baseUrl + "/media/product";

    const galleryS3Url =
      config.NODE_ENV === "production"
        ? "https://runrkids.s3.ap-south-1.amazonaws.com/media/product_gallery"
        : baseUrl + "/media/product_gallery";

    // ================= BUILD FINAL PRODUCTS =================
    const finalProducts = productDocs.map((p) => {
      const pid = p._id.toString();

      const fileName = p.product_img ? p.product_img.split("/").pop() : null;
      let webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;

      const category_ids = (relCategoryMap[pid] || []).map((r) =>
        r.category_id.toString()
      );
      const category_names = category_ids.map(
        (id) =>
          categories.find((c) => c._id.toString() === id)?.category_name || null
      );

      const character_ids = (relCharacterMap[pid] || []).map((r) =>
        r.character_id.toString()
      );
      const character_names = character_ids.map(
        (id) =>
          characters.find((c) => c._id.toString() === id)?.character_name ||
          null
      );

      const age_ids = (relAgeMap[pid] || []).map((r) => r.age_id.toString());
      const age_names = age_ids.map(
        (id) => ages.find((a) => a._id.toString() === id)?.age_group || null
      );

      const tag_ids = (relTagMap[pid] || []).map((r) => r.tag_id.toString());
      const tag_names = tag_ids.map(
        (id) => tags.find((t) => t._id.toString() === id)?.tag_name || null
      );
      const color = colors.find(
        (c) => c._id.toString() === p.color?.toString()
      );


      const is_wishlist = (wishlistMap[pid] || []).map((w) => ({
        wishlist_id: w._id,
        user_id: w.user_id,
        visitor_tag: w.visitor_tag,
        product_id: w.product_id,
        is_wishlist: w.is_wishlist,
      }));
      const product_is_wishlist = is_wishlist.length > 0 ? 1 : 0;

      const is_cart = (cartMap[pid] || []).length > 0 ? 1 : 0;

      // ---------------- TYPE CHECK ----------------
      if (type === "product_detail") {
        return {
          product_img: fileName ? `${s3Url}/${fileName}` : null,
          product_img_webp: webpFileName ? `${s3Url}/${webpFileName}` : null,
          product_name: p.product_name,
          product_description: p.product_description,
          product_short_description: p.product_short_description,
          product_title: p.product_title,
          offer_price: p.offer_price,
          actual_price: p.actual_price,
          discount: calculateDiscount(p.actual_price, p.offer_price) + "%",
          product_sku: p.product_sku,
          product_slug: p.product_slug,
          stock_quantity: p.stock_quantity,
          is_stock: p.is_stock,
          productlist: p.productlist,
          seo_title: p.seo_title,
          seo_keyword: p.seo_keyword,
          seo_url: p.seo_url,
          seo_canonical: p.seo_canonical,
          is_wishlist,
          product_is_wishlist,
          is_cart,
          net_quantity: p.net_quantity,
          remote_included: p.remote_included,
          gender: p.gender,
          guid: p.guid,
          _id: p._id,
          package_content: p.package_content,
          product_dimensions: p.product_dimensions,
          product_weight: p.product_weight,
          pacakge_dimensions: p.pacakge_dimensions,
          country_of_origin: p.country_of_origin,
          manufacturer_name: p.manufacturer_name,
          manufacturer_address: p.manufacturer_address,
          marketer_name: p.marketer_name,
          marketer_address: p.marketer_address,
          is_bestseller: p.is_bestseller,
          is_trending: p.is_trending,
          view_count: p.view_count,

          skill_id: p.skill_id,
          skill_name: p.skill_name,

          material_id: p.material_id,
          material_name: p.material_name,

          color_id: p.color,
          color_name: color?.color_name || null,
          color_code: color?.color_code || null,

          commodity_id: p.commodity_id,
          commodity_name: p.commodity_name,

          brand_id: p.brand_id,
          brand_name: p.brand_name || null,

          category_id: category_ids,
          categorynamelist: category_names,
          character_id: character_ids,
          characternamelist: character_names,
          // brand_id: brand_ids,
          // brandnamelist: brand_names,
          tag_id: tag_ids,
          tagnamelist: tag_names,
          age_id: age_ids,
          agenamelist: age_names,
          gallery_images: (galleryMap[pid] || []).map((g) => ({
            ...g,
            product_gallery_url: g.product_gallery_url
              ? `${galleryS3Url}/${g.product_gallery_url.replace(
                  "media/product_gallery/",
                  ""
                )}`
              : null,
          })),
        };
      }

      if (type === "product_list") {
        return {
          product_img: fileName ? `${s3Url}/${fileName}` : null,
          product_img_webp: webpFileName ? `${s3Url}/${webpFileName}` : null,
          product_name: p.product_name,
          stock_quantity: p.stock_quantity,
          product_slug: p.product_slug,
          product_title: p.product_title,
          product_is_wishlist,
          offer_price: p.offer_price,
          actual_price: p.actual_price,
          discount: calculateDiscount(p.actual_price, p.offer_price) + "%",
          product_sku: p.product_sku,
          product_slug: p.product_slug,
          status: p.status,
          is_wishlist,
          is_cart,
          view_count: p.view_count,
          is_stock: p.is_stock,
          productlist: p.productlist,
          _id: p._id,
          guid: p.guid,
          brand_id: p.brand_id,
          brand_name: p.brand_name || null,
          created_at: moment(p.created_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment(p.updated_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
          net_quantity: p.net_quantity,
          color_name: p.color_name || null,
          color_code: p.color_code || null,
          age_id: age_ids,
          agenamelist: age_names,
          category_id: category_ids,
          categorynamelist: category_names,
          gallery_images: (galleryMap[pid] || []).map((g) => ({
            ...g,
            product_gallery_url: g.product_gallery_url
              ? `${galleryS3Url}/${g.product_gallery_url.replace(
                  "media/product_gallery/",
                  ""
                )}`
              : null,
          })),
        };
      }
    });

    const count = await Product.countDocuments(query);
    
    if (type === "product_detail" && productDocs.length > 0 && product_slug) {
      const pids = productDocs.map(p => p._id);
      await Product.updateMany(
        { _id: { $in: pids } },
        { $inc: { view_count: 1 } }
      );
    }

    res.status(200).json({
      status: 200,
      message: "Products fetched successfully",
      count,
      data: finalProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  const deleteUploadedTemp = () => {
    if (req.file && config.NODE_ENV !== "production") {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("Failed to delete temp file:", e.message);
      }
    }
  };

  try {
    const productId = req.body?.id?.trim();
    if (!productId) {
      deleteUploadedTemp();
      return res.status(400).json({
        status: 400,
        error: { id: ["Product ID is required"] },
      });
    }
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      deleteUploadedTemp();
      return res.status(404).json({ message: "Product not found" });
    }

    const restricted = new Set([
      "id",
      // "created_at",
      // "product_img"
    ]);

    for (const key in req.body) {
      if (req.body[key] === "" || req.body[key] === "null") {
        req.body[key] = null;
      }
    }
    const updateData = {};
    // Now add fields to updateData
    for (const [key, value] of Object.entries(req.body)) {
      if (!restricted.has(key)) {
        updateData[key] = value;
      }
    }
    if (req.body.product_title) {
      updateData.product_slug = generateSlug(req.body.product_title);
    }

    if (req.body.material_id) {
      const material = await Material.findById(req.body.material_id).select(
        "material_name"
      );
      updateData.material_name = material?.material_name || null;
    }

    if (req.body.skill_id) {
      const skill = await Skill.findById(req.body.skill_id).select(
        "skill_name"
      );
      updateData.skill_name = skill?.skill_name || null;
    }

    if (req.body.commodity_id) {
      const commodity = await Commodity.findById(req.body.commodity_id).select(
        "commodity_name"
      );
      updateData.commodity_name = commodity?.commodity_name || null;
    }

    if (req.body.brand_id) {
      const brand = await Brand.findById(req.body.brand_id).select(
        "brand_name"
      );
      updateData.brand_name = brand?.brand_name || null;
    }

    // HANDLE IMAGE UPLOAD
    if (req.file) {
      let newOriginal, newWebp;

      try {
        if (config.NODE_ENV === "production") {
          const uploadResult = await uploadToS3AndCreateWebp(
            req.file,
            "product"
          );
          newOriginal = uploadResult.originalKey;
          newWebp = uploadResult.webpKey;
        } else {
          const result = await saveLocalAndCreateWebp(req.file, "product");
          newOriginal = result.originalPath;
          newWebp = result.webpPath;
        }
      } catch (err) {
        deleteUploadedTemp();
        throw err;
      }

      // DELETE OLD IMAGES (LOCAL / S3)
      try {
        if (config.NODE_ENV === "production") {
          const keysToDelete = [
            existingProduct.product_img,
            existingProduct.product_img_webp,
          ].filter(Boolean);

          if (keysToDelete.length > 0) await deleteS3Objects(keysToDelete);
        } else {
          deleteLocalImages(
            existingProduct.product_img,
            existingProduct.product_img_webp
          );
        }
      } catch (err) {
        // console.warn("Failed to delete old images:", err.message);
      }

      updateData.product_img = newOriginal;
      updateData.product_img_webp = newWebp;
    }

    updateData.updated_at = Date.now();

    // Update document
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    // Handle relation data
    // category
    const rawCategoryList =
      req.body["category_list[]"] ?? req.body["category_list"];

    const isExplicitClear = rawCategoryList === "__EMPTY__";

    if (isExplicitClear) {
      await RelationalCategory.deleteMany({ product_id: productId });
    } else if (
      rawCategoryList !== undefined &&
      rawCategoryList !== null &&
      rawCategoryList !== ""
    ) {
      let categorylist = rawCategoryList;

      if (!Array.isArray(categorylist)) {
        categorylist = [categorylist];
      }

      categorylist = categorylist.filter(Boolean).map(String);

      const existingCategories = await RelationalCategory.find({
        product_id: productId,
      }).lean();

      const existingIds = existingCategories.map((c) => String(c.category_id));

      const toDelete = existingIds.filter((id) => !categorylist.includes(id));

      if (toDelete.length) {
        await RelationalCategory.deleteMany({
          product_id: productId,
          category_id: { $in: toDelete },
        });
      }

      for (const categoryId of categorylist) {
        const exists = await RelationalCategory.findOne({
          product_id: productId,
          category_id: categoryId,
        });

        if (!exists) {
          await RelationalCategory.create({
            product_id: productId,
            category_id: categoryId,
          });
        }
      }
    }

   // TAG
    const rawTagList =
      req.body["tag_list[]"] ?? req.body["tag_list"];

    const isExplicitClearTag = rawTagList === "__EMPTY__";

    if (isExplicitClearTag) {
      // User explicitly cleared all tags
      await RelationalTag.deleteMany({ product_id: productId });

    } else if (
      rawTagList !== undefined &&
      rawTagList !== null &&
      rawTagList !== ""
    ) {
      let taglist = rawTagList;

      if (!Array.isArray(taglist)) {
        taglist = [taglist];
      }

      taglist = taglist.filter(Boolean).map(String);

      const existingTags = await RelationalTag.find({
        product_id: productId,
      }).lean();

      const existingTagIds = existingTags.map(t =>
        String(t.tag_id)
      );

      const tagsToDelete = existingTagIds.filter(
        id => !taglist.includes(id)
      );

      if (tagsToDelete.length) {
        await RelationalTag.deleteMany({
          product_id: productId,
          tag_id: { $in: tagsToDelete },
        });
      }

      for (const tagId of taglist) {
        const exists = await RelationalTag.findOne({
          product_id: productId,
          tag_id: tagId,
        });

        if (!exists) {
          await RelationalTag.create({
            product_id: productId,
            tag_id: tagId,
          });
        }
      }
    }

    // character
    const rawCharacterList =
      req.body["character_list[]"] ?? req.body["character_list"];

    const isExplicitcharClear = rawCharacterList === "__EMPTY__";

    if (isExplicitcharClear) {
      // Delete all characters for this product
      await RelationalCharacter.deleteMany({ product_id: productId });
    } else if (
      rawCharacterList !== undefined &&
      rawCharacterList !== null &&
      rawCharacterList !== ""
    ) {
      let characterlist = rawCharacterList;

      if (!Array.isArray(characterlist)) {
        characterlist = [characterlist];
      }

      characterlist = characterlist.filter(Boolean).map(String);

      const existingCharacters = await RelationalCharacter.find({
        product_id: productId,
      }).lean();

      const existingCharIds = existingCharacters.map((c) => String(c.character_id));

      // Delete characters that are not in the new list
      const charsToDelete = existingCharIds.filter(
        (id) => !characterlist.includes(id)
      );

      if (charsToDelete.length > 0) {
        await RelationalCharacter.deleteMany({
          product_id: productId,
          character_id: { $in: charsToDelete },
        });
      }

      // Add new characters if they don't exist
      for (const characterId of characterlist) {
        const exists = await RelationalCharacter.findOne({
          product_id: productId,
          character_id: characterId,
        });

        if (!exists) {
          await RelationalCharacter.create({
            product_id: productId,
            character_id: characterId,
          });
        }
      }
    }

    // age
   const rawAgeList = req.body["age_list[]"] ?? req.body["age_list"];

    const isExplicitageClear = rawAgeList === "__EMPTY__";

    if (isExplicitageClear) {
      // Delete all ages for this product
      await RelationalAge.deleteMany({ product_id: productId });
    } else if (
      rawAgeList !== undefined &&
      rawAgeList !== null &&
      rawAgeList !== ""
    ) {
      let ageList = rawAgeList;

      if (!Array.isArray(ageList)) {
        ageList = [ageList];
      }

      ageList = ageList.filter(Boolean).map(String);

      const existingAges = await RelationalAge.find({
        product_id: productId,
      }).lean();

      const existingAgeIds = existingAges.map((a) => String(a.age_id));

      // Delete ages that are not in the new list
      const agesToDelete = existingAgeIds.filter((id) => !ageList.includes(id));

      if (agesToDelete.length > 0) {
        await RelationalAge.deleteMany({
          product_id: productId,
          age_id: { $in: agesToDelete },
        });
      }

      // Add new ages if they don't exist
      for (const ageId of ageList) {
        const exists = await RelationalAge.findOne({
          product_id: productId,
          age_id: ageId,
        });

        if (!exists) {
          await RelationalAge.create({
            product_id: productId,
            age_id: ageId,
          });
        }
      }
    }

    // old logic only insert not remove
    // let categorylist = req.body['category_list[]'] || req.body['category_list'] || [];
    // if (categorylist && !Array.isArray(categorylist)) categorylist = [categorylist];
    // if (categorylist.length > 0) {
    //   for (const categoryId of categorylist) {
    //     if (!categoryId) continue;
    //     const exists = await RelationalCategory.findOne({
    //       product_id: productId,
    //       category_id: categoryId,
    //     });
    //     if (!exists) {
    //       await RelationalCategory.create({
    //         product_id: productId,
    //         category_id: categoryId,
    //       });
    //     }
    //   }
    // }

    return res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (err) {
    deleteUploadedTemp();
    next(err);
  }
};

// search api
exports.searchProductTitles = async (req, res, next) => {
  try {
    const { search } = req.body || {};

    if (!search || search.trim() === "") {
      return res.status(400).json({
        status: 400,
        message: "search is required",
      });
    }

    const query = {
      status: 1,
      product_title: { $regex: search, $options: "i" },
    };

    // Only pick these two fields
    const products = await Product.find(query)
      .select("product_title product_slug")
      .limit(20)
      .lean();

    return res.status(200).json({
      status: 200,
      message: "Search results",
      count: products.length,
      data: products,
    });
  } catch (err) {
    next(err);
  }
};

// Bulk Import
exports.bulkImportProducts = async (req, res, next) => {
  const deleteUploadedTemp = () => {
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        logger.warn("Failed to delete temp file:", e.message);
      }
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded. Please upload a .xlsx file.",
      });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    if (data.length > 0) {
      logger.info("Bulk Import - First Row Keys:", Object.keys(data[0]));
    }

    if (!data || data.length === 0) {
      deleteUploadedTemp();
      return res.status(400).json({
        status: 400,
        message: "Excel sheet is empty",
      });
    }

    // Helper to clean numbers (remove commas, currency symbols)
    const cleanNumber = (val) => {
      if (!val) return 0;
      const str = String(val).replace(/[^0-9.]/g, "");
      return Number(str) || 0;
    };

    // --- PRE-FETCH RELATIONAL DATA FOR LOOKUP ---
    const [categories, ages, brands, colors] = await Promise.all([
      Category.find().select("_id category_name").lean(),
      Age.find().select("_id age_group").lean(),
      Brand.find().select("_id brand_name").lean(),
      Color.find().select("_id color_name").lean(),
    ]);

    // Create Maps (LowerCase Name -> { _id, name })
    const categoryMap = new Map();
    categories.forEach((c) => {
      if (c.category_name)
        categoryMap.set(c.category_name.trim().toLowerCase(), {
          _id: c._id,
          name: c.category_name,
        });
    });

    const ageMap = new Map();
    ages.forEach((a) => {
      if (a.age_group)
        ageMap.set(a.age_group.trim().toLowerCase(), {
          _id: a._id,
          name: a.age_group,
        });
    });

    const brandMap = new Map();
    brands.forEach((b) => {
      if (b.brand_name)
        brandMap.set(b.brand_name.trim().toLowerCase(), {
          _id: b._id,
          name: b.brand_name,
        });
    });

    const colorMap = new Map();
    colors.forEach((c) => {
      if (c.color_name)
        colorMap.set(c.color_name.trim().toLowerCase(), {
          _id: c._id,
          name: c.color_name,
        });
    });

    const errors = [];
    let successCount = 0;

    for (const [index, row] of data.entries()) {
      try {
        // ... (short desc logic)

        let shortDescription = row.product_short_description;
        if (!shortDescription || String(shortDescription).trim() === "") {
          shortDescription = row.product_description
            ? String(row.product_description).substring(0, 100)
            : row.product_name || "Details coming soon";
        } else {
          const words = String(shortDescription).split(/\s+/);
          if (words.length > 100) {
            shortDescription = words.slice(0, 100).join(" ") + "...";
          }
        }

        const sku = `GEN-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}-${index}`;

        // --- RESOLVE OR CREATE LOGIC ---
        const resolveEntry = async (map, value, type) => {
          if (!value) return null;
          const key = String(value)
            .replace(/^["']|["']$/g, "")
            .trim()
            .toLowerCase(); // Strip quotes and trim

          if (map.has(key)) {
            return map.get(key);
          }

          // Auto-Create Logic for Age and Color
          try {
            if (type === "Age") {
              // Create Age
              const newAge = await Age.create({
                age_group: String(value).trim(),
                age_label: "Years", // Default
                status: 1,
              });
              const entry = { _id: newAge._id, name: newAge.age_group };
              map.set(key, entry); // Update map
              return entry;
            } else if (type === "Color") {
              // Create Color
              const newColor = await Color.create({
                color_name: String(value).trim(),
                color_code: "#000000", // Default Black
                status: 1,
              });
              const entry = { _id: newColor._id, name: newColor.color_name };
              map.set(key, entry);
              return entry;
            }
          } catch (err) {
            // Determine if error is Duplicate Key (race condition)
            if (err.code === 11000) {
              // Try fetching again
              if (type === "Age") {
                const existing = await Age.findOne({ age_group: value })
                  .select("_id age_group")
                  .lean();
                if (existing)
                  return { _id: existing._id, name: existing.age_group };
              }
              if (type === "Color") {
                const existing = await Color.findOne({ color_name: value })
                  .select("_id color_name")
                  .lean();
                if (existing)
                  return { _id: existing._id, name: existing.color_name };
              }
            }
            // Log warning but don't fail entire row just for this
            // console.warn(`Failed to auto-create ${type}: ${err.message}`);
          }

          return null;
        };

        const categoryEntry = await resolveEntry(
          categoryMap,
          row.category_id,
          "Category"
        );
        const ageEntry = await resolveEntry(ageMap, row.age_id, "Age");
        const brandEntry = await resolveEntry(brandMap, row.brand_id, "Brand");
        const colorEntry = await resolveEntry(colorMap, row.color_id, "Color");

        // Prepare object

        // Helper for numbers
        const cleanNum = (v) => Number(String(v || 0).replace(/[^0-9.]/g, ""));

        // Prepare object
        const productData = {
          product_name: row.product_name,
          product_title: row.product_title,
          stock_quantity: cleanNum(row.stock_quantity),
          net_quantity: row.net_quantity,
          // category_id and age_id are relational, not in Product schema
          // brand_id is in Product schema
          brand_id: brandEntry ? brandEntry._id : null,
          brand_name: brandEntry ? brandEntry.name : null, // Populate Name
          offer_price: cleanNum(row.offer_price),
          actual_price: cleanNum(row.actual_price),
          color: colorEntry ? colorEntry._id : null, // Mapped to 'color' field
          product_weight: row.product_weight,
          product_dimensions: row.product_dimensions,
          is_stock: row.is_stock ? String(row.is_stock) : "1",
          is_bestseller: cleanNum(row.is_bestseller),
          is_trending: cleanNum(row.is_trending),
          product_description: row.product_description || "",
          product_short_description: shortDescription,

          product_sku: sku,
          product_slug: row.product_name
            ? generateSlug(row.product_name)
            : undefined,

          status: 1,
          created_by: req.user ? req.user._id : null,
        };

        // Basic validation before DB
        if (!productData.product_name)
          throw new Error("Product Name is required");
        if (!productData.product_title)
          throw new Error("Product Title is required");

        // 1. Create Product
        const newProduct = await Product.create(productData);

        // 2. Insert Relational Data (Category)
        if (categoryEntry) {
          await RelationalCategory.create({
            product_id: newProduct._id,
            category_id: categoryEntry._id,
          });
        }

        // 3. Insert Relational Data (Age)
        if (ageEntry) {
          await RelationalAge.create({
            product_id: newProduct._id,
            age_id: ageEntry._id,
          });
        }

        successCount++;
      } catch (err) {
        errors.push({ row: index + 2, error: err.message });
      }
    }

    deleteUploadedTemp();

    res.status(200).json({
      status: 200,
      message: `${successCount} products imported successfully.`,
      errors: errors.length > 0 ? errors : undefined,
      count: successCount,
    });
  } catch (err) {
    deleteUploadedTemp();
    next(err);
  }
};

// Bulk Import Images
exports.bulkImportProductsImages = async (req, res, next) => {
  const deleteUploadedTemp = () => {
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        logger.warn("Failed to delete temp file:", e.message);
      }
    }
  };

  const downloadImage = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");
      const contentType = response.headers["content-type"];
      // extension map
      let ext = ".jpg";
      if (contentType === "image/png") ext = ".png";
      if (contentType === "image/webp") ext = ".webp";
      if (contentType === "image/jpeg") ext = ".jpg";

      const fileName = `downloaded-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}${ext}`;
      return { buffer, fileName, contentType };
    } catch (error) {
      console.error(`Failed to download image from ${url}:`, error.message);
      return null;
    }
  };

  const processAndSaveImage = async (imgData, folder) => {
    // imgData = { buffer, fileName, contentType }
    if (!imgData) return null;

    if (config.NODE_ENV === "production") {
      // Mock req.file for uploadToS3AndCreateWebp
      const fileObj = {
        buffer: imgData.buffer,
        originalname: imgData.fileName,
        mimetype: imgData.contentType,
      };
      const uploadResult = await uploadToS3AndCreateWebp(fileObj, folder);
      return { original: uploadResult.originalKey, webp: uploadResult.webpKey };
    } else {
      // Dev: Write directly to target folder (like multer diskStorage does)
      // Folder structure: src/media/{folder}
      const uploadsDir = path.join(__dirname, "..", "media", folder);
      if (!fs.existsSync(uploadsDir))
        fs.mkdirSync(uploadsDir, { recursive: true });

      // Original Path
      const originalName = imgData.fileName;
      const originalParams = path.parse(originalName);
      // Ensure unique name
      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + originalParams.ext;

      const originalPath = path.join(uploadsDir, uniqueName);
      fs.writeFileSync(originalPath, imgData.buffer);

      // WebP Path
      const webpName = path.parse(uniqueName).name + ".webp";
      const webpPath = path.join(uploadsDir, webpName);

      // Create WebP only if input is NOT already webp (to avoid input=output error)
      if (originalPath !== webpPath) {
        await sharp(originalPath).webp({ quality: 80 }).toFile(webpPath);
      } else {
        // If already webp, just ensure it exists (it does, as originalPath)
        // We can optionally re-process to a temp file and rename back if quality change needed,
        // but for bulk import speed, just using original is fine.
      }

      // Return relative paths 'media/{folder}/filename'
      return {
        original: path.join("media", folder, uniqueName),
        webp: path.join("media", folder, webpName),
      };
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded. Please upload a .xlsx file.",
      });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    if (!data || data.length === 0) {
      deleteUploadedTemp();
      return res.status(400).json({
        status: 400,
        message: "Excel sheet is empty",
      });
    }

    // --- Pagination Logic ---
    const { offset, limit } = req.body;
    let paginatedInfo = "";

    if (offset !== undefined && limit !== undefined) {
      const start = parseInt(offset);
      const end = start + parseInt(limit);
      const totalRows = data.length;
      data = data.slice(start, end);
      paginatedInfo = ` (Processed rows ${start + 1} to ${Math.min(
        end,
        totalRows
      )} of ${totalRows})`;
    }

    const errors = [];
    let successCount = 0;

    for (const [index, row] of data.entries()) {
      try {
        const productName = String(row.product_name).trim(); // Ensure string and trim
        if (!productName) {
          errors.push({ row: index + 2, error: "Product Name is required" });
          continue;
        }

        // Find Product
        // Robust Regex matching:
        // 1. Escape special regex chars
        // 2. Normalize spaces (\s+)
        // 3. Normalize dashes (hyphen, en-dash, em-dash)
        const createRobustRegex = (str) => {
          // 1. Escape special chars
          let escaped = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

          // 2. Replace escaped spaces with \s+ (to match multiple spaces or non-breaking spaces)
          // Note: split by space and join by \s+ pattern
          escaped = escaped.split(/\\? /).join("\\s+");

          // 3. Replace dashes with character class [-–—] (hyphen, en-dash, em-dash)
          // Note: - might be escaped as \- depending on step 1.
          // We'll replace any dash-like char sequence with [-–—]
          escaped = escaped.replace(/[-–—]/g, "[-–—]");

          return new RegExp(`^${escaped}$`, "i");
        };

        const product = await Product.findOne({
          product_name: { $regex: createRobustRegex(productName) },
        });

        if (!product) {
          errors.push({
            row: index + 2,
            error: `Product not found: ${productName}`,
          });
          continue;
        }

        // 1. Handle Main Product Image
        if (row.product_img) {
          const imgData = await downloadImage(String(row.product_img).trim());
          if (imgData) {
            const saved = await processAndSaveImage(imgData, "product");
            if (saved) {
              // Delete old images if exist? (Optional - nice to have logic from updateProduct but keeping it simple for now as requested "insert only")
              // user said "in this api i want insert only... product_img - in tbl_product"
              // So I will update.
              product.product_img = saved.original;
              product.product_img_webp = saved.webp;
              product.is_upload = 1; // Mark as uploaded
              await product.save();
            }
          }
        }

        // 2. Handle Gallery Images 1-6
        const galleryUrls = [
          row.product_gallery_url_1,
          row.product_gallery_url_2,
          row.product_gallery_url_3,
          row.product_gallery_url_4,
          row.product_gallery_url_5,
          row.product_gallery_url_6,
        ];

        const galleryImagesToInsert = [];

        for (const url of galleryUrls) {
          if (url && String(url).trim() !== "") {
            const imgData = await downloadImage(String(url).trim());
            if (imgData) {
              const saved = await processAndSaveImage(
                imgData,
                "product_gallery"
              );
              if (saved) {
                galleryImagesToInsert.push({
                  product_id: product._id,
                  product_gallery_url: saved.original,
                  // Schema might not have webp field? Let's check ProductGallery schema.
                  // Reading step 22: productGallerySchema has only product_gallery_url. NO webp field in schema.
                  // Wait, user logic snippet:
                  // images.push({ product_id, product_gallery_url: originalPath, product_gallery_url_webp: webpPath });
                  // User said "in this sheet fields... product_gallery_url_1...".
                  // User said "check this" and provided logic.
                  // Logic provided:
                  /*
                   images.push({
                     product_id,
                     product_gallery_url: originalPath,
                     product_gallery_url_webp: webpPath,
                   });
                   const savedImages = await ProductGallery.insertMany(images);
                  */
                  // BUT Step 22 shows `productGallery.js` Schema DOES NOT HAVE `product_gallery_url_webp`!
                  // Schema: { product_id, product_gallery_url, status, ... }
                  // User provided snippet suggests they WANT webp or think it's there.
                  // Or maybe schema is outdated in file vs db?
                  // Only `product_gallery_url` is in schema (Step 22).
                  // I should probably follow the Schema I see (Step 22). OR I should check if I missed something.
                  // Re-reading Step 22 output...
                  // 10:     product_gallery_url: { type: String, required: true },
                  // No webp.
                  // I will just note this. I will Save whatever I can.
                  // If I pass extra field to mongoose create/insertMany, it will just ignore it if strict is true (default).
                  // I will stick to schema.
                });
              }
            }
          }
        }

        if (galleryImagesToInsert.length > 0) {
          await ProductGallery.insertMany(galleryImagesToInsert);
        }

        successCount++;
      } catch (err) {
        errors.push({ row: index + 2, error: err.message });
      }
    }

    deleteUploadedTemp();
    res.status(200).json({
      status: 200,
      message: `${successCount} products updated with images successfully.${paginatedInfo}`,
      errors: errors.length > 0 ? errors : undefined,
      count: successCount,
    });
  } catch (err) {
    deleteUploadedTemp();
    next(err);
  }
};

// UPDATE SEO FIELDS FOR ALL PRODUCTS
exports.updateAllProductSEO = async (req, res) => {
  try {
    const products = await Product.find({}); // fetch all products

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    const updates = products.map((p) => ({
      updateOne: {
        filter: { _id: p._id },
        update: {
          seo_title: p.product_title ? `${p.product_title} | Runr Kids` : null,
          seo_keyword: "Runr-kids",
          seo_canonical: "https://runrkids.in/",
          seo_url: `https://runrkids.in/product/${p.product_slug}`,
          // updated_at: new Date()
        },
      },
    }));

    await Product.bulkWrite(updates);

    return res.status(200).json({
      message: "SEO fields updated successfully for all products",
    });
  } catch (error) {
    console.error("SEO Update Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.manageStockList = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order } =
      req.body || {};

    const statusFilter = status && status.length ? status : ["1"];
    let query = {
      status: { $in: statusFilter },
    };

    if (search) {
      query.$or = [
        { product_name: { $regex: search, $options: "i" } },
        { product_title: { $regex: search, $options: "i" } },
        { product_sku: { $regex: search, $options: "i" } },
      ];
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let productQuery = Product.find(query)
      .select(
        "product_img product_name product_title offer_price actual_price product_sku stock_quantity"
      )
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      productQuery = productQuery.limit(pageLimit);
    }

    const products = await productQuery;
    const count = await Product.countDocuments(query);

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product";

    const data = products.map((item) => {
      const fileName = item.product_img
        ? item.product_img.split("/").pop()
        : null;
      let webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;

      const product_img_url = fileName
        ? config.NODE_ENV === "production"
          ? `${s3Url}/${fileName}`
          : `${baseUrl}/media/product/${fileName}`
        : null;

      const product_img_url_webp = webpFileName
        ? config.NODE_ENV === "production"
          ? `${s3Url}/${webpFileName}`
          : `${baseUrl}/media/product/${webpFileName}`
        : null;

      // Logic: 0 or less => Out of stock, > 0 => In stock
      // Default to "Out of stock" if undefined, though it should be defined
      const quantity =
        item.stock_quantity !== undefined ? item.stock_quantity : 0;
      const is_stock = quantity > 0 ? "1" : "0";

      return {
        _id: item._id,
        product_img: product_img_url,
        product_img_webp: product_img_url_webp,
        product_name: item.product_name,
        product_title: item.product_title,
        offer_price: item.offer_price,
        actual_price: item.actual_price,
        product_sku: item.product_sku,
        stock_quantity: quantity,
        is_stock: is_stock,
      };
    });

    res.status(200).json({
      status: 200,
      message: "Stock list fetched successfully",
      count,
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { id, stock_quantity } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Product ID is required",
      });
    }

    if (
      stock_quantity === undefined ||
      stock_quantity === null ||
      isNaN(stock_quantity)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Valid stock_quantity is required",
      });
    }

    const quantity = parseInt(stock_quantity);
    if (quantity < 0) {
      return res.status(400).json({
        status: 400,
        message: "Stock quantity cannot be negative",
      });
    }

    const is_stock = quantity > 0 ? "1" : "0";

    const product = await Product.findByIdAndUpdate(
      id,
      {
        stock_quantity: quantity,
        is_stock: is_stock,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Stock updated successfully",
      data: {
        _id: product._id,
        stock_quantity: product.stock_quantity,
        is_stock: product.is_stock,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePrice = async (req, res, next) => {
  try {
    const { id, offer_price, actual_price } = req.body || {};

    if (!id) {
      return res.status(400).json({
        status: 400,
        message: "Product ID is required",
      });
    }

    if (
      offer_price === undefined ||
      actual_price === undefined ||
      offer_price === null ||
      actual_price === null ||
      isNaN(offer_price) ||
      isNaN(actual_price)
    ) {
      return res.status(400).json({
        status: 400,
        message: "Valid offer_price and actual_price is required",
      });
    }

    const offer_price_new = parseFloat(offer_price);
    if (offer_price_new < 0) {
      return res.status(400).json({
        status: 400,
        message: "Offer price cannot be negative",
      });
    }

    const actual_price_new = parseFloat(actual_price);
    if (actual_price_new < 0) {
      return res.status(400).json({
        status: 400,
        message: "Actual price cannot be negative",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      {
        offer_price: offer_price_new,
        actual_price: actual_price_new,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Price updated successfully",
      data: {
        _id: product._id,
        offer_price: product.offer_price,
        actual_price: product.actual_price,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Bulk Import Prices
exports.bulkImportProductsPrice = async (req, res, next) => {
  const deleteUploadedTemp = () => {
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (e) {
        logger.warn("Failed to delete temp file:", e.message);
      }
    }
  };

  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No file uploaded. Please upload a .xlsx file.",
      });
    }

    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet, { raw: false });

    if (!data || data.length === 0) {
      deleteUploadedTemp();
      return res.status(400).json({
        status: 400,
        message: "Excel sheet is empty",
      });
    }

    // --- Pagination Logic ---
    const { offset, limit } = req.body;
    let paginatedInfo = "";

    if (offset !== undefined && limit !== undefined) {
      const start = parseInt(offset);
      const end = start + parseInt(limit);
      const totalRows = data.length;
      data = data.slice(start, end);
      paginatedInfo = ` (Processed rows ${start + 1} to ${Math.min(
        end,
        totalRows
      )} of ${totalRows})`;
    }

    const errors = [];
    let successCount = 0;

    // Helper to clean numbers
    const cleanNumber = (val) => {
      if (!val) return 0;
      const str = String(val).replace(/[^0-9.]/g, "");
      return Number(str) || 0;
    };

    for (const [index, row] of data.entries()) {
      try {
        const productId = row._id ? String(row._id).trim() : null;

        if (!productId) {
          errors.push({
            row: index + 2,
            error: "_id is required in sheet",
          });
          continue;
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            errors.push({
                row: index + 2,
                error: `Invalid _id format: "${productId}"`,
            });
            continue;
        }

        // Find Product by _id
        let product = await Product.findById(productId);

        if (!product) {
          errors.push({
            row: index + 2,
            error: `Product not found with _id: "${productId}"`,
          });
          continue;
        }

        // Update Prices
        let updated = false;

        // Only update offer_price as per user request, but keeping actual_price support if needed implicitly
        // User request: "update the offer_price according _id"
        // Also: "update only which one given into the sheet."

        if (row.actual_price !== undefined && row.actual_price !== null && row.actual_price !== '') {
          const ap = cleanNumber(row.actual_price);
          if (ap >= 0) { // Allow 0
            product.actual_price = ap;
            updated = true;
          }
        }

        if (row.offer_price !== undefined && row.offer_price !== null && row.offer_price !== '') {
          const op = cleanNumber(row.offer_price);
          if (op >= 0) { // Allow 0
            product.offer_price = op;
            updated = true;
          }
        }
        
         if (row.stock_quantity !== undefined && row.stock_quantity !== null && row.stock_quantity !== '') {
            const sq = cleanNumber(row.stock_quantity);
             if (sq >= 0) {
                 product.stock_quantity = sq;
                 updated = true;
             }
         }

        if (updated) {
          product.updated_at = Date.now();
          await product.save();
          successCount++;
        } else {
          errors.push({
            row: index + 2,
            error: `Product found but no valid price/stock data to update.`,
          });
        }
      } catch (err) {
        errors.push({ row: index + 2, error: err.message });
      }
    }

    deleteUploadedTemp();
    res.status(200).json({
      status: 200,
      message: `${successCount} products updated successfully.${paginatedInfo}`,
      errors: errors.length > 0 ? errors : undefined,
      count: successCount,
    });
  } catch (err) {
    deleteUploadedTemp();
    next(err);
  }
};

// Low Stock List (<= 2)
exports.getLowStockProductsList = async (req, res, next) => {
  try {
    const {
      status,
      search,
      limit,
      offset,
      sort_by,
      sort_order,
      min_price,
      max_price,
    } = req.body || {};

    let statusFilter = [1];
    if (status)
      statusFilter = Array.isArray(status) ? status : [Number(status)];
    let query = { status: { $in: statusFilter } };

    query.stock_quantity = { $lte: 2 };

    if (search) {
      query.$or = [
        { product_title: { $regex: search, $options: "i" } },
        { product_name: { $regex: search, $options: "i" } },
      ];
    }

    if (min_price != null || max_price != null) {
      query.offer_price = {};
      if (min_price != null) query.offer_price.$gte = Number(min_price);
      if (max_price != null) query.offer_price.$lte = Number(max_price);
    }

    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;
    const sortField = sort_by || "stock_quantity";
    const sortDirection = sort_order === "desc" ? -1 : 1;

    const productDocs = await Product.find(query)
      .select(
        "product_img product_name stock_quantity product_slug product_title offer_price actual_price product_sku status created_at updated_at"
      )
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset)
      .limit(pageLimit)
      .lean();

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url =
      config.NODE_ENV === "production"
        ? "https://runrkids.s3.ap-south-1.amazonaws.com/media/product"
        : baseUrl + "/media/product";

    const finalProducts = productDocs.map((p) => {
      const fileName = p.product_img ? p.product_img.split("/").pop() : null;
      let webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;

      return {
        product_img: fileName ? `${s3Url}/${fileName}` : null,
        product_img_webp: webpFileName ? `${s3Url}/${webpFileName}` : null,
        product_name: p.product_name,
        stock_quantity: p.stock_quantity,
        product_slug: p.product_slug,
        product_title: p.product_title,
        offer_price: p.offer_price,
        actual_price: p.actual_price,
        product_sku: p.product_sku,
        status: p.status,
        _id: p._id,
        created_at: moment(p.created_at)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
        updated_at: moment(p.updated_at)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD HH:mm:ss"),
      };
    });

    const count = await Product.countDocuments(query);

    res.status(200).json({
      status: 200,
      message: "Products fetched successfully",
      count,
      data: finalProducts,
    });
  } catch (err) {
    next(err);
  }
};

exports.exportProductSheet = async (req, res, next) => {
  try {
    const externalApiUrl = "https://runr-kids.in1.cantechcloud.com/api/product/productlist";
    const payload = {
        type: "product_detail",
        status: 1,
        limit: 2000,
        offset: 0
    };

    const response = await axios.post(externalApiUrl, payload);
    
    if (!response.data || !response.data.data) {
        return res.status(404).json({ message: "No data received from external API" });
    }

    const products = response.data.data;
    const dataRows = products.map((p) => {
      return {
        product_img: p.product_img,
        product_img_webp: p.product_img_webp,
        product_name: p.product_name,
        product_description: p.product_description,
        product_short_description: p.product_short_description,
        product_title: p.product_title,
        offer_price: p.offer_price,
        actual_price: p.actual_price,
        discount: p.discount,
        product_sku: p.product_sku,
        product_slug: p.product_slug,
        stock_quantity: p.stock_quantity,
        is_stock: p.is_stock,
        seo_title: p.seo_title,
        seo_keyword: p.seo_keyword,
        seo_url: p.seo_url,
        seo_canonical: p.seo_canonical,
        
        net_quantity: p.net_quantity,
        product_weight: p.product_weight,
        package_content: p.package_content,
        product_dimensions: p.product_dimensions,
        pacakge_dimensions: p.pacakge_dimensions,
        country_of_origin: p.country_of_origin,
        manufacturer_name: p.manufacturer_name,
        manufacturer_address: p.manufacturer_address,
        marketer_name: p.marketer_name,
        marketer_address: p.marketer_address,
        gender: p.gender,
        guid: p.guid,
        remote_included: p.remote_included,

        is_bestseller: p.is_bestseller,
        is_trending: p.is_trending,
        
        color_name: p.color_name,
        brand_name: p.brand_name,
        skill_name: p.skill_name,
        material_name: p.material_name,
        commodity_name: p.commodity_name,

        categorynamelist: Array.isArray(p.categorynamelist) ? p.categorynamelist.join(", ") : p.categorynamelist,
        characternamelist: Array.isArray(p.characternamelist) ? p.characternamelist.join(", ") : p.characternamelist,
        tagnamelist: Array.isArray(p.tagnamelist) ? p.tagnamelist.join(", ") : p.tagnamelist,
        agenamelist: Array.isArray(p.agenamelist) ? p.agenamelist.join(", ") : p.agenamelist,

        _id: p._id,
      };
    });

    const ws = xlsx.utils.json_to_sheet(dataRows);
    
    const colWidths = Object.keys(dataRows[0] || {}).map(key => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Products");

    const fileBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `products_export_external_${Date.now()}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(fileBuffer);

  } catch (error) {
    if (error.response) {
        console.error("External API Error:", error.response.status, error.response.data);
    }
    next(error);
  }
};

exports.exportProductImageSheet = async (req, res, next) => {
  try {
    // 1. Fetch all active products (only fields we need)
    const productDocs = await Product.find({ status: 1 })
      .select("_id product_sku product_img")
      .sort({ created_at: -1 })
      .lean();

    const productIds = productDocs.map((p) => p._id);

    // 2. Fetch all gallery images for those products
    const galleries = await ProductGallery.find({
      product_id: { $in: productIds },
      status: "1",
    })
      .select("product_id product_gallery_url")
      .lean();

    // 3. Build a gallery map: product_id -> [url1, url2, ...]
    const galleryMap = {};
    galleries.forEach((g) => {
      const pid = g.product_id.toString();
      if (!galleryMap[pid]) galleryMap[pid] = [];
      galleryMap[pid].push(g.product_gallery_url);
    });

    // 4. Find max gallery count across all products (for dynamic column headers)
    let maxGalleryCount = 0;
    productIds.forEach((id) => {
      const count = (galleryMap[id.toString()] || []).length;
      if (count > maxGalleryCount) maxGalleryCount = count;
    });

    // 5. Build image URLs (always use S3)
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product";
    const galleryS3Url =
      "https://runrkids.s3.ap-south-1.amazonaws.com/media/product_gallery";

    // 6. Map each product into a flat row
    const dataRows = productDocs.map((p) => {
      const pid = p._id.toString();

      // Main image
      const fileName = p.product_img ? p.product_img.split("/").pop() : null;
      const webpFileName = fileName
        ? fileName.replace(/\.[^/.]+$/, ".webp")
        : null;

      const product_img = fileName ? `${s3Url}/${fileName}` : null;
      const product_img_webp = webpFileName ? `${s3Url}/${webpFileName}` : null;

      // Gallery images for this product
      const galleryUrls = (galleryMap[pid] || []).map((url) => {
        const gFile = url ? url.replace("media/product_gallery/", "") : null;
        return gFile ? `${galleryS3Url}/${gFile}` : null;
      });

      // Build the row object
      const row = {
        product_sku: p.product_sku,
        product_img,
        product_img_webp,
      };

      // Add dynamic gallery columns: "product_gallery_url 1", "product_gallery_url 2", etc.
      for (let i = 0; i < maxGalleryCount; i++) {
        row[`product_gallery_url ${i + 1}`] = galleryUrls[i] || null;
      }

      return row;
    });

    if (dataRows.length === 0) {
      return res.status(404).json({ status: 404, message: "No products found" });
    }

    // 7. Build Excel sheet
    const ws = xlsx.utils.json_to_sheet(dataRows);
    const colWidths = Object.keys(dataRows[0]).map(() => ({ wch: 80 }));
    ws["!cols"] = colWidths;

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Product Images");

    const fileBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=product_images_${Date.now()}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(fileBuffer);
  } catch (error) {
    next(error);
  }
};

// Most Viewed Products
exports.getMostViewedProducts = async (req, res, next) => {
  try {
    const { limit, offset } = req.body || {};
    const pageLimit = limit ? parseInt(limit) : 10;
    const pageOffset = offset ? parseInt(offset) : 0;

    const query = {
      status: 1,
      view_count: { $gt: 0 }
    };

    const products = await Product.find(query)
      .select("_id product_name product_slug product_sku view_count product_img")
      .sort({ view_count: -1 })
      .skip(pageOffset)
      .limit(pageLimit)
      .lean();

    const count = await Product.countDocuments(query);

    // Process image URLs if needed (standard practice for this codebase)
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product";

    const finalData = products.map((p) => {
      const fileName = p.product_img ? p.product_img.split("/").pop() : null;
       return {
        _id: p._id,
        product_name: p.product_name,
        product_slug: p.product_slug,
        product_sku: p.product_sku,
        view_count: p.view_count,
        product_img: fileName
          ? config.NODE_ENV === "production"
            ? `${s3Url}/${fileName}`
            : `${baseUrl}/media/product/${fileName}`
          : null
      };
    });

    res.status(200).json({
      status: 200,
      message: "Most viewed products fetched successfully",
      count,
      data: finalData
    });
  } catch (error) {
    next(error);
  }
};
