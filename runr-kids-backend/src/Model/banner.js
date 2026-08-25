const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const bannerSchema = new mongoose.Schema({
    banner_title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true
    },
    banner_description: {
      type: String,
      required: [true, "Banner description is required"],
      trim: true
    },
    banner_img: {
      type: String,
      trim: true,
      required: [true, "Banner image is required"]
    },
    status: { type: String, default: "1" },
    guid: { type: String, default: () => generateRandomString(12) },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String
});

bannerSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("Banner", bannerSchema);