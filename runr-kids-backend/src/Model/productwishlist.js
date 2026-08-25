const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const relationalageSchema = new mongoose.Schema({
    product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_product",
    required: [true, "product_id is required"],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    is_wishlist: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    visitor_tag: {
        type: String,
        default: null,
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 1
    },
    guid: {
        type: String,
        default: () => generateRandomString(20)
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
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

relationalageSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("tbl_wishlist", relationalageSchema);
