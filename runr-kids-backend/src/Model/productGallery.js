const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const productGallerySchema = new mongoose.Schema({
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tbl_product",
      required: true,
    },
    product_gallery_url: {
      type: String,
      required: true,
    },
    status: { type: String, default: "1" },
    guid: { type: String, default: () => generateRandomString(12) },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: String,
    updated_by: String
});

productGallerySchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("ProductGallery", productGallerySchema);
