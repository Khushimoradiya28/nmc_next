const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const relationalcategorySchema = new mongoose.Schema({
    product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tbl_product",
    required: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
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
 relationalcategorySchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("tbl_relational_category", relationalcategorySchema);
 