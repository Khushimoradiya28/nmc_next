const Order = require("../Model/productOrder");
const OrderActivity = require("../Model/productOrderActivity");
const OrderItem = require("../Model/productOrderItem");
const Product = require("../Model/product");
const User = require("../Model/user");
const ProductCart = require("../Model/productCart");
const DeliveryAddress = require("../Model/deliveryAddress");
const Shipping = require("../Model/shipping");
const ShippingClass = require("../Model/shippingclass");
const ShippingMethod = require("../Model/shippingmethod");
const RelationalCategory = require("../Model/relationalcategory");
const Category = require("../Model/category");
const Coupon = require("../Model/coupon");
const Review = require("../Model/review");
const razorpay = require("../Config/razorpay");
const { generateInvoiceNumber, calculateDateRange } = require("../helper");
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("../Config/app");
const { generateInvoice } = require("../Utils/invoiceHelper");
const logger = require("../Utils/logger");
const path = require("path");
const fs = require("fs");
const { sendMail } = require("../Utils/mailer");
// const whatsappService = require("../Services/whatsappService");

exports.orderSummary = async (req, res, next) => {
  try {
    let { billing_address_id, shipping_address_id, same_as_shipping, payment_method } =
      req.body;
    same_as_shipping = Boolean(same_as_shipping);

    const user_id = req.user.id; // securely get user_id from token

    if (!user_id)
      return res
        .status(400)
        .json({ status: 400, error: "User not authenticated" });

    // Address Fallback Logic
    if (!shipping_address_id && billing_address_id) {
       shipping_address_id = billing_address_id;
    }

    if (!shipping_address_id)
      return res
        .status(400)
        .json({ status: 400, message: "shipping_address_id is required" });

    // Smart Address Resolution
    
    // Restore User & Cart Fetching (Accidentally removed in previous step)
    const UID = new mongoose.Types.ObjectId(user_id);

    // Fetch cart items
    const cartItems = await ProductCart.find({ user_id: UID, status: 1 });
    if (!cartItems.length)
      return res.status(400).json({ status: 400, error: "No items in cart" });

    // 1. Fetch both addresses independently first (if provided)
    let billingAddress = null;
    let shippingAddress = null;
    
    if (billing_address_id) {
         billingAddress = await DeliveryAddress.findOne({ _id: billing_address_id, status: 1 });
    }
    
    if (shipping_address_id) {
         shippingAddress = await DeliveryAddress.findOne({ _id: shipping_address_id, status: 1 });
    }

    // 2. Logic: same_as_shipping
    // If user says "Same as shipping", and we have a valid shipping address, use it for billing too.
    if (same_as_shipping && shippingAddress) {
        billingAddress = shippingAddress;
        billing_address_id = shipping_address_id;
    }

    // 3. Logic: Fallback
    // If we have a valid Billing Address but NO valid Shipping Address, use Billing for both.
    // This covers: 
    // - shipping_address_id not provided
    // - shipping_address_id provided but inactive (status: 0)
    if (billingAddress && !shippingAddress) {
        shippingAddress = billingAddress;
        shipping_address_id = billing_address_id;
    }

    // 4. Final Validation
    if (!billingAddress)
      return res
        .status(400)
        .json({ status: 400, message: "Billing address not found or inactive" });
    if (!shippingAddress)
      return res
        .status(400)
        .json({ status: 400, message: "Shipping address not found or inactive" });

    // GST calculation setup (India only)
    const billingState = billingAddress.state?.trim().toLowerCase();
    const businessState = "gujarat";
    let taxRateCGST = 0,
      taxRateSGST = 0,
      taxRateIGST = 0;

    if (billingState === businessState) {
      taxRateCGST = 0; // 9%
      taxRateSGST = 0; // 9%
    } else {
      taxRateIGST = 0; // 18%
    }
    let shippingCharge = 0;

    // Get Shipping Class and Method dynamically
    const shippingClass = await ShippingClass.findOne({
      shipping_class_name: "Standard",
      status: 1,
    });
    const shippingMethod = await ShippingMethod.findOne({
      shipping_method_name: "Free Shipping",
      status: 1,
    });

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
    // Initialize price variables
    let subtotal = 0,
      offerTotal = 0,
      totalCGST = 0,
      totalSGST = 0,
      totalIGST = 0,
      totalTax = 0;
    // shippingCharge = 50;
    let orderItemsArray = [];

    // Process cart items
    for (const item of cartItems) {
      const product = await Product.findById(item.product_id);
      if (!product) continue;

      // Check Stock
      const qty = Number(item.quantity || 1);
      if (product.stock_quantity < qty) {
        return res.status(400).json({
          status: 400,
          error: `Insufficient stock for product: ${product.product_name}. Available: ${product.stock_quantity}`,
        });
      }

      const actual = Number(product.actual_price || 0);
      const offer = Number(product.offer_price || actual);
      const itemOfferTotal = offer * qty;

      let cgst = 0,
        sgst = 0,
        igst = 0;

      // Calculate tax for this item
      if (billingState === businessState) {
        cgst = (itemOfferTotal * taxRateCGST) / 100;
        sgst = (itemOfferTotal * taxRateSGST) / 100;
      } else {
        igst = (itemOfferTotal * taxRateIGST) / 100;
      }

      const itemTax = cgst + sgst + igst;

      subtotal += actual * qty;
      offerTotal += itemOfferTotal;
      totalCGST += cgst;
      totalSGST += sgst;
      totalIGST += igst;
      totalTax += itemTax;

      orderItemsArray.push({
        product_id: item.product_id,
        qty,
        base_price: Number(actual.toFixed(2)),
        offer_price: Number(offer.toFixed(2)),
        cgst: Number(cgst.toFixed(2)),
        sgst: Number(sgst.toFixed(2)),
        igst: Number(igst.toFixed(2)),
        tax_amount: Number(itemTax.toFixed(2)),
        total_price: Number((itemOfferTotal + itemTax).toFixed(2)),
      });
    }

    // Calculate totals
    subtotal = Number(subtotal.toFixed(2));
    offerTotal = Number(offerTotal.toFixed(2));
    totalCGST = Number(totalCGST.toFixed(2));
    totalSGST = Number(totalSGST.toFixed(2));
    totalIGST = Number(totalIGST.toFixed(2));
    totalTax = Number(totalTax.toFixed(2));

    // Coupon Logic
    let couponDiscount = 0;
    let couponId = null;
    let { coupon_code } = req.body;

    if (coupon_code) {
        const coupon = await Coupon.findOne({ coupon_code: coupon_code, status: 1 });
        if (coupon) {
            const now = moment().tz("Asia/Kolkata");
            
            let isValid = true;
            // Removed date and amount checks

            if (isValid) {
              couponId = coupon._id;
              if (coupon.discount_type === 'percentage') {
                  couponDiscount = (offerTotal * Number(coupon.coupon_percentage)) / 100;
              } else if (coupon.discount_type === 'flat') {
                  couponDiscount = Number(coupon.coupon_percentage);
              }
            }
        }
    }
    
    // Ensure discount doesn't exceed total
    if (couponDiscount > offerTotal) {
        couponDiscount = offerTotal;
    }

    const discount = Number(couponDiscount.toFixed(2)); 
    
    const orderTotal = Number((offerTotal + totalTax).toFixed(2));
    const grandTotal = Number((orderTotal + shippingCharge - discount).toFixed(2));

    // Create Razorpay order OR Handle COD
    let rpOrder = null;
    let razorpayOrderOptions = {};
    const pMethod = payment_method ? payment_method.toLowerCase() : "razorpay";

    if (pMethod === "razorpay") {
      razorpayOrderOptions = {
        amount: Math.round(grandTotal * 100),
        currency: "INR",
        receipt: "rcpt_" + Date.now(),
        notes: { user_id: user_id.toString() },
      };
      // console.log("Creating Razorpay Order with options:", razorpayOrderOptions);
      rpOrder = await razorpay.orders.create(razorpayOrderOptions);
      // console.log("Razorpay Order Created:", rpOrder);
    }

    // Generate invoice number
    const orderInvoiceNo = await generateInvoiceNumber("RUNRKIDS");

    // Create order
    const createOrder = await Order.create({
      user_id: UID,
      order_invoice_no: orderInvoiceNo,
      order_subtotal: subtotal,
      order_offer_total: offerTotal,
      order_discount: discount,
      total_cgst: totalCGST,
      total_sgst: totalSGST,
      total_igst: totalIGST,
      order_tax: totalTax,
      order_total: orderTotal,
      order_shipping_charge: shippingCharge,
      order_grandtotal: grandTotal,
      order_status: pMethod === "cod" ? 2 : 0, // 0=Pending, 2=Confirmed for COD
      billing_address_id,
      shipping_address_id,
      razorpay_order_id: rpOrder ? rpOrder.id : null,
      payment_status: "pending",
      payment_method: pMethod,
      coupon_id: couponId, // Save coupon ID
    });

    // Insert order items
    for (const item of orderItemsArray) {
      await OrderItem.create({
        order_id: createOrder._id,
        product_id: item.product_id,
        qty: item.qty,
        base_price: item.base_price,
        offer_price: item.offer_price,
        cgst: item.cgst,
        sgst: item.sgst,
        igst: item.igst,
        tax_amount: item.tax_amount,
        total_price: item.total_price,
      });
    }

    // Log order activity
    let activityDetails = pMethod === "cod"
          ? "Order placed via Cash on Delivery"
          : "Order created and Razorpay order initiated";
    
    await OrderActivity.create({
      order_id: createOrder._id,
      user_id: UID,
      order_activity_type: "Order Created",
      order_activity_details: activityDetails,
      created_at: new Date(),
    });

    if (coupon_code && discount > 0) {
        await OrderActivity.create({
            order_id: createOrder._id,
            user_id: UID,
            order_activity_type: "Coupon Applied",
            order_activity_details: `Coupon Applied: ${coupon_code} (Discount: ₹${discount})`,
            created_at: new Date(),
        });
    }

    // Handle COD Specifics (Invoice & Response)
      if (pMethod === "cod") {
        let invoicePath = null;
        try {
          const invoiceResult = await generateInvoice(createOrder._id);
          const fullInvoicePath = invoiceResult.filePath;
          
          if (fullInvoicePath) {
            const filename = path.basename(fullInvoicePath);
            invoicePath = `media/invoice/${filename}`;

            await Order.findByIdAndUpdate(createOrder._id, {
              invoice_path: invoicePath,
            });
            createOrder.invoice_path = invoicePath;

          // WhatsApp Invoice (COD)
          // try {
          //   const user = await User.findById(UID);
          //   if (user && user.mobile) {
          //     let mobile = user.mobile.replace(/\D/g, '');
          //     if (mobile.length === 10) mobile = '91' + mobile;
          //     const customerName = user.first_name || 'Customer';
          //     await whatsappService.sendInvoice(mobile, invoicePath, createOrder.guid || createOrder._id, customerName);
          //   }
          // } catch (waErr) {
          //   logger.error("WhatsApp Invoice Error (COD)", { error: waErr.message });
          // }

            await OrderActivity.create({
              order_id: createOrder._id,
              user_id: UID,
              order_activity_type: "Invoice Generated",
              order_activity_details: "Invoice generated successfully",
              created_at: new Date(),
            });

            // Log Email Status
            if (invoiceResult.emailSent) {
                await OrderActivity.create({
                    order_id: createOrder._id,
                    user_id: UID,
                    order_activity_type: "Invoice Email Sent",
                    order_activity_details: "Invoice email sent successfully to user",
                    created_at: new Date(),
                });
            } else {
                await OrderActivity.create({
                    order_id: createOrder._id,
                    user_id: UID,
                    order_activity_type: "Invoice Email Failed",
                    order_activity_details: `Failed to send invoice email: ${invoiceResult.emailError}`,
                    created_at: new Date(),
                });
            }
          }
        } catch (invErr) {
          logger.error("Invoice generation failed for COD", {
            order_id: createOrder._id,
            error: invErr.message,
          });
        }

      // Clear Cart & Update Stock
      await ProductCart.updateMany(
        { user_id: UID, status: 1 },
        { $set: { status: 0 } }
      );

      // Decrement Stock for COD
      for (const item of orderItemsArray) {
        await Product.findByIdAndUpdate(item.product_id, {
          $inc: { stock_quantity: -item.qty },
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Order placed successfully (COD)",
        order_id: createOrder._id,
        order_number: createOrder.guid,
        invoice_path: invoicePath,
        payment_method: "cod",
        order_status: createOrder.order_status, // 2 = confirmed
      });
    }

    // Send response for Razorpay
    if (!rpOrder || !rpOrder.id) {
        throw new Error("Failed to create Razorpay order. rpOrder is null or missing id.");
    }

    return res.status(200).json({
      status: 200,
      message: "Order created, proceed to payment",
      order_id: createOrder._id,
      order_number: createOrder.guid,
      razorpay_order_id: rpOrder.id,
      amount: razorpayOrderOptions.amount,
      currency: razorpayOrderOptions.currency,
      key_id: config.RAZORPAY_KEY_ID,
      order_status: createOrder.order_status, // 0 = Pending
    });
  } catch (err) {
    // console.error("Order Summary Error Full Object:", JSON.stringify(err, null, 2));
    // console.error("Order Summary Error Message:", err.message);
    return res.status(500).json({ status: 500, error: err.message || "Unknown Server Error during Order Creation" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    logger.info("verifyPayment called", {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
    });

    if (
      !order_id ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      logger.warn("verifyPayment missing fields", { body: req.body });

      return res.status(400).json({
        status: 400,
        error: "Missing payment details",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;
    logger.info("Signature validation result", { isValid });

    if (!isValid) {
      await Order.findByIdAndUpdate(order_id, {
        payment_status: "failed",
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      logger.warn("Invalid Razorpay signature", { order_id });

      return res.status(400).json({
        status: 400,
        error: "Invalid payment signature",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      order_id,
      {
        payment_status: "success",
        order_status: 2, // 2 = Confirmed
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      { new: true }
    );

    logger.info("Order updated to success", { order_id: updatedOrder._id });

    // 2) INVOICE GENERATION YAHAN
    let invoicePath = null;
    try {
      logger.info("Generating invoice for order:", updatedOrder._id);
      const invoiceResult = await generateInvoice(updatedOrder._id);
      const fullInvoicePath = invoiceResult.filePath;
      logger.info("Invoice generated at:", fullInvoicePath);

      if (fullInvoicePath) {
        // Extract filename and create relative path
        const filename = path.basename(fullInvoicePath);
        invoicePath = `media/invoice/${filename}`;

        await Order.findByIdAndUpdate(updatedOrder._id, {
          invoice_path: invoicePath,
        });
        updatedOrder.invoice_path = invoicePath;

        // WhatsApp Invoice (Online)
        // try {
        //     const user = await User.findById(updatedOrder.user_id);
        //     if (user && user.mobile) {
        //         let mobile = user.mobile.replace(/\D/g, '');
        //         if (mobile.length === 10) mobile = '91' + mobile;
        //         const customerName = user.first_name || 'Customer';
        //         await whatsappService.sendInvoice(mobile, invoicePath, updatedOrder.guid || updatedOrder._id, customerName);
        //     }
        // } catch (waErr) {
        //     logger.error("WhatsApp Invoice Error (Online)", { error: waErr.message });
        // }

        await OrderActivity.create({
          order_id: updatedOrder._id,
          user_id: updatedOrder.user_id,
          order_activity_type: "Invoice Generated",
          order_activity_details: "Invoice generated successfully",
          created_at: new Date(),
        });
        logger.info("Invoice Activity Logged for order:", updatedOrder._id);

        // Log Email Status
        if (invoiceResult.emailSent) {
            await OrderActivity.create({
                order_id: updatedOrder._id,
                user_id: updatedOrder.user_id,
                order_activity_type: "Invoice Email Sent",
                order_activity_details: "Invoice email sent successfully to user",
                created_at: new Date(),
            });
        } else {
            await OrderActivity.create({
                order_id: updatedOrder._id,
                user_id: updatedOrder.user_id,
                order_activity_type: "Invoice Email Failed",
                order_activity_details: `Failed to send invoice email: ${invoiceResult.emailError}`,
                created_at: new Date(),
            });
        }
      }

    } catch (invErr) {
      logger.error("Invoice generation failed", {
        order_id: updatedOrder._id,
        error: invErr.message,
      });
    }

    await OrderActivity.create({
      order_id: updatedOrder._id,
      user_id: updatedOrder.user_id,
      order_activity_type: "Payment Success",
      order_activity_details: "Razorpay payment verified successfully",
      created_at: new Date(),
    });

    await ProductCart.updateMany(
      { user_id: updatedOrder.user_id, status: 1 },
      { $set: { status: 0 } }
    );

    // Decrement Stock for Razorpay (Verified Payment)
    const orderItems = await OrderItem.find({ order_id: updatedOrder._id });
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product_id, {
        $inc: { stock_quantity: -item.qty },
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Payment verified and order confirmed",
      order: updatedOrder,
      invoice_path: invoicePath,
    });
  } catch (err) {
    logger.error("Payment Verify Error", {
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      status: 500,
      error: err.message,
    });
  }
};

exports.paymentFailure = async (req, res) => {
    try {
        const { order_id, razorpay_order_id, razorpay_payment_id, error, code, message } = req.body;

        logger.warn("Payment Failure Reported", { order_id, error, code, message });

        if (!order_id) {
            return res.status(400).json({ status: 400, message: "Order ID is required" });
        }

        // Update Order to Failed
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            {
                payment_status: "failed",
                razorpay_order_id: razorpay_order_id || undefined,
                razorpay_payment_id: razorpay_payment_id || undefined
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        // Log Failure Activity
        let failureReason = "Payment failed during checkout";
        if (error) {
            if (error.description) {
                // Web SDK Error Format
                failureReason = error.description;
                if (error.reason) failureReason += ` (${error.reason})`;
            } else if (error.message) {
                // Flutter/Android/iOS SDK Error Format
                failureReason = error.message;
                if (error.code) failureReason += ` (Code: ${error.code})`;
            }
        } else if (code || message) {
            // Direct Flutter/Mobile SDK Error Format (Flat JSON)
            if (message) failureReason = message;
            if (code) failureReason += ` (Code: ${code})`;
        }

        await OrderActivity.create({
            order_id: updatedOrder._id,
            user_id: updatedOrder.user_id,
            order_activity_type: "Payment Failed",
            order_activity_details: failureReason,
            created_at: new Date(),
        });

        return res.status(200).json({
            status: 200,
            message: "Order status updated to failed",
            order_id: updatedOrder._id
        });

    } catch (err) {
        logger.error("Payment Failure API Error", { error: err.message });
        return res.status(500).json({ status: 500, error: err.message });
    }
};

exports.manageOrder = async (req, res) => {
    try {
        const { order_id, order_status } = req.body;

        if (!order_id || order_status === undefined) {
            return res.status(400).json({ status: 400, message: "order_id and order_status are required" });
        }

        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        if (order.order_status === 0) {
            return res.status(400).json({ status: 400, message: "Cannot update order status when it is Pending" });
        }

        const targetStatus = Number(order_status);
        let activityType = "";
        let activityDetails = "";
        let updateData = { order_status: targetStatus };

        /*
            Status Mapping:
            0 - pending (No update allowed)
            1 - completed
            2 - confirmed
            3 - cancelled
            4 - shipped
            5 - delivered
        */

        if (targetStatus === 4) { 
            activityType = "Order Shipped";
            activityDetails = "Order Shipped successfully";
        } else if (targetStatus === 5) { 
            activityType = "Order Delivered";
            activityDetails = "Order Delivered successfully";

            if (order.payment_method === 'cod') {
                updateData.payment_status = 'success';
            }
        } else if (targetStatus === 1) { 
            activityType = "Order Completed";
            activityDetails = "Order Complete";
        } else {
            if(targetStatus === 3) {
                activityType = "Order Cancelled";
                activityDetails = "Order has been cancelled by admin";
            } 
            // else {
            //     activityType = "Order Status Updated";
            //     activityDetails = `Order status updated to ${targetStatus}`;
            // }
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            updateData,
            { new: true }
        );
        // ).populate('user_id');

        // WhatsApp Status Notification
        // try {
        //     if (updatedOrder.user_id && updatedOrder.user_id.mobile) {
        //         let mobile = updatedOrder.user_id.mobile.replace(/\D/g, '');
        //         if (mobile.length === 10) mobile = '91' + mobile;

        //         let templateName = null;
        //         if (targetStatus === 4) templateName = 'order_shipped'; // Shipped
        //         else if (targetStatus === 5) templateName = 'order_delivered'; // Delivered
        //         else if (targetStatus === 1) templateName = 'order_completed'; // Completed
        //         else if (targetStatus === 3) templateName = 'order_cancelled'; // Cancelled
        //         else if (targetStatus === 0) templateName = 'order_pending'; // Pending

        //         if (templateName) {
        //             const customerName = updatedOrder.user_id.first_name || 'Customer';
        //             const orderNo = updatedOrder.guid || updatedOrder._id;
        //             const trackingLink = `https://runrkids.com/track-order/${orderNo}`;
        //             const supportLink = `https://runrkids.com/contact-us`;
        //             const reviewLink = `https://runrkids.com/review`;

        //             let components = [];

        //             if (templateName === 'order_shipped') {
        //                 // User Format: "📦 Update for your order #{{1}}: Current status — {{2}}. You can track... {{3}}"
        //                 components = [{
        //                     type: 'body',
        //                     parameters: [
        //                         { type: 'text', text: orderNo },           // {{1}}
        //                         { type: 'text', text: 'Shipped' },         // {{2}}
        //                         { type: 'text', text: trackingLink }       // {{3}}
        //                     ]
        //                 }];
        //             } else if (templateName === 'order_delivered') {
        //                 // User Format: "🛵 Great news, {{1}}! ... {{2}}"
        //                 components = [{
        //                     type: 'body',
        //                     parameters: [
        //                         { type: 'text', text: customerName },      // {{1}}
        //                         { type: 'text', text: supportLink }        // {{2}}
        //                     ]
        //                 }];
        //             } else if (templateName === 'order_completed') {
        //                 // User Format: "🌟 Hi {{1}}... {{2}}"
        //                 components = [{
        //                     type: 'body',
        //                     parameters: [
        //                         { type: 'text', text: customerName },      // {{1}}
        //                         { type: 'text', text: reviewLink }         // {{2}}
        //                     ]
        //                 }];
        //             } else {
        //                 // Default fallback (Pending/Cancelled)
        //                  components = [{
        //                     type: 'body',
        //                     parameters: [
        //                         { type: 'text', text: customerName },
        //                         { type: 'text', text: orderNo }
        //                     ]
        //                 }];
        //             }

        //             await whatsappService.sendMessage(mobile, templateName, 'en_US', components);
        //         }
        //     }
        // } catch (waErr) {
        //     logger.error("WhatsApp Status Notification Error", { error: waErr.message });
        // }

        if (activityType) {
            await OrderActivity.create({
                order_id: updatedOrder._id,
                user_id: updatedOrder.user_id,
                order_activity_type: activityType, 
                order_activity_details: activityDetails,
                created_at: new Date(),
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (err) {
        logger.error("manageOrder Error", { error: err.message });
        return res.status(500).json({ status: 500, error: err.message });
    }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    const {
      status,
      search,
      limit,
      offset,
      sort_by,
      sort_order,
      _id,
      user_id,
      order_status,
      payment_status,
      from_date,
      to_date,
      type,
      date_filter,
    } = req.body;

    if (!type) {
      return res.status(400).json({
        status: 400,
        message: "type is required. Accepted values: order_list, order_detail",
      });
    }

    if (!["order_list", "order_detail"].includes(type)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid type. Valid values: order_list, order_detail",
      });
    }

    let statusFilter;
    if (Array.isArray(status)) {
      statusFilter = status.length ? status : [1, 0];
    } else if (status !== undefined && status !== null && status !== "") {
      statusFilter = [Number(status)];
    } else {
      statusFilter = [1];
    }

    let query = { status: { $in: statusFilter } };

    if (_id) query._id = _id;
    if (user_id) query.user_id = user_id;
    if (order_status !== undefined && order_status !== null) {
      if (Array.isArray(order_status)) {
        query.order_status = { $in: order_status.map(Number) };
      } else {
        query.order_status = Number(order_status);
      }
    }

    if (payment_status !== undefined && payment_status !== null && payment_status !== "") {
      query.$or = [
        {
          payment_method: "razorpay",
          payment_status: Array.isArray(payment_status)
            ? { $in: payment_status }
            : payment_status,
        },
        {
          payment_method: "cod",
        },
      ];
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");

      const users = await User.find({
        $expr: {
          $regexMatch: {
            input: { $concat: ["$first_name", " ", "$last_name"] },
            regex: searchRegex,
          },
        },
      }).select("_id");

      const userIds = users.map(u => u._id);

      if (userIds.length) {
        query.user_id = { $in: userIds };
      } else {
        query._id = { $in: [] };
      }
    }

     if (date_filter) {
        query.created_at = {};
        const now = moment().tz("Asia/Kolkata");

        if (date_filter === "last_30_days") {
             query.created_at.$gte = now.clone().subtract(30, "days").toDate();
        } else if (date_filter === "older") {
             // "Older" than 2025 as per user request context implies before the explicit years
             query.created_at.$lt = moment("2025-01-01").tz("Asia/Kolkata").toDate();
        } else if (/^\d{4}$/.test(date_filter)) {
             // Handle specific year e.g. "2025", "2026"
             const year = parseInt(date_filter);
             const startOfYear = moment().tz("Asia/Kolkata").year(year).startOf('year');
             const endOfYear = moment().tz("Asia/Kolkata").year(year).endOf('year');
             
             query.created_at.$gte = startOfYear.toDate();
             query.created_at.$lte = endOfYear.toDate();
        }
     }

     if (!date_filter && (from_date || to_date)) {
      query.created_at = {};

      if (from_date) {
        query.created_at.$gte = new Date(from_date);
      }

      if (to_date) {
        query.created_at.$lte = new Date(new Date(to_date).setHours(23, 59, 59, 999));
      }
    }
    const pageLimit = limit ? parseInt(limit) : 0;
    const pageOffset = offset ? parseInt(offset) : 0;

    const sortField = sort_by || "created_at";
    const sortDirection = sort_order === "asc" ? 1 : -1;

    let orderQuery = Order.find(query)
      .populate({ path: "created_by", select: "first_name last_name" })
      .populate({ path: "updated_by", select: "first_name last_name" })
      .populate({ path: "user_id", select: "first_name last_name" })
      .sort({ [sortField]: sortDirection })
      .skip(pageOffset);

    if (pageLimit > 0) {
      orderQuery = orderQuery.limit(pageLimit);
    }

    const order = await orderQuery;
    const orderItemsMap = {};
    const orderActivityMap = {};

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const bucketName = config.AWS_BUCKET_NAME || "runrkids";
    const region = config.AWS_REGION || "ap-south-1";
    const s3BaseUrl = `https://${bucketName}.s3.${region}.amazonaws.com/`;

    const productBaseUrl =
      config.NODE_ENV === "production"
        ? `https://${bucketName}.s3.${region}.amazonaws.com/media/product/`
        : `${baseUrl}/media/product/`;

    for (const o of order) {
      const items = await OrderItem.find({ order_id: o._id })
        .populate({
          path: "product_id",
          select: "product_name product_img product_slug product_sku",
        })
        .lean();

      // === Check reviews for this order's user ===
      let reviewedProductSet = new Set();
      if (o.user_id) {
        // Collect all product IDs in this order
        const productIds = items
          .map((i) => i.product_id?._id || i.product_id)
          .filter((id) => mongoose.Types.ObjectId.isValid(id));

        if (productIds.length > 0) {
          const reviews = await Review.find({
            user_id: o.user_id._id || o.user_id, // handle populated or unpopulated user_id
            product_id: { $in: productIds },
            status: 1,
          }).select("product_id");

          reviews.forEach((r) =>
            reviewedProductSet.add(r.product_id.toString())
          );
        }
      }

      const formattedItems = items.map((i) => {
        let proportionalDiscount = 0;
        if (o.order_offer_total > 0 && o.order_discount > 0) {
          const itemOfferTotal = (i.offer_price || 0) * (i.qty || 1);
          proportionalDiscount =
            (itemOfferTotal / o.order_offer_total) * o.order_discount;
        }
        const discountFixed = Number(proportionalDiscount.toFixed(2));

        const pid = i.product_id?._id?.toString() || i.product_id?.toString();

        return {
          ...i,
          product_name: i.product_id?.product_name || null,
          product_sku: i.product_id?.product_sku || null,
          product_slug: i.product_id?.product_slug || null,
          product_id: pid,
          product_img: i.product_id?.product_img
            ? productBaseUrl + i.product_id.product_img.split("/").pop()
            : null,
          order_discount: discountFixed,
          total_price: Number(((i.total_price || 0) - discountFixed).toFixed(2)),
          is_review: reviewedProductSet.has(pid),
        };
      });
      orderItemsMap[o._id] = formattedItems;
      const activity = await OrderActivity.find({ order_id: o._id }).sort({
        created_at: 1,
      });
      orderActivityMap[o._id] = activity;
    }

    const count = await Order.countDocuments(query);

    const orderList = await Promise.all(
      order.map(async (item) => {
        const base = {
          _id: item._id,
          order_no: item.order_no,
          order_status: item.order_status,
          order_total: item.order_total,
          created_at: moment(item.created_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
          updated_at: moment(item.updated_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
        let billingAddress = null;
        let shippingAddress = null;

        if (item.billing_address_id) {
          billingAddress = await DeliveryAddress.findById(
            item.billing_address_id
          ).lean();
        }

        if (item.shipping_address_id) {
          shippingAddress = await DeliveryAddress.findById(
            item.shipping_address_id
          ).lean();
        }

        billingAddress = billingAddress ? [billingAddress] : [];
        shippingAddress = shippingAddress ? [shippingAddress] : [];

        const invoiceBaseUrl =
          config.NODE_ENV === "production"
            ? s3BaseUrl
            : `${baseUrl}/`;

        const fullInvoicePath = item.invoice_path
          ? invoiceBaseUrl + item.invoice_path
          : null;

        if (type === "order_list") {
          return {
            ...base,
            order_subtotal: item.order_subtotal,
            order_tax: item.order_tax,
            order_discount: item.order_discount,
            order_total: Number((item.order_total - (item.order_discount || 0)).toFixed(2)),
            order_offer_total: item.order_offer_total,
            order_shipping_charge: item.order_shipping_charge,
            order_status: item.order_status,
            payment_method: item.payment_method,
            payment_status: item.payment_status,
            invoice_path: fullInvoicePath,
            status: item.status,
            user_id: item.user_id ? item.user_id._id : null,
            user_name: item.user_id
              ? `${item.user_id.first_name} ${item.user_id.last_name}`
              : null,
          };
        }

        if (type === "order_detail") {
          return {
            ...base,
            order_subtotal: item.order_subtotal,
            total_cgst: item.total_cgst,
            total_sgst: item.total_sgst,
            total_igst: item.total_igst,
            order_tax: item.order_tax,
            order_discount: item.order_discount,
            order_total: Number((item.order_total - (item.order_discount || 0)).toFixed(2)),
            order_offer_total: item.order_offer_total,
            order_shipping_charge: item.order_shipping_charge,
            order_status: item.order_status,
            order_invoice_no: item.order_invoice_no,
            payment_method: item.payment_method,
            razorpay_order_id: item.razorpay_order_id,
            razorpay_payment_id: item.razorpay_payment_id,
            razorpay_signature: item.razorpay_signature,
            payment_status: item.payment_status,
            invoice_path: fullInvoicePath,
            status: item.status,
            user_id: item.user_id ? item.user_id._id : null,
            user_name: item.user_id
              ? `${item.user_id.first_name} ${item.user_id.last_name}`
              : null,
            order_items: orderItemsMap[item._id] || [],
            order_activity: orderActivityMap[item._id] || [],
            billing_address: billingAddress,
            shipping_address: shippingAddress,
          };
        }
      })
    );
    res.status(200).json({
      message: "Order fetched successfully",
      status: 200,
      count,
      data: orderList,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderRevenueSummary = async (req, res, next) => {
  try {
    const today = moment().tz("Asia/Kolkata").startOf("day");
    const monthStart = moment().tz("Asia/Kolkata").startOf("month");
    const yearStart = moment().tz("Asia/Kolkata").startOf("year");

    const result = await Order.aggregate([
      {
        $match: {
          status: 1,
          order_status: { $in: [1, 2, 4, 5] }
        }
      },
      {
        $facet: {
          today: [
            { $match: { created_at: { $gte: today.toDate() } } },
            { $group: { _id: null, total: { $sum: "$order_grandtotal" } } },
          ],
          this_month: [
            { $match: { created_at: { $gte: monthStart.toDate() } } },
            { $group: { _id: null, total: { $sum: "$order_grandtotal" } } },
          ],
          this_year: [
            { $match: { created_at: { $gte: yearStart.toDate() } } },
            { $group: { _id: null, total: { $sum: "$order_grandtotal" } } },
          ],
        },
      },
    ]);

    const todayTotal = result[0].today[0] ? result[0].today[0].total : 0;
    const monthTotal = result[0].this_month[0]
      ? result[0].this_month[0].total
      : 0;
    const yearTotal = result[0].this_year[0]
      ? result[0].this_year[0].total
      : 0;

    return res.status(200).json({
      status: 200,
      message: "Order revenue summary fetched successfully",
      data: {
        today_total: todayTotal,
        month_total: monthTotal,
        year_total: yearTotal,
      },
    });
  } catch (error) {
    next(error);
  }
};

const sendCancellationEmailHelper = async (order, user) => {
    try {
        logger.info(`Attempting to send cancellation email for user_id: ${user._id}`);
        
        if (!user.email) {
            logger.warn(`User found but no email present for user_id: ${user._id}`);
            return { emailSent: false, emailError: "User has no email" };
        }

        logger.info(`User found: ${user.email}. Preparing email...`);
        const rootDir = path.join(__dirname, "..");
        const logoPath = path.join(rootDir, "media", "logo", "logo.webp");
        let logoBase64 = "";
        
        const logoExists = fs.existsSync(logoPath);
        logger.info(`Logo path: ${logoPath}, Exists: ${logoExists}`);

        if (logoExists) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/webp;base64,${logoBuffer.toString("base64")}`;
        }

        logger.info("Calling sendMail function...");
        const ccEmails = [
            "runrkids@runr.in"
        ];
        const bccEmails = [
            "sagar@runr.in",
            "kaushal@themidnight.in",
            "nirali@themidnight.in",
            "jyoti@themidnight.in",
            "vidhi@themidnight.in",
            "kinal@insomniacs.in"
        ];
        
        await sendMail(
            user.email,
            ccEmails,
            bccEmails,
            `Order Cancelled: #${order._id || order.order_invoice_no}`,
            "order-cancel.ejs",
            {
                user_first_name: user.first_name || "Customer",
                user_last_name: user.last_name || "",
                order_no: order._id || order.order_invoice_no ,
                logoBase64: logoBase64
            }
        );
        logger.info(`Cancellation email sent successfully to ${user.email}`);
        return { emailSent: true, emailError: null };

    } catch (emailErr) {
        logger.error(`Failed to send cancellation email: ${emailErr.message}`, { stack: emailErr.stack });
        return { emailSent: false, emailError: emailErr.message };
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const { order_id, user_id } = req.body || {};

        if (!order_id) {
            return res.status(400).json({ status: 400, message: "order_id is required" });
        }
        if (!user_id) {
            return res.status(400).json({ status: 400, message: "user_id is required" });
        }

        const order = await Order.findOne({ _id: order_id, user_id: user_id });

        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found or unauthorized access" });
        }

        if (order.order_status === 3) {
            return res.status(400).json({ status: 400, message: "Order is already cancelled" });
        }

        if (order.order_status >= 4) { //shipped or delivered time order not cancelled
            return res.status(400).json({ status: 400, message: "Order cannot be cancelled at this stage" });
        }

        // Update Order Status
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { order_status: 3 }, 
            { new: true }
        );

        // Add to Order Activity
        await OrderActivity.create({
            order_id: order_id,
            user_id: user_id,
            order_activity_type: "Order Cancelled",
            order_activity_details: "Order cancelled by Customer",
            created_at: new Date(),
        });
        
        // Restore Stock Logic
        const orderItems = await OrderItem.find({ order_id: order_id });
        if (orderItems && orderItems.length > 0) {
            for (const item of orderItems) {
                 await Product.findByIdAndUpdate(item.product_id, {
                    $inc: { stock_quantity: item.qty },
                });
            }
        }

        // Send Email via Helper
        const user = await User.findById(user_id);
        if (user) {
            const emailResult = await sendCancellationEmailHelper(updatedOrder, user);
            
            if (emailResult.emailSent) {
                await OrderActivity.create({
                    order_id: order_id,
                    user_id: user_id,
                    order_activity_type: "Cancellation Email Sent",
                    order_activity_details: "Order cancellation email sent successfully",
                    created_at: new Date(),
                });
            } else {
                await OrderActivity.create({
                    order_id: order_id,
                    user_id: user_id,
                    order_activity_type: "Cancellation Email Failed",
                    order_activity_details: `Failed to send cancellation email: ${emailResult.emailError}`,
                    created_at: new Date(),
                });
            }
        }

        return res.status(200).json({
            status: 200,
            message: "Order cancelled successfully",
            data: updatedOrder
        });

    } catch (error) {
        next(error);
    }
};

exports.getOrderStatusCounts = async (req, res, next) => {
  try {
    const result = await Order.aggregate([
      {
        $match: {
          status: 1,
        },
      },
      {
        $group: {
          _id: "$order_status",
          count: { $sum: 1 },
        },
      },
    ]);

    const stats = {
      pending: 0,
      completed: 0,
      confirmed: 0,
      cancelled: 0,
      total: 0,
    };

    result.forEach((item) => {
      switch (item._id) {
        case 0:
          stats.pending = item.count;
          break;
        case 1:
          stats.completed = item.count;
          break;
        case 2:
          stats.confirmed = item.count;
          break;
        case 3:
          stats.cancelled = item.count;
          break;
      }
    });

    const total = await Order.countDocuments({ status: 1 });
    stats.total = total;

    return res.status(200).json({
      status: 200,
      message: "Order status counts fetched successfully",
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// Conversions This Year
exports.getCategoryOrderStats = async (req, res, next) => {
  try {
    let { date_filter, from_date, to_date } = req.body;
    
    // Use Helper for Date Calculation
    const { startDate, endDate } = calculateDateRange(date_filter, from_date, to_date);

    const result = await OrderItem.aggregate([
      // 1. Lookup Order
      {
        $lookup: {
          from: Order.collection.name, 
          localField: "order_id",
          foreignField: "_id",
          as: "order_data",
        },
      },
      { $unwind: "$order_data" },
      {
        $match: {
          "order_data.status": 1,
          "order_data.order_status": { $gt: 0 },
          "order_data.created_at": {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      // 2. Lookup Relational Category 
      {
        $lookup: {
            from: RelationalCategory.collection.name, 
            localField: "product_id",
            foreignField: "product_id",
            as: "rel_cat",
        }
      },
      { $unwind: "$rel_cat" },

      // 3. Lookup Actual Category Name
      {
          $lookup: {
              from: Category.collection.name, 
              localField: "rel_cat.category_id",
              foreignField: "_id",
              as: "category_info"
          }
      },
      { $unwind: "$category_info" },

      // 4. Group by Month and Category
      {
        $project: {
            month: { $month: { date: "$order_data.created_at", timezone: "Asia/Kolkata" } }, // 1-12
            category_name: "$category_info.category_name",
        }
      },
      {
          $group: {
              _id: {
                  month: "$month",
                  category: "$category_name"
              },
              count: { $sum: 1 }
          }
      },
      // 5. Structure for Chart
      {
          $group: {
              _id: "$_id.month",
              categories: {
                  $push: {
                      k: "$_id.category",
                      v: "$count"
                  }
              }
          }
      },
      { $sort: { _id: 1 } } 
    ]);
    
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const finalData = result.map(m => {
        const obj = { month: monthNames[m._id] };
        m.categories.forEach(c => {
            obj[c.k] = c.v;
        });
        return obj;
    });

    return res.status(200).json({
      status: 200,
      message: "Category stats fetched successfully",
      period: { startDate, endDate }, 
      data: finalData
    });

  } catch (error) {
    next(error);
  }
};

exports.getBrandOrderStats = async (req, res, next) => {
  try {
    let { date_filter, from_date, to_date } = req.body;
    
    // Use Helper for Date Calculation
    const { startDate, endDate } = calculateDateRange(date_filter, from_date, to_date);

    const result = await OrderItem.aggregate([
      // 1. Lookup Order for Status & Date Filter
      {
        $lookup: {
          from: Order.collection.name, 
          localField: "order_id",
          foreignField: "_id",
          as: "order_data",
        },
      },
      { $unwind: "$order_data" },
      {
        $match: {
          "order_data.status": 1,
          "order_data.order_status": { $gt: 0 },
          "order_data.created_at": {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      // 2. Lookup Product to get Brand Name (Brand info is in Product collection)
      {
        $lookup: {
            from: Product.collection.name, // "tbl_product" -> "tbl_products" (Wait, checks Product Model for collection name)
            localField: "product_id",
            foreignField: "_id",
            as: "product_info"
        }
      },
      { $unwind: "$product_info" },

      // 3. Group by Brand
      {
          $group: {
              _id: "$product_info.brand_name", // Group by Brand Name directly
              count: { $sum: 1 }
          }
      },
      // 4. Sort by Count Descending
      { $sort: { count: -1 } }
    ]);
    
    // Format for Pie Chart or generic list
    const finalData = result.map(item => ({
        brand_name: item._id || "Unknown Brand",
        count: item.count
    }));

    return res.status(200).json({
      status: 200,
      message: "Brand stats fetched successfully",
      period: { startDate, endDate },
      data: finalData
    });

  } catch (error) {
    next(error);
  }
};

exports.getHighestSellingProducts = async (req, res, next) => {
  try {
    const result = await OrderItem.aggregate([
      { $match: { status: 1 } },
      {
        $lookup: {
          from: "tbl_orders",
          localField: "order_id",
          foreignField: "_id",
          as: "order"
        }
      },
      { $unwind: "$order" },
      {
        $match: {
          "order.status": 1,
          "order.order_status": { $in: [1, 2, 4, 5] } 
        }
      },
      {
        $group: {
          _id: "$product_id",
          total_sold: { $sum: "$qty" }
        }
      },
      { $sort: { total_sold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "tbl_products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          product_name: "$product.product_name",
          product_sku: "$product.product_sku",
          total_sold: 1
        }
      }
    ]);

    return res.status(200).json({
      status: 200,
      message: "Highest selling products fetched successfully",
      data: result
    });

  } catch (error) {
    next(error);
  }
};

exports.resendInvoiceEmail = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ status: 400, message: "order_id is required" });
        }

        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        // Generate invoice (this will resend the email)
        const invoiceResult = await generateInvoice(order_id);

        if (invoiceResult.emailSent) {
            await OrderActivity.create({
                order_id: order._id,
                user_id: order.user_id,
                order_activity_type: "Invoice Email Resent",
                order_activity_details: "Invoice email resent manually by admin",
                created_at: new Date(),
            });

            return res.status(200).json({
                status: 200,
                message: "Invoice email sent successfully",
            });
        } else {
            await OrderActivity.create({
                order_id: order._id,
                user_id: order.user_id,
                order_activity_type: "Invoice Email Resend Failed",
                order_activity_details: `Failed to resend invoice email: ${invoiceResult.emailError}`,
                created_at: new Date(),
            });

            return res.status(500).json({
                status: 500,
                message: "Failed to send invoice email",
                error: invoiceResult.emailError
            });
        }

    } catch (err) {
        logger.error("resendInvoiceEmail Error", { error: err.message });
        return res.status(500).json({ status: 500, error: err.message });
    }
};

exports.resendCancellationEmail = async (req, res) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ status: 400, message: "order_id is required" });
        }

        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ status: 404, message: "Order not found" });
        }

        if (order.order_status !== 3) {
            return res.status(400).json({ status: 400, message: "Order is not cancelled" });
        }

        const user = await User.findById(order.user_id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const emailResult = await sendCancellationEmailHelper(order, user);

        if (emailResult.emailSent) {
            await OrderActivity.create({
                order_id: order._id,
                user_id: user._id,
                order_activity_type: "Cancellation Email Resent",
                order_activity_details: "Order cancellation email resent manually by admin",
                created_at: new Date(),
            });

            return res.status(200).json({
                status: 200,
                message: "Cancellation email sent successfully",
            });
        } else {
            await OrderActivity.create({
                order_id: order._id,
                user_id: user._id,
                order_activity_type: "Cancellation Email Resend Failed",
                order_activity_details: `Failed to resend cancellation email: ${emailResult.emailError}`,
                created_at: new Date(),
            });

            return res.status(500).json({
                status: 500,
                message: "Failed to send cancellation email",
                error: emailResult.emailError
            });
        }

    } catch (err) {
        logger.error("resendCancellationEmail Error", { error: err.message });
        return res.status(500).json({ status: 500, error: err.message });
    }
};
