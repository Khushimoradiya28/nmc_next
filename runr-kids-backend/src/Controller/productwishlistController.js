const Wishlist = require("../Model/productwishlist");
const { generateSlug } = require('../helper');
const moment = require("moment-timezone");
const config = require("../Config/app");
const mongoose = require("mongoose");

// add and remove
exports.addtoWishlist = async (req, res, next) => {
    try {
        const { product_id, user_id, visitor_tag } = req.body || {};

        if (!product_id) {
            return res.status(400).json({
                status: 400,
                message: "product_id is required."
            });
        }

        if (!user_id && !visitor_tag) {
             return res.status(400).json({
                status: 400,
                message: "visitor_tag is required when user_id is not provided."
            });
        }

        let userWishlist = null;
        if (user_id) {
            userWishlist = await Wishlist.findOne({
                product_id,
                user_id,
                is_wishlist: 1,
                status: 1
            });
        }

        let visitorWishlist = null;
        if (visitor_tag) {
             visitorWishlist = await Wishlist.findOne({
                product_id,
                visitor_tag,
                user_id: null,
                is_wishlist: 1,
                status: 1
            });
        }

        if (userWishlist) {
            userWishlist.is_wishlist = 0;
            userWishlist.status = 0;
            await userWishlist.save();

            return res.status(200).json({
                status: 200,
                is_wishlist: 0,
                message: "Product removed from wishlist.",
                data: userWishlist
            });
        }

        if (visitorWishlist && user_id) {
            visitorWishlist.user_id = user_id;
            visitorWishlist.is_wishlist = 0;
            visitorWishlist.status = 0;
            await visitorWishlist.save();

            return res.status(200).json({
                status: 200,
                is_wishlist: 0,
                message: "Product removed from wishlist (claimed visitor item).",
                data: visitorWishlist
            });
        }

        if (visitorWishlist && !user_id) {
            visitorWishlist.is_wishlist = 0;
            visitorWishlist.status = 0;
            await visitorWishlist.save();

            return res.status(200).json({
                status: 200,
                is_wishlist: 0,
                message: "Product removed from wishlist.",
                data: visitorWishlist
            });
        }

        const wishlist = await Wishlist.create({
            product_id,
            user_id: user_id || null,
            visitor_tag: visitor_tag || null,
            is_wishlist: 1,
            status: 1
        });

        return res.status(200).json({
            status: 200,
            is_wishlist: 1,
            message: "Product added to wishlist.",
            data: wishlist
        });

    } catch (err) {
        next(err);
    }
};

// not use
exports.removetoWishlist = async (req, res, next) => {
    try {
        const { product_id, user_id, visitor_tag } = req.body || {};

        if (!product_id) {
            return res.status(400).json({
                status: 400,
                error: { product_id: ["Product ID is required."] }
            });
        }

        if (!user_id && !visitor_tag) {
             return res.status(400).json({
                status: 400,
                message: "Either user_id or visitor_tag is required."
            });
        }

        let query = { product_id, status: 1 };

        if (user_id) {
            query.user_id = user_id;
        } else {
            // Visitor case: Must act on items that don't belong to a user
            query.visitor_tag = visitor_tag;
            query.user_id = null; 
        }

        // Find and soft delete (status=0, is_wishlist=0)
        const wishlist = await Wishlist.findOneAndUpdate(
            query,
            { status: 0, is_wishlist: 0, updated_at: Date.now() },
            { new: true }
        );

        if (!wishlist) {
            return res.status(404).json({ message: "Wishlist not found for this product" });
        }

        res.status(200).json({
            status: 200,
            message: "Product removed from wishlist successfully",
            data: wishlist
        });

    } catch (error) {
        next(error);
    }
};

// for convert into user_id
exports.updateVisitor = async (req, res, next) => {
    try {
        const { visitor_tag, user_id } = req.body;

        const errors = {};
        if (!visitor_tag) errors.visitor_tag = ["visitor_tag is required"];
        if (!user_id) errors.user_id = ["user_id is required"];

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ status: 400, error: errors });
        }

        const visitorItems = await Wishlist.find({ visitor_tag, status: 1, user_id: null });

        if (!visitorItems.length) {
            return res.status(400).json({
                status: 400,
                error: "No visitor wishlist items found to merge."
            });
        }

        const userItems = await Wishlist.find({ user_id, status: 1 });
        const userProductSet = new Set(userItems.map(item => item.product_id ? item.product_id.toString() : null));

        let mergedCount = 0;
        let claimedCount = 0;

        for (const visitorItem of visitorItems) {
            if (!visitorItem.product_id) continue;
            
            const pidStr = visitorItem.product_id.toString();

            if (userProductSet.has(pidStr)) {
                await Wishlist.findByIdAndDelete(visitorItem._id);
                mergedCount++;
            } else {
                visitorItem.user_id = user_id;
                await visitorItem.save();
                claimedCount++;
                userProductSet.add(pidStr);
            }
        }

        return res.status(200).json({
            status: 200,
            message: "Wishlist updated for all visitor items.",
            data: {
                merged: mergedCount,
                claimed: claimedCount
            }
        });

    } catch (err) {
        next(err);
    }
};

// not use
exports.deleteWishlist = async (req, res, next) => {
    if (!req.body || !req.body.id) {
        return res.status(400).json({
            status: 400,
            error: { id: ["ID field is required."] },
        });
    }
    try {
        const { id } = req.body;

        if (!id) return res.status(400).json({ message: "ID is required" });

        const wishlist = await Wishlist.findByIdAndUpdate(
            id,
            { status: 0, updated_at: Date.now() },
            { new: true }
        );
        if (!wishlist) {
            return res.status(404).json({ message: "wishlist not found" });
        }
        res.status(200).json({ status: 200, message: "Wishlist deleted successfully", data: wishlist });
    } catch (error) {
        next(error);
    }
};

// for list
exports.getAllWishlist = async (req, res, next) => {
    try {
        const { status, search, limit, offset, sort_by, sort_order, product_id, user_id, visitor_tag } = req.body;

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
            query.coupon_code = { $regex: search, $options: "i" };
        }
        if (user_id) {
            query.user_id = new mongoose.Types.ObjectId(user_id);
            // If user is logged in, we typically only show their items.
            // We ignore visitor_tag here to avoid limiting results to just this device's history, 
            // and to avoid picking up unclaimed items (which should be merged/hidden until merged).
        } else if (visitor_tag) {
            query.visitor_tag = visitor_tag;
            // IMPORTANT: If querying as visitor, ONLY show unclaimed items.
            // This prevents showing items that were previously claimed by a user (even if same visitor_tag).
            query.user_id = null;
        }
        
        if (product_id) {
            query.product_id = new mongoose.Types.ObjectId(product_id);
        }
        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        const sortField = sort_by || "createdAt";
        const sortDirection = sort_order === "asc" ? 1 : -1;

        let wishlistQuery = Wishlist.find(query)
            .populate({
                path: "product_id",
                select: "product_title product_name product_slug product_sku actual_price offer_price is_stock"
            })
            .populate({
                path: "user_id"
            })
            .sort({ [sortField]: sortDirection })
            .skip(pageOffset);

        if (pageLimit > 0) {
            wishlistQuery = wishlistQuery.limit(pageLimit);
        }

        let wishlist = await Wishlist.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "tbl_products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "productgalleries",
                    localField: "product_id",
                    foreignField: "product_id",
                    as: "gallery_images"
                }
            },
            {
                $addFields: {
                    gallery_images: {
                        $map: {
                            input: "$gallery_images",
                            as: "img",
                            in: {
                                _id: "$$img._id",
                                image_url: {
                                    $concat: [
                                        config.NODE_ENV === "production"
                                            ? "https://runrkids.s3.ap-south-1.amazonaws.com/media/product_gallery/"
                                            : `${req.protocol}://${req.get("host")}/media/product_gallery/`,
                                        {
                                            $arrayElemAt: [
                                                { $split: ["$$img.product_gallery_url", "/"] },
                                                -1
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    product_webp_gallery: {
                        $map: {
                            input: "$gallery_images",
                            as: "img",
                            in: {
                                _id: "$$img._id",
                                webp_url: {
                                    $concat: [
                                        config.NODE_ENV === "production"
                                            ? "https://runrkids.s3.ap-south-1.amazonaws.com/media/product_gallery/"
                                            : `${req.protocol}://${req.get("host")}/media/product_gallery/`,
                                        {
                                            $concat: [
                                                {
                                                    $arrayElemAt: [
                                                        {
                                                            $split: [
                                                                {
                                                                    $substr: [
                                                                        {
                                                                            $arrayElemAt: [
                                                                                { $split: ["$$img.product_gallery_url", "/"] },
                                                                                -1
                                                                            ]
                                                                        },
                                                                        0,
                                                                        {
                                                                            $subtract: [
                                                                                {
                                                                                    $strLenCP: {
                                                                                        $arrayElemAt: [
                                                                                            { $split: ["$$img.product_gallery_url", "/"] },
                                                                                            -1
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                {
                                                                                    $strLenCP: {
                                                                                        $arrayElemAt: [
                                                                                            {
                                                                                                $split: [
                                                                                                    {
                                                                                                        $arrayElemAt: [
                                                                                                            { $split: ["$$img.product_gallery_url", "/"] },
                                                                                                            -1
                                                                                                        ]
                                                                                                    },
                                                                                                    "."
                                                                                                ]
                                                                                            },
                                                                                            -1
                                                                                        ]
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                },
                                                                "."
                                                            ]
                                                        },
                                                        0
                                                    ]
                                                },
                                                ".webp"
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            { $sort: { [sortField]: sortDirection } },
            { $skip: pageOffset },
            ...(pageLimit > 0 ? [{ $limit: pageLimit }] : [])
        ]);

        const count = await Wishlist.countDocuments(query);
        const wishList = wishlist.map((item) => {

            return {
                id: item._id,
                product_id: item.product?._id || null,
                is_wishlist: item.is_wishlist,
                visitor_tag: item.visitor_tag,
                user_id: item.user_id,
                status: item.status,

                product_title: item.product?.product_title || null,
                product_name: item.product?.product_name || null,
                product_sku: item.product?.product_sku || null,
                product_slug: item.product?.product_slug || null,
                actual_price: item.product?.actual_price || null,
                offer_price: item.product?.offer_price || null,
                is_stock: item.product?.is_stock || null,
                stock_quantity: item.product?.stock_quantity || null,
                discount: (item.product?.actual_price && item.product?.offer_price) 
                    ? Math.round(((item.product.actual_price - item.product.offer_price) / item.product.actual_price) * 100) + "%"
                    : "0%",
                product_gallery: item.gallery_images?.map(g => g.image_url) || [],
                product_webp_gallery: item.product_webp_gallery?.map(g => g.webp_url) || []
            };
        });

        res.status(200).json({
            message: "Wishlist fetched successfully",
            status: 200,
            count,
            data: wishList,
        });
    } catch (error) {
        next(error);
    }

};

// Most Favorite Products (Aggregated by Wishlist count)
exports.getMostFavoriteProducts = async (req, res, next) => {
    try {
        const { limit, offset } = req.body || {};
        const pageLimit = limit ? parseInt(limit) : 10;
        const pageOffset = offset ? parseInt(offset) : 0;

        const pipeline = [
            // 1. Match valid wishlist items
            { 
                $match: { 
                    status: 1,
                    is_wishlist: 1
                } 
            },
            // 2. Group by product_id and count
            {
                $group: {
                    _id: "$product_id",
                    favourite_count: { $sum: 1 }
                }
            },
            // 3. Sort by favourite count desc
            { $sort: { favourite_count: -1 } },
            // 4. Pagination
            { $skip: pageOffset },
            { $limit: pageLimit },
            // 5. Lookup Product Details
            {
                $lookup: {
                    from: "tbl_products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" }, // Required to flatten the array
            // 6. Project Required Fields
            {
                $project: {
                    _id: "$product._id",
                    product_name: "$product.product_name",
                    product_slug: "$product.product_slug",
                    product_sku: "$product.product_sku",
                    view_count: "$product.view_count",
                    product_img: "$product.product_img",
                    favourite_count: 1
                }
            }
        ];

        const products = await Wishlist.aggregate(pipeline);

        // Process Images
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const s3Url = "https://runrkids.s3.ap-south-1.amazonaws.com/media/product";

        const finalData = products.map((p) => {
             const fileName = p.product_img ? p.product_img.split("/").pop() : null;
             return {
                 ...p,
                 product_img: fileName
                    ? config.NODE_ENV === "production"
                        ? `${s3Url}/${fileName}`
                        : `${baseUrl}/media/product/${fileName}`
                    : null
             };
        });
        
        // Count Total Unique Products in Wishlist
        // Note: countDocuments only counts rows, but we need unique products count.
        // For total pages, separate aggregation is needed.
        const countAgg = await Wishlist.aggregate([
            { $match: { status: 1, is_wishlist: 1 } },
            { $group: { _id: "$product_id" } },
            { $count: "total" }
        ]);
        const totalCount = countAgg.length > 0 ? countAgg[0].total : 0;

        res.status(200).json({
            status: 200,
            message: "Most favourite products fetched successfully",
            count: totalCount,
            data: finalData
        });

    } catch (error) {
        next(error);
    }
};
