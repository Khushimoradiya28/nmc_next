const mongoose = require ("mongoose");
const { generateRandomString } = require('../helper');

const brandSchema = new mongoose.Schema({
    brand_name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true
    },
    brand_slug: {
      type: String,
      trim: true
    },
    brand_logo: {
      type: String,
      trim: true,
      required: [true, "Brand logo is required"]
    },
    status: {
      type: Number,
      enum: [1, 0],
      default: 1
    },
    guid: { type: String, default: () => generateRandomString(12) },
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

brandSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Brand", brandSchema);