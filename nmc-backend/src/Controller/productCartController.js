const ProductCart = require('../Model/productCart');
const Product = require("../Model/product");
const ProductGallery = require("../Model/productGallery");
const Color = require("../Model/color");
const mongoose = require('mongoose');
const config = require("../Config/app");
const { calculateDiscount } = require('../helper');
const DeliveryAddress = require("../Model/deliveryAddress");
const Shipping = require("../Model/shipping");
const ShippingClass = require("../Model/shippingclass");
const ShippingMethod = require("../Model/shippingmethod");
const Coupon = require("../Model/coupon");
const moment = require("moment-timezone");

exports.addToCart = async (req, res, next) => {
  try {
    const { user_id, visitor_tag, product_id, quantity } = req.body || {};
    const errors = {};

    if (!product_id) errors.product_id = ["product_id is required"];

    if (!user_id && !visitor_tag) {
      errors.visitor_tag = ["visitor_tag is required when user_id is not provided"];
    }

    const qty = Number(quantity);
    if (quantity === undefined || quantity === null || quantity === "" || isNaN(qty)) {
      errors.quantity = ["Please add quantity"];
    } else if (qty < 1) {
      errors.quantity = ["Quantity can not be less than 1"];
    }

    if (Object.keys(errors).length) {
      return res.status(400).json({
        status: 400,
        error: errors
      });
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ status: 404, error: "Product not found" });
    }

    if (product.stock_quantity < qty) {
      return res.status(400).json({
        status: 400,
        error: `Insufficient stock for product: ${product.product_name}. Available: ${product.stock_quantity}`,
      });
    }

    let userCartItem = null;
    let visitorCartItem = null;

    if (user_id) {
      userCartItem = await ProductCart.findOne({ product_id, user_id, status: 1 });
    }

    if (visitor_tag) {
      visitorCartItem = await ProductCart.findOne({ product_id, visitor_tag, user_id: null, status: 1 });
    }

     // ---- Calculate total quantity for stock validation ----
    let existingQty = 0;
    if (userCartItem && visitorCartItem) {
      existingQty = userCartItem.quantity + visitorCartItem.quantity;
    } else if (userCartItem) {
      existingQty = userCartItem.quantity;
    } else if (visitorCartItem) {
      existingQty = visitorCartItem.quantity;
    }

    if (product.stock_quantity < existingQty + qty) {
      return res.status(400).json({
        status: 400,
        error: `Insufficient stock`,
      });
    }

    if (userCartItem && visitorCartItem) {
      userCartItem.quantity += visitorCartItem.quantity + qty;
      await userCartItem.save();
      
      await ProductCart.findByIdAndDelete(visitorCartItem._id);

      return res.status(200).json({
        status: 200,
        message: "Product quantity updated (merged visitor cart)",
        data: userCartItem,
      });
    }

    if (!userCartItem && visitorCartItem && user_id) {
      visitorCartItem.user_id = user_id;
      visitorCartItem.quantity += qty;
      await visitorCartItem.save();

      return res.status(200).json({
        status: 200,
        message: "Product added to cart (claimed visitor item)",
        data: visitorCartItem,
      });
    }

    if (userCartItem) {
      userCartItem.quantity += qty;
      await userCartItem.save();

      return res.status(200).json({
        status: 200,
        message: "Product quantity updated in cart",
        data: userCartItem,
      });
    }

    if (visitorCartItem && !user_id) {
        visitorCartItem.quantity += qty;
        await visitorCartItem.save();
  
        return res.status(200).json({
          status: 200,
          message: "Product quantity updated in cart",
          data: visitorCartItem,
        });
    }

    const newCartItem = await ProductCart.create({
      product_id,
      user_id: user_id || null,
      visitor_tag: visitor_tag || null,
      quantity: qty,
      status: 1
    });

    return res.status(200).json({
      status: 200,
      message: "Product added to cart successfully",
      data: newCartItem
    });

  } catch (err) {
    next(err);
  }
};

exports.updateCart = async (req, res, next) => {
  const { id, quantity, product_id, ...rest } = req.body || {};

  if (!req.body || !req.body.id) {
    return res.status(400).json({
      status: 400,
      error: { id: ["ID field is required."] },
    });
  }

  try {

    const qty = Number(quantity);
    if (quantity === undefined || quantity === null || quantity === "" || isNaN(qty)) {
      errors.quantity = ["Please add quantity"];
    } else if (qty < 1) {
      errors.quantity = ["Quantity can not be less than 1"];
    }

    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ status: 404, error: "Product not found" });
    }

    if (product.stock_quantity < qty) {
      return res.status(400).json({
        status: 400,
        error: `Insufficient stock for product: ${product.product_name}. Available: ${product.stock_quantity}`,
      });
    }

    const updateData = {};

    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null && rest[key] !== "") {
        updateData[key] = rest[key];
      }
    });

    updateData.quantity = qty;
    updateData.updated_at = Date.now();

    const cart = await ProductCart.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      context: "query"
    });

    if (!cart) {
      return res.status(404).json({
        status: 404,
        error: { id: ["Cart not found."] }
      });
    }

    res.status(200).json({
      status: 200,
      message: "Cart updated successfully",
      data: cart
    });

  } catch (err) {
    next(err);
  }
};

exports.getAllCarts = async (req, res, next) => {
  try {
    const { status, search, limit, offset, sort_by, sort_order, product_id, user_id, visitor_tag, type } = req.body;

    const typeView = type || "order_list";

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
    if (visitor_tag) {
      query.visitor_tag = visitor_tag;
    }
    if (product_id) {
      query.product_id = new mongoose.Types.ObjectId(product_id);
    }
    if (user_id) {
      query.user_id = new mongoose.Types.ObjectId(user_id);
    }
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "createdAt";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let cartQuery = ProductCart.find(query)
      .populate({
        path: "product_id",
        select: "product_title product_img product_name product_slug product_sku actual_price offer_price is_stock"
      })
      .populate({
        path: "user_id"
      })
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      cartQuery = cartQuery.limit(pageLimit);
    }

    let cartlist = await ProductCart.aggregate([
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
        $lookup: {
          from: "colors",
          localField: "product.color",
          foreignField: "_id",
          as: "color_info"
        }
      },
      { $unwind: { path: "$color_info", preserveNullAndEmptyArrays: true } },
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

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const bucketName = config.AWS_BUCKET_NAME || "runrkids";
    const region = config.AWS_REGION || "ap-south-1";

    const productBaseUrl =
      config.NODE_ENV === "production"
        ? `https://${bucketName}.s3.${region}.amazonaws.com/`
        : `${baseUrl}/`;

    const count = await ProductCart.countDocuments(query);
    const cartList = cartlist.map((item) => {
      return {
        id: item._id,
        visitor_tag: item.visitor_tag,
        user_id: item.user_id,
        status: item.status,
        quantity: item.quantity,
        product_id: item.product?._id || null,
        product_title: item.product?.product_title || null,
        product_name: item.product?.product_name || null,
        product_img: productBaseUrl + item.product?.product_img || null,
        product_slug: item.product?.product_slug || null,
        product_sku: item.product?.product_sku || null,
        actual_price: item.product?.actual_price || null,
        offer_price: item.product?.offer_price || null,
        is_stock: item.product?.is_stock || null,
        stock_quantity: item.product?.stock_quantity || null,
        discount: (item.product?.actual_price && item.product?.offer_price) 
        ? Math.round(((item.product.actual_price - item.product.offer_price) / item.product.actual_price) * 100) + "%"
        : "0%",
        color: item.product?.color || null,
        color_name: item.color_info?.color_name || null,
        color_code: item.color_info?.color_code || null,
        product_gallery: item.gallery_images?.map(g => g.image_url) || [],
        product_webp_gallery: item.product_webp_gallery?.map(g => g.webp_url) || [],
        is_wishlist: item.is_wishlist,
      }
    });

    res.status(200).json({
      message: "cart list fetched successfully",
      status: 200,
      count,
      data: cartList,
    });
  } catch (error) {
    next(error);
  }

};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { _id } = req.body || {};

    if (!_id) {
      return res.status(400).json({
        status: 400,
        message: "_id is required",
      });
    }

    const deletedItem = await ProductCart.findByIdAndDelete(_id);

    if (!deletedItem) {
      return res.status(404).json({
        status: 404,
        message: "Cart item not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Item removed from cart successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCartVisitor = async (req, res, next) => {
  try {
    const { visitor_tag, user_id } = req.body;

    const errors = {};
    if (!visitor_tag) errors.visitor_tag = ["visitor_tag is required"];
    if (!user_id) errors.user_id = ["user_id is required"];

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ status: 400, error: errors });
    }
    const visitorItems = await ProductCart.find({ visitor_tag, status: 1, user_id: null });

    if (!visitorItems.length) {
      return res.status(400).json({
        status: 400,
        error: "No visitor cart items found to merge."
      });
    }
    const userItems = await ProductCart.find({ user_id, status: 1 });
    const userItemMap = new Map();
    userItems.forEach(item => {
      if (item.product_id) {
        userItemMap.set(item.product_id.toString(), item);
      }
    });

    let mergedCount = 0;
    let claimedCount = 0;

    for (const visitorItem of visitorItems) {
      if (!visitorItem.product_id) continue;

      const pidStr = visitorItem.product_id.toString();

      if (userItemMap.has(pidStr)) {
        const existingUserItem = userItemMap.get(pidStr);
        existingUserItem.quantity += visitorItem.quantity;
        await existingUserItem.save();
        await ProductCart.findByIdAndDelete(visitorItem._id);
        mergedCount++;
      } else {
        visitorItem.user_id = user_id;
        await visitorItem.save();
        claimedCount++;
        userItemMap.set(pidStr, visitorItem); 
      }
    }

    return res.status(200).json({
      status: 200,
      message: "Cart updated for all visitor items.",
      data: {
        merged: mergedCount,
        claimed: claimedCount
      }
    });

  } catch (err) {
    next(err);
  }
};

exports.getCartSummary = async (req, res, next) => {
    try {
        // IDOR FIX: Extract user_id from token
        let { billing_address_id, shipping_address_id, same_as_shipping, coupon_code } = req.body;

        const user_id = req.user.id;
        if (!user_id) {
            return res.status(400).json({ status: 400, error: "Authentication failed: User ID not found in token" });
        }

        // Address Fallback Logic
        if (!shipping_address_id && billing_address_id) {
            shipping_address_id = billing_address_id;
        }

        // Fetch Cart Items
        const cartItems = await ProductCart.find({ user_id, status: 1 });
        if (!cartItems.length) {
            return res.status(200).json({
                status: 200,
                message: "Cart is empty",
                data: {
                    item_count: 0,
                    subtotal: 0,
                    offer_total: 0,
                    tax: 0,
                    shipping: 0,
                    discount: 0,
                    grand_total: 0
                }
            });
        }

        // Determine State for Tax Calculation
        let billingState = "";
        let billingAddress = null;
        let shippingAddress = null;

        if (billing_address_id) {
            billingAddress = await DeliveryAddress.findOne({ _id: billing_address_id, status: 1 });
            if (billingAddress) billingState = billingAddress.state?.trim().toLowerCase();
        } 
        
        // Smart Fallback Logic
        if (shipping_address_id) {
             shippingAddress = await DeliveryAddress.findOne({ _id: shipping_address_id, status: 1 });
        }

        if (!shippingAddress && billingAddress) {
            shippingAddress = billingAddress;
            shipping_address_id = billing_address_id;
        }

        // Final check for state logic from fallback shipping address if needed (logic originally used shipping address if same_as_shipping)
        if (!billingState && shippingAddress && same_as_shipping) {
             billingState = shippingAddress.state?.trim().toLowerCase();
        }

        const businessState = "gujarat";
        let taxRateCGST = 0, taxRateSGST = 0, taxRateIGST = 0;

        if (billingState === businessState) {
            taxRateCGST = 0; // 9%
            taxRateSGST = 0; // 9%
        } else {
            // Default to IGST if state not matched or different
            // Note: If no address provided, we default to IGST (Standard practice until address known)
            taxRateIGST = 0; // 18%
        }

        // Shipping Calculation
        let shippingCharge = 0;
        const shippingClass = await ShippingClass.findOne({ shipping_class_name: "Standard", status: 1 });
        const shippingMethod = await ShippingMethod.findOne({ shipping_method_name: "Free Shipping", status: 1 });

        if (shippingClass && shippingMethod) {
            const shippingData = await Shipping.findOne({
                shipping_class_id: shippingClass._id,
                shipping_method_id: shippingMethod._id,
                status: 1,
            });
            shippingCharge = shippingData ? Number(shippingData.shipping_rate) : 0;
        }

        // Pincode-based Shipping Charge Override
        if (shippingAddress && shippingAddress.postal_code) {
             const shippingPincode = shippingAddress.postal_code.toString().trim();
             const validPincodes = ["364001", "364002", "364003", "364004", "364005", "364006"];
             
             if (!validPincodes.includes(shippingPincode)) {
                 shippingCharge = 30;
             }
        }

        // Calculate Totals
        let subtotal = 0;
        let offerTotal = 0;
        let totalTax = 0;
        let totalItems = 0; // Sum of quantities

        for (const item of cartItems) {
            const product = await Product.findById(item.product_id);
            if (!product) continue;

            const qty = Number(item.quantity || 1);
            totalItems += qty;

            const actual = Number(product.actual_price || 0);
            const offer = Number(product.offer_price || actual);
            const itemOfferTotal = offer * qty;

            let itemTax = 0;
            if (billingState === businessState) {
                const cgst = (itemOfferTotal * taxRateCGST) / 100;
                const sgst = (itemOfferTotal * taxRateSGST) / 100;
                itemTax = cgst + sgst;
            } else {
                const igst = (itemOfferTotal * taxRateIGST) / 100;
                itemTax = igst;
            }

            subtotal += actual * qty;
            offerTotal += itemOfferTotal;
            totalTax += itemTax;
        }

        // Coupon Logic
        let couponDiscount = 0;
        let couponDetails = null;

        if (coupon_code) {
             const coupon = await Coupon.findOne({ coupon_code: coupon_code, status: 1 });
             if (coupon) {
                // Simplified check (expand if needed for expiry/min_amount)
                 if (coupon.discount_type === 'percentage') {
                      couponDiscount = (offerTotal * Number(coupon.coupon_percentage)) / 100;
                  } else if (coupon.discount_type === 'flat') {
                      couponDiscount = Number(coupon.coupon_percentage);
                  }
                  couponDetails = coupon;
             }
        }

        // Ensure discount doesn't exceed total
        if (couponDiscount > offerTotal) {
            couponDiscount = offerTotal;
        }

        // Formatting
        offerTotal = Number(offerTotal.toFixed(2));
        totalTax = Number(totalTax.toFixed(2));
        couponDiscount = Number(couponDiscount.toFixed(2));
        shippingCharge = Number(shippingCharge.toFixed(2));

        const orderTotal = offerTotal + totalTax;
        const grandTotal = Number((orderTotal + shippingCharge - couponDiscount).toFixed(2));

        res.status(200).json({
            status: 200,
            message: "Cart summary calculated successfully",
            data: {
                item_count: totalItems,
                subtotal: Number(subtotal.toFixed(2)), // MRP Total
                offer_total: offerTotal, // Selling Price Total
                tax: totalTax,
                shipping: shippingCharge,
                discount: couponDiscount,
                grand_total: grandTotal
            }
        });

    } catch (err) {
        next(err);
    }
};