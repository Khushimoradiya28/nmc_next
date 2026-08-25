const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const productOrderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  coupon_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_coupon",
    default: null
  },
  shipping_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_shipping",
    default: null
  },
  // order_amount: {
  //   type: Number,
  //   default: 0
  // },
  order_invoice_no: {
    type: String,
    trim: true,
    default: null
  },
  billing_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAddress",
    default: null
  },
  shipping_address_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAddress",
    default: null
  },
  order_subtotal: {
    type: Number,
    default: 0
  },
  order_tax: {
    type: Number,
    default: 0
  },
  total_cgst: {
    type: Number,
  },
  total_sgst: {
    type: Number,
  },
  total_igst: {
    type: Number,
  },
  order_total: {
    type: Number,
    default: 0
  },
  order_offer_total: {
    type: Number,
    default: 0
  },
  order_discount: {
    type: Number,
    default: 0
  },
  order_grandtotal: {
    type: Number,
    default: 0
  },
  order_shipping_charge: {
    type: Number,
    default: 0
  },
  order_status: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5],
    // Customize:
    // 0 = pending
    // 1 = completed
    // 2 = confirmed
    // 3 = cancelled
    // 4 = shipped
    // 5 = delivered
    default: 0
  },

  invoice_path: {
    type: String,
    default: null,
  },

  payment_method: {
    type: String,
    enum: ["razorpay", "cod", "other"],
    default: "razorpay"
  },
  razorpay_order_id: {
    type: String,
    default: null
  },
  razorpay_payment_id: {
    type: String,
    default: null
  },
  razorpay_signature: {
    type: String,
    default: null
  },
  payment_status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  status: {
    type: Number,
    enum: [1, 0],
    default: 1
  },
  guid: { type: String, default: () => generateRandomString(20) },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
});

productOrderSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("tbl_order", productOrderSchema);
