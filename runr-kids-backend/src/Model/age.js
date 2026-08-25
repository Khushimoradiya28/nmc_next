const mongoose = require("mongoose");
const { generateRandomString } = require('../helper');

const ageSchema = new mongoose.Schema({
    age_group: {
        type: String,
        required: [true, "age_group is required"],
        trim: true
    },
    age_label: {
        type: String,
        required: [true, "age_label is required"],
        trim: true
    },
    age_slug: {
        type: String,
        trim: true
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

ageSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

// Partial index: uniqueness only for active age groups
ageSchema.index(
    { age_group: 1 },
    { unique: true, partialFilterExpression: { status: 1 } }
);

module.exports = mongoose.model("tbl_age", ageSchema);
