const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const orderItemSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_order",
        required: true,
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tbl_product",
        required: true,
    },
    qty: {
        type: Number,
        default: 1,
        required: true,
    },
    base_price: {
        type: Number,
        default: 0,
    },
    tax_amount: {
        type: Number,
        default: 0,
    },
    cgst: {
        type: Number,
    },
    sgst: {
        type: Number,

    },
    igst: {
        type: Number,
    },
    total_price: {
        type: Number,
        default: 0,
    },
    offer_price: {
        type: Number,
        default: 0,
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

module.exports = mongoose.model("tbl_order_item", orderItemSchema);
