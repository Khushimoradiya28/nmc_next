const mongoose = require("mongoose");
const { generateRandomString } = require("../helper");

const profileImageSchema = new mongoose.Schema({
    image_url: {
        type: String,
        trim: true,
        required: [true, "Image URL is required"]
    },
    avtar_type: {
        type: String,
        trim: true,
        enum: ["male", "female"],
        required: [true, "Avatar type is required"]
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

profileImageSchema.pre("save", function (next) {
    this.updated_at = Date.now();
    next();
});

module.exports = mongoose.model("tbl_profile_image", profileImageSchema);
