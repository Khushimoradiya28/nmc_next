const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { generateRandomString } = require("../helper");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      required: [true, "Banner image is mandatory"],
      trim: true,
    },
    image_webp: {
      type: String,
      trim: true,
      default: null,
    },
    guid: {
      type: String,
      default: () => generateRandomString(12),
      unique: true,
    },
    sort_order: {
      type: Number,
      default: 0,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    created_at: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").toDate(),
    },
    updated_at: {
      type: Date,
      default: () => moment().tz("Asia/Kolkata").toDate(),
    },
  },
  {
    timestamps: false,
  }
);

// Pre-save hook for Asia/Kolkata timestamp
bannerSchema.pre("save", function (next) {
  this.updated_at = moment().tz("Asia/Kolkata").toDate();
  next();
});

module.exports = mongoose.model("Banner", bannerSchema);
