const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const shippingclassSchema = new mongoose.Schema({
  shipping_method_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_shipping_method",
    default: null
  },
  shipping_class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_shipping_class",
    default: null
  },
  shipping_rate: {
    type: Number,
    required: [true, "shipping_rate is required"],
    trim: true
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

shippingclassSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("tbl_shipping", shippingclassSchema);