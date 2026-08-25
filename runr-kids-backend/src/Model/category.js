const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const categorySchema = new mongoose.Schema({
    category_name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true
    },
    category_slug: {
      type: String,
      trim: true
    },
    category_image: {
      type: String,
      trim: true,
      required: [true, "Category image is required"]
    },
    is_trending: {
      type: Number,
      enum: [1, 0],
      default: 0
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

categorySchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Category", categorySchema);