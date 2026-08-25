const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');
const moment = require("moment-timezone");


const couponSchema = new mongoose.Schema({
    coupon_code: {
        type: String,
        required: [true, "coupon_code is required"],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: null
    },
    discount_type: {
        type: String,
        enum: ["flat", "percentage"],
        default: "percentage"
    },
    coupon_percentage: {
        type: String,
        required: [true, "coupon_percentage is required"]
    },
    guid: {
        type: String,
        default: () => generateRandomString(20)
    },
    status: {
        type: Number,
        enum: [1, 0],
        default: 1
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
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

couponSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("tbl_coupon", couponSchema);
