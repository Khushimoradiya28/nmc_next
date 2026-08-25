const Review = require("../Model/review");
const mongoose = require("mongoose");
const Product = require("../Model/product");
const User = require("../Model/user");
const fs = require('fs');
const path = require('path');
const config = require("../Config/app");
const { escapeRegex } = require("../helper");
const { s3Upload } = require("../Utils/s3Client");

const isProduction = config.NODE_ENV === "production";

exports.addReview = async (req, res, next) => {
  try {
    const { product_id, rating, review, user_id } = req.body;
    const files = req.files || [];

    if (!product_id || !rating || !user_id) {
      return res.status(400).json({ success: false, message: "Product ID, User ID, and rating are required" });
    }

    const mediaPaths = [];

    for (const file of files) {
      const isImage = /jpeg|jpg|png|heic/.test(path.extname(file.originalname).toLowerCase());
      const isVideo = /mp4/.test(path.extname(file.originalname).toLowerCase());
      
      if (isImage && file.size > 5 * 1024 * 1024) {
         if (!isProduction && files.length > 0) {
            files.forEach(f => {
               if(f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
            });
         }
         return res.status(400).json({ success: false, message: `Image exceeds 5MB limit.` });
      }

      if (isVideo && file.size > 10 * 1024 * 1024) {
         if (!isProduction && files.length > 0) {
            files.forEach(f => {
               if(f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
            });
         }
         return res.status(400).json({ success: false, message: `Video exceeds 10MB limit.` });
      }
      
      if (isProduction) {
        const s3Key = await s3Upload(file, "review");
        mediaPaths.push(s3Key);
      } else {
          const relativePath = `media/review/${file.filename}`;
          mediaPaths.push(relativePath);
      }
    }

    const newReview = new Review({
      product_id,
      user_id,
      rating,
      review,
      media: mediaPaths,
      is_publish: 0, 
      status: true
    });

    await newReview.save();

    res.status(200).json({
      success: true,
      message: "Review added successfully",
      data: newReview
    });

  } catch (error) {
     if (!isProduction && req.files) {
        req.files.forEach(f => {
           if(f.path && fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
     }
    next(error);
  }
};

exports.getProductReviews = async (req, res, next) => {
    try {
        const { product_id, product_slug, is_publish, search, limit, offset } = req.body || {};
        
        let targetProductId = product_id;

        // If we have a slug but no ID, look it up
        if (!targetProductId && product_slug) {
            const product = await Product.findOne({ product_slug: product_slug }).select("_id");
            if (product) {
                targetProductId = product._id;
            } else {
                // Product not found for this slug -> return empty result immediately
                return res.status(200).json({
                    success: true,
                    count: 0,
                    data: [],
                    rating_stats: {
                        total_ratings: 0,
                        total_reviews: 0,
                        average_rating: 0,
                        rating_counts: [5, 4, 3, 2, 1].map(star => ({
                            star,
                            count: 0,
                            percentage: "0%"
                        }))
                    }
                });
            }
        }

        let query = { status: 1 };
        if (targetProductId) {
            query.product_id = targetProductId;
        }

        if (is_publish !== undefined && is_publish !== null) {
            query.is_publish = is_publish;
        }
        if (search) {
            const escapedSearch = escapeRegex(search.trim());

            // 1. Find matched products
            const products = await Product.find({
                product_name: { $regex: escapedSearch, $options: "i" }
            }).select("_id");
            const productIds = products.map(p => p._id);

            query.$or = [
                { review: { $regex: escapedSearch, $options: "i" } },
                { product_id: { $in: productIds } }
            ];
        }

        // Stats Query: Always scoped to published reviews for the product/context
        let statsQuery = { status: 1, is_publish: 1 };
        if (targetProductId) {
            statsQuery.product_id = new mongoose.Types.ObjectId(targetProductId);
        }

        const pageLimit = limit ? parseInt(limit) : 0;
        const pageOffset = offset ? parseInt(offset) : 0;

        let reviewsQuery = Review.find(query)
            .populate('user_id', 'first_name last_name profile_img') 
            .populate('product_id', 'product_name product_slug')
            .sort({ created_at: -1 })
            .skip(pageOffset);

        if (pageLimit > 0) {
            reviewsQuery = reviewsQuery.limit(pageLimit);
        }

        const [reviews, stats] = await Promise.all([
            reviewsQuery,
            Review.aggregate([
                { $match: statsQuery },
                {
                    $group: {
                        _id: "$rating",
                        count: { $sum: 1 },
                        reviewCount: { 
                            $sum: { 
                                $cond: [{ $ne: [{ $ifNull: ["$review", ""] }, ""] }, 1, 0] 
                            } 
                        }
                    }
                }
            ])
        ]);

        const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalSum = 0;
        let totalStatsRatingCount = 0; // Total number of ratings
        let totalStatsReviewCount = 0; // Total number of written reviews

        stats.forEach(item => {
            if (item._id >= 1 && item._id <= 5) {
                ratingMap[item._id] = item.count;
                totalSum += item._id * item.count;
                totalStatsRatingCount += item.count;
                totalStatsReviewCount += item.reviewCount || 0;
            }
        });

        const averageRating = totalStatsRatingCount > 0 ? (totalSum / totalStatsRatingCount).toFixed(1) : 0;
        
        // Transform reviews to include full media URL
        const reviewsWithFullPath = reviews.map(review => {
            const reviewObj = review.toObject(); // Convert to plain object
            if (reviewObj.media && reviewObj.media.length > 0) {
                 reviewObj.media = reviewObj.media.map(file => {
                     if (isProduction) {
                         return `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${file}`;
                     } else {
                         return `${req.protocol}://${req.get('host')}/${file}`;
                     }
                 });
            }
            if (reviewObj.product_id && reviewObj.product_id._id) {
                reviewObj.product_name = reviewObj.product_id.product_name;
                reviewObj.product_slug = reviewObj.product_id.product_slug;
                reviewObj.product_id = reviewObj.product_id._id;
            }
            if (reviewObj.user_id && reviewObj.user_id._id) {
                reviewObj.first_name = reviewObj.user_id.first_name;
                reviewObj.last_name = reviewObj.user_id.last_name;
                
                if (reviewObj.user_id.profile_img) {
                     if (isProduction) {
                         reviewObj.profile_img = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${reviewObj.user_id.profile_img}`;
                     } else {
                         reviewObj.profile_img = `${req.protocol}://${req.get('host')}/${reviewObj.user_id.profile_img}`;
                     }
                } else {
                    reviewObj.profile_img = null;
                }

                reviewObj.user_id = reviewObj.user_id._id;
            }
            return reviewObj;
        });

        res.status(200).json({
            success: true,
            count: reviewsWithFullPath.length,
            data: reviewsWithFullPath,
            rating_stats: {
                total_ratings: totalStatsRatingCount,
                total_reviews: totalStatsReviewCount,
                average_rating: averageRating,
                rating_counts: [5, 4, 3, 2, 1].map(star => {
                    const count = ratingMap[star];
                    const percentage = totalStatsRatingCount > 0 ? Math.round((count / totalStatsRatingCount) * 100) : 0;
                    return {
                        star,
                        count: count,
                        percentage: `${percentage}%`
                    };
                })
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateReview = async (req, res, next) => {
    try {
        const { review_id, is_publish } = req.body;

        if (!review_id || is_publish === undefined) {
            return res.status(400).json({ success: false, message: "Review ID and is_publish status are required" });
        }

        const review = await Review.findByIdAndUpdate(
            review_id,
            { is_publish: is_publish },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteReview = async (req, res, next) => {
    try {
        const { review_id } = req.body;

        if (!review_id) {
             return res.status(400).json({ success: false, message: "Review ID is required" });
        }

        const review = await Review.findByIdAndUpdate(
            review_id,
            { status: false },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.status(200).json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};
