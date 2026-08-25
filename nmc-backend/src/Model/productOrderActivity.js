const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const orderItemSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_order",
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order_activity_type: {
        type: String,
        trim: true,
        required: true
    },
    order_activity_details: {
        type: String,
        trim: true,
        required: true
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

module.exports = mongoose.model("tbl_order_activity", orderItemSchema);
